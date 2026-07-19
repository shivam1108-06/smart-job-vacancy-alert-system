import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import Spinner from "../components/Spinner";
import FormField from "../components/FormField";
import { getProfile, updateProfile } from "../services/user.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_REGEX = /^[0-9+\-\s()]{7,15}$/;
const BIO_MAX_LENGTH = 300;

const validateProfileForm = (data) => {
  const errors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (data.email && !EMAIL_REGEX.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (data.mobile && !MOBILE_REGEX.test(data.mobile)) {
    errors.mobile = "Enter a valid mobile number.";
  }

  if (data.bio.length > BIO_MAX_LENGTH) {
    errors.bio = `Bio must be ${BIO_MAX_LENGTH} characters or fewer.`;
  }

  return errors;
};

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    mobile: "",
    bio: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);

      const response = await getProfile();

      setUser(response.data.user);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to load profile"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    setForm({
      fullName: user.name || "",
      email: user.email || "",
      mobile: user.mobile || "",
      bio: user.bio || "",
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleCancel = () => {
    setErrors({});
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSave = async (e) => {
    e.preventDefault();

    const validationErrors = validateProfileForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSaving(true);

      const response = await updateProfile({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        mobile: form.mobile.trim(),
        bio: form.bio.trim(),
      });

      setUser(response.data.user);
      toast.success(
        response.data.message || "Profile updated successfully"
      );
      setIsEditing(false);
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    localStorage.removeItem("token");

    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <div className="flex justify-center items-center h-screen">
          <h1 className="text-3xl font-bold">
            Loading...
          </h1>
        </div>
      </>
    );
  }

  if (!user) {
    return (
      <>
        <Navbar />

        <div className="flex flex-col justify-center items-center h-screen gap-4 px-6 text-center">
          <h1 className="text-2xl font-bold text-gray-700">
            Unable to load profile
          </h1>

          <button
            onClick={() => navigate("/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition"
          >
            Back to Dashboard
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4 sm:p-6">

        <div className="bg-white shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-2xl w-full max-w-md p-6 sm:p-8">

          <div className="flex flex-col items-center">

            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl sm:text-5xl font-bold shrink-0">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            {!isEditing && (
              <>
                <h1 className="text-2xl sm:text-3xl font-bold mt-5 text-center break-words">
                  {user.name}
                </h1>

                <p className="text-gray-500 mt-2 text-center break-all">
                  {user.email}
                </p>

                <span className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
                  {user.role}
                </span>

                {user.mobile && (
                  <p className="text-gray-600 mt-3 text-center">
                    {user.mobile}
                  </p>
                )}

                {user.bio && (
                  <p className="text-gray-600 mt-3 text-center whitespace-pre-wrap break-words">
                    {user.bio}
                  </p>
                )}

                {user.joinedDate && (
                  <p className="text-gray-400 text-sm mt-3">
                    Joined {new Date(user.joinedDate).toLocaleDateString()}
                  </p>
                )}
              </>
            )}

          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="mt-8 space-y-4">

              <FormField
                label="Full Name"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                error={errors.fullName}
                placeholder="Your full name"
              />

              <FormField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="you@example.com"
              />

              <FormField
                label="Mobile Number"
                name="mobile"
                type="tel"
                value={form.mobile}
                onChange={handleChange}
                error={errors.mobile}
                placeholder="Optional"
              />

              <FormField
                label="Bio"
                name="bio"
                as="textarea"
                rows={3}
                value={form.bio}
                onChange={handleChange}
                error={errors.bio}
                maxLength={BIO_MAX_LENGTH}
                placeholder="Tell us a little about yourself"
                helperText={`${form.bio.length}/${BIO_MAX_LENGTH}`}
              />

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
                >
                  {saving && <Spinner />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>

                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 active:scale-95 text-gray-800 py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>

            </form>
          ) : (
            <div className="mt-8 space-y-4">

              <button
                onClick={handleEditClick}
                className="w-full bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200"
              >
                Edit Profile
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="w-full bg-green-600 hover:bg-green-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200"
              >
                Back to Dashboard
              </button>

              <button
                onClick={handleLogout}
                className="w-full bg-red-600 hover:bg-red-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200"
              >
                Logout
              </button>

            </div>
          )}

        </div>

      </div>
    </>
  );
}

export default Profile;
