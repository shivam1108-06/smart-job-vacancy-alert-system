import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/auth.service";
import toast from "react-hot-toast";
import AuthLayout from "../components/AuthLayout";
import FormField from "../components/FormField";
import PasswordInput from "../components/PasswordInput";
import Spinner from "../components/Spinner";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await loginUser({
        email,
        password,
      });

      // Save JWT Token
      localStorage.setItem("token", response.data.token);

      toast.success("Login Successful!");

      navigate("/dashboard");

    } catch (error) {
      console.error(error);

      toast.error(
        error.response?.data?.message || "Login Failed"
    );

    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to track new job vacancies, manage your applications, and stay ahead of the market."
    >
      <h1 className="text-2xl font-bold text-slate-800 mb-1">
        Login
      </h1>
      <p className="text-sm text-gray-500 mb-6">
        Enter your details to access your dashboard.
      </p>

      <form onSubmit={handleLogin} className="space-y-4">

        <FormField
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          placeholder="you@example.com"
        />

        <PasswordInput
          label="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          placeholder="Enter your password"
        />

        <button
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white py-3 rounded-lg font-medium transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
          type="submit"
          disabled={loading}
        >
          {loading && <Spinner />}
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="text-center text-sm text-gray-500 pt-1">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-blue-600 hover:text-blue-700 font-medium"
          >
            Register
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default Login;
