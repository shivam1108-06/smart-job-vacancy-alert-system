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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

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

        </div>

        {/* Search */}
        <div className="mb-5">
          <input
            type="text"
            placeholder="Search by Job Title or Company..."
            className="w-full border rounded-lg p-3"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Sort & Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">

          <select
            className="border rounded-lg p-3"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="salaryHigh">Salary: High to Low</option>
            <option value="salaryLow">Salary: Low to High</option>
          </select>

          <select
            className="border rounded-lg p-3"
            value={locationFilter}
            onChange={(e) => setLocationFilter(e.target.value)}
          >
            <option value="All">All Locations</option>

            {[...new Set(jobs.map((job) => job.location))].map(
              (location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              )
            )}
          </select>

        </div>

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
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-lg shadow-lg p-6 mb-6"
            >
              <h2 className="text-2xl font-bold">
                {job.title}
              </h2>

              <p className="mt-2">
                <strong>Company:</strong> {job.company}
              </p>

              <p>
                <strong>Location:</strong> {job.location}
              </p>

              <p>
                <strong>Salary:</strong> ₹ {job.salary}
              </p>

              <p className="mt-2">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-3 mt-5">

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
          ))
        )}

      </div>
    </>
  );
}

export default Dashboard;