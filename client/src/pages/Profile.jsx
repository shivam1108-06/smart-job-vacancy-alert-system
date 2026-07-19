import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { getProfile } from "../services/user.service";

function Profile() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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

      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6">

        <div className="bg-white shadow-xl rounded-xl w-full max-w-md p-8">

          <div className="flex flex-col items-center">

            <div className="w-28 h-28 rounded-full bg-blue-600 flex items-center justify-center text-white text-5xl font-bold">
              {user.name?.charAt(0).toUpperCase()}
            </div>

            <h1 className="text-3xl font-bold mt-5 text-center break-words">
              {user.name}
            </h1>

            <p className="text-gray-500 mt-2 text-center break-all">
              {user.email}
            </p>

            <span className="mt-4 bg-blue-100 text-blue-700 px-4 py-2 rounded-full">
              {user.role}
            </span>

            {user.joinedDate && (
              <p className="text-gray-400 text-sm mt-3">
                Joined {new Date(user.joinedDate).toLocaleDateString()}
              </p>
            )}

          </div>

          <div className="mt-8 space-y-4">

            <button
              onClick={() => navigate("/dashboard")}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg transition"
            >
              Back to Dashboard
            </button>

            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition"
            >
              Logout
            </button>

          </div>

        </div>

      </div>
    </>
  );
}

export default Profile;
