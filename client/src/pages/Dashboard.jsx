import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { getJobs, deleteJob } from "../services/job.service";
import JobBarChart from "../components/JobBarChart";
import JobPieChart from "../components/JobPieChart";
import {
  FaBriefcase,
  FaBuilding,
  FaMapMarkerAlt,
  FaHeart,
  FaMoneyBillWave,
} from "react-icons/fa";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("latest");
  const [locationFilter, setLocationFilter] = useState("All");

  // Favorites
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);

      const response = await getJobs();

      setJobs(response.data.jobs);
    } catch (error) {
      console.log(error);

      toast.error("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);

      toast.success("Job Deleted Successfully!");

      fetchJobs();
    } catch (error) {
      console.log(error);

      toast.error(
        error.response?.data?.message || "Delete Failed"
      );
    }
  };

  const toggleFavorite = (jobId) => {
    let updatedFavorites;

    if (favorites.includes(jobId)) {
      updatedFavorites = favorites.filter(
        (id) => id !== jobId
      );

      toast.success("Removed from Favorites");
    } else {
      updatedFavorites = [...favorites, jobId];

      toast.success("Added to Favorites");
    }

    setFavorites(updatedFavorites);

    localStorage.setItem(
      "favorites",
      JSON.stringify(updatedFavorites)
    );
  };

  const filteredJobs = jobs
    .filter((job) => {
      const matchesSearch =
        job.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        job.company
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesLocation =
        locationFilter === "All" ||
        job.location === locationFilter;

      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "salaryHigh":
          return Number(b.salary) - Number(a.salary);

        case "salaryLow":
          return Number(a.salary) - Number(b.salary);

        case "oldest":
          return (
            new Date(a.createdAt) -
            new Date(b.createdAt)
          );

        default:
          return (
            new Date(b.createdAt) -
            new Date(a.createdAt)
          );
      }
    });

  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;

  const currentJobs = filteredJobs.slice(
    indexOfFirstJob,
    indexOfLastJob
  );

  const totalPages = Math.ceil(
    filteredJobs.length / jobsPerPage
  );

  // Analytics
  const totalSalary = jobs.reduce(
    (sum, job) => sum + Number(job.salary),
    0
  );

  const averageSalary =
    jobs.length > 0
      ? Math.round(totalSalary / jobs.length)
      : 0;

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

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-4 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Manage your latest job opportunities
            </p>
          </div>

          <Link
            to="/add-job"
            className="w-full md:w-auto text-center bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
          >
            + Add Job
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-blue-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-blue-100">
                  Total Jobs
                </h2>
                <p className="text-4xl font-bold mt-2">{jobs.length}</p>
              </div>
              <FaBriefcase className="text-3xl text-blue-200" />
            </div>
          </div>

          <div className="bg-green-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-green-100">
                  Companies
                </h2>
                <p className="text-4xl font-bold mt-2">
                  {new Set(jobs.map((job) => job.company)).size}
                </p>
              </div>
              <FaBuilding className="text-3xl text-green-200" />
            </div>
          </div>

          <div className="bg-purple-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-purple-100">
                  Locations
                </h2>
                <p className="text-4xl font-bold mt-2">
                  {new Set(jobs.map((job) => job.location)).size}
                </p>
              </div>
              <FaMapMarkerAlt className="text-3xl text-purple-200" />
            </div>
          </div>

          <div className="bg-pink-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-pink-100">
                  Favorites
                </h2>
                <p className="text-4xl font-bold mt-2">
                  {favorites.length}
                </p>
              </div>
              <FaHeart className="text-3xl text-pink-200" />
            </div>
          </div>
        </div>

        {/* Salary Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
          <div className="bg-indigo-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-indigo-100">
                  Total Salary
                </h2>
                <p className="text-3xl font-bold mt-2">
                  ₹ {totalSalary.toLocaleString()}
                </p>
              </div>
              <FaMoneyBillWave className="text-3xl text-indigo-200" />
            </div>
          </div>

          <div className="bg-orange-600 text-white rounded-xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-semibold uppercase tracking-wide text-orange-100">
                  Average Salary
                </h2>
                <p className="text-3xl font-bold mt-2">
                  ₹ {averageSalary.toLocaleString()}
                </p>
              </div>
              <FaMoneyBillWave className="text-3xl text-orange-200" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
          <JobBarChart jobs={jobs} />

          <JobPieChart jobs={jobs} />
        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by Job Title or Company..."
            className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Job Counter */}
        <p className="text-gray-600 mb-5">
          Showing {currentJobs.length} of {filteredJobs.length} Jobs
        </p>

        {/* Sort & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <select
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={sortBy}
            onChange={(e) => {
              setSortBy(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="salaryHigh">Salary: High to Low</option>
            <option value="salaryLow">Salary: Low to High</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            value={locationFilter}
            onChange={(e) => {
              setLocationFilter(e.target.value);
              setCurrentPage(1);
            }}
          >
            <option value="All">All Locations</option>

            {[...new Set(jobs.map((job) => job.location))].map(
              (location) => (
                <option
                  key={location}
                  value={location}
                >
                  {location}
                </option>
              )
            )}
          </select>
        </div>

        {/* Recent Jobs */}
        <h2 className="text-2xl font-bold mb-5 text-slate-800">
          Recent Jobs
        </h2>

        {/* Jobs */}
        {filteredJobs.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center bg-white rounded-xl border border-gray-200 shadow-sm mt-6 py-16 px-6">
            <FaBriefcase className="text-5xl text-gray-300 mb-4" />

            <h2 className="text-2xl font-bold text-slate-700">
              No Jobs Available
            </h2>

            <p className="text-gray-500 mt-2 max-w-sm">
              You haven't added any jobs yet. Click "Add Job" to create your first job listing.
            </p>

            <Link
              to="/add-job"
              className="inline-block mt-6 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-6 py-3 rounded-lg font-semibold shadow-sm hover:shadow-md transition-all duration-200"
            >
              + Add Job
            </Link>
          </div>
        ) : (
          <>
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 mb-6 border border-gray-200"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {job.title}
                    </h2>

                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm mt-2">
                      Active
                    </span>

                    {favorites.includes(job.id) && (
                      <span className="inline-block ml-2 mt-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                        ⭐ Favorite Job
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(job.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-sm transition-all duration-200 ${
                      favorites.includes(job.id)
                        ? "bg-pink-600 hover:bg-pink-700"
                        : "bg-gray-500 hover:bg-gray-600"
                    }`}
                  >
                    <FaHeart />
                    {favorites.includes(job.id) ? "Saved" : "Save"}
                  </button>
                </div>

                <p className="mt-4 flex items-center gap-2">
                  <FaBuilding className="text-gray-400" />
                  <strong>Company:</strong> {job.company}

                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                    Company
                  </span>
                </p>

                <p className="mt-2 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-gray-400" />
                  <strong>Location:</strong> {job.location}
                </p>

                <p className="mt-2 flex items-center gap-2">
                  <FaMoneyBillWave className="text-gray-400" />
                  <strong>Salary:</strong> ₹{" "}
                  {Number(job.salary).toLocaleString()}
                </p>

                <p className="mt-2">
                  <strong>Created:</strong>{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-3 text-gray-700">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">
                  <Link
                    to={`/edit-job/${job.id}`}
                    className="bg-yellow-500 hover:bg-yellow-600 active:scale-95 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-600 hover:bg-red-700 active:scale-95 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Delete
                  </button>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 hover:bg-green-700 active:scale-95 text-white px-4 py-2 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200"
                  >
                    Apply
                  </a>
                </div>
              </div>
            ))}

            {/* Pagination */}
            <div className="flex justify-center items-center gap-3 mt-8">
              <button
                disabled={currentPage === 1}
                onClick={() =>
                  setCurrentPage(currentPage - 1)
                }
                className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:hover:bg-gray-300"
              >
                Previous
              </button>

              <span className="font-semibold text-slate-700">
                Page {currentPage} of {totalPages || 1}
              </span>

              <button
                disabled={
                  currentPage === totalPages ||
                  totalPages === 0
                }
                onClick={() =>
                  setCurrentPage(currentPage + 1)
                }
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:hover:bg-blue-600"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Dashboard;
