import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import Spinner from "../components/Spinner";
import { registerUser } from "../services/auth.service";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_MIN_LENGTH = 8;

const INITIAL_FORM = {
  fullName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const validateRegisterForm = (data) => {
  const errors = {};

  if (!data.fullName.trim()) {
    errors.fullName = "Full name is required.";
  }

  if (!data.email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_REGEX.test(data.email)) {
    errors.email = "Enter a valid email address.";
  }

  if (!data.password) {
    errors.password = "Password is required.";
  } else if (data.password.length < PASSWORD_MIN_LENGTH) {
    errors.password = `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`;
  } else if (!/[A-Z]/.test(data.password)) {
    errors.password = "Password must contain an uppercase letter.";
  } else if (!/[a-z]/.test(data.password)) {
    errors.password = "Password must contain a lowercase letter.";
  } else if (!/[0-9]/.test(data.password)) {
    errors.password = "Password must contain a number.";
  }

  if (!data.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (data.password && data.confirmPassword !== data.password) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return errors;
};

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(form);

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setLoading(true);

      const response = await registerUser({
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      toast.success(response.data.message || "Registration Successful");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Registration Failed"
      );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Join Job Vacancy Alert to get curated job listings, save favorites, and manage everything in one dashboard."
    >
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Create Account
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Fill in your details to get started.
      </p>

      <form onSubmit={handleRegister} className="space-y-4">

        <FormField
          label="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          error={errors.fullName}
          disabled={loading}
          placeholder="Your full name"
        />

        <FormField
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
          disabled={loading}
          placeholder="you@example.com"
        />

        <div>
          <PasswordInput
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            error={errors.password}
            disabled={loading}
            placeholder="Create a password"
            helperText="Min 8 characters, with uppercase, lowercase & a number"
          />

          <PasswordStrengthMeter password={form.password} />
        </div>

        <PasswordInput
          label="Confirm Password"
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={loading}
          placeholder="Re-enter your password"
        />

        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading && <Spinner />}
          {loading ? "Creating account..." : "Register"}
        </button>

        <p className="text-center text-sm text-gray-500 pt-1">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Login
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Register;
