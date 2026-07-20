import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../services/auth.service";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    const confirmLogout = window.confirm(
      "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* Logo */}
        <Link
          to="/dashboard"
          className="text-2xl font-bold hover:text-blue-400 transition"
        >
          Job Vacancy Alert
        </Link>

        {/* Navigation Buttons */}
        <div className="flex items-center gap-3">

          <Link
            to="/dashboard"
            className="bg-slate-700 px-4 py-2 rounded hover:bg-slate-600 transition"
          >
            Dashboard
          </Link>

          <Link
            to="/add-job"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            + Add Job
          </Link>

          <Link
            to="/profile"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Profile
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 transition"
          >
            Logout
          </button>

        </div>
      </div>
    </nav>
  );
}

export default Navbar;