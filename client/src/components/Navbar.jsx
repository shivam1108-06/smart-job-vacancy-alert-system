import { Link } from "react-router-dom";

function Navbar() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="bg-slate-900 text-white px-6 py-4 flex justify-between items-center">
      <Link to="/dashboard" className="text-2xl font-bold">
        Job Vacancy Alert
      </Link>

      <div className="flex gap-3">
        <Link
          to="/add-job"
          className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Job
        </Link>

        <button
          onClick={handleLogout}
          className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;