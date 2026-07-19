import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";
import { getJobs, deleteJob } from "../services/job.service";

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

      <div className="min-h-screen bg-slate-100 p-8">
                {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">

          <div className="bg-blue-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">Total Jobs</h2>
            <p className="text-4xl mt-2">{jobs.length}</p>
          </div>

          <div className="bg-green-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">Companies</h2>
            <p className="text-4xl mt-2">
              {new Set(jobs.map((job) => job.company)).size}
            </p>
          </div>

          <div className="bg-purple-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">Locations</h2>
            <p className="text-4xl mt-2">
              {new Set(jobs.map((job) => job.location)).size}
            </p>
          </div>

          <div className="bg-pink-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">Favorites</h2>
            <p className="text-4xl mt-2">
              {favorites.length}
            </p>
          </div>

        </div>

        {/* Salary Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">

          <div className="bg-indigo-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">
              Total Salary
            </h2>

            <p className="text-3xl mt-2">
              ₹ {totalSalary.toLocaleString()}
            </p>
          </div>

          <div className="bg-orange-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">
              Average Salary
            </h2>

            <p className="text-3xl mt-2">
              ₹ {averageSalary.toLocaleString()}
            </p>
          </div>

        </div>

        {/* Search */}
        <div className="mb-5">

          <input
            type="text"
            placeholder="Search by Job Title or Company..."
            className="w-full border rounded-lg p-3"
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
            className="border rounded-lg p-3"
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
            className="border rounded-lg p-3"
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
        <h2 className="text-2xl font-bold mb-5">
          Recent Jobs
        </h2>
                {/* Jobs */}
        {filteredJobs.length === 0 ? (
          <div className="text-center mt-20">
            <h2 className="text-3xl font-bold">
              📭 No Jobs Found
            </h2>

            <p className="text-gray-500 mt-3">
              Click "Add Job" to create your first job.
            </p>

            <Link
              to="/add-job"
              className="inline-block mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              + Add Job
            </Link>
          </div>
        ) : (
          <>
            {currentJobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-lg p-6 mb-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-start">

                  <div>
                    <h2 className="text-2xl font-bold">
                      {job.title}
                    </h2>

                    {favorites.includes(job.id) && (
                      <span className="inline-block mt-2 bg-pink-100 text-pink-700 px-3 py-1 rounded-full text-sm">
                        ⭐ Favorite Job
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => toggleFavorite(job.id)}
                    className={`px-4 py-2 rounded text-white ${
                      favorites.includes(job.id)
                        ? "bg-pink-600"
                        : "bg-gray-500"
                    }`}
                  >
                    {favorites.includes(job.id)
                      ? "❤️ Saved"
                      : "🤍 Save"}
                  </button>

                </div>

                <p className="mt-4">
                  <strong>Company:</strong> {job.company}

                  <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                    Company
                  </span>
                </p>

                <p>
                  <strong>Location:</strong> {job.location}
                </p>

                <p>
                  <strong>Salary:</strong> ₹{" "}
                  {Number(job.salary).toLocaleString()}
                </p>

                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </p>

                <p className="mt-3 text-gray-700">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-3 mt-6">

                  <Link
                    to={`/edit-job/${job.id}`}
                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(job.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>

                  <a
                    href={job.applyLink}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
                className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
              >
                Previous
              </button>

              <span className="font-semibold">
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
                className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
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