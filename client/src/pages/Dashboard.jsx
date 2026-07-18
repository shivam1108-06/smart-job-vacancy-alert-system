import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs, deleteJob } from "../services/job.service";

function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await getJobs();
      setJobs(response.data.jobs);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      await deleteJob(id);

      alert("Job Deleted Successfully!");

      fetchJobs();
    } catch (error) {
      console.log(error);

      alert(error.response?.data?.message || "Delete Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <div className="flex gap-3">

          <Link
            to="/add-job"
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            + Add Job
          </Link>

          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>

        </div>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by Job Title or Company..."
          className="w-full border p-3 rounded-lg shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredJobs.length === 0 ? (
        <h2 className="text-center text-xl font-semibold">
          No Jobs Found
        </h2>
      ) : (
        filteredJobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow-lg rounded-lg p-6 mb-6"
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

            <div className="flex gap-3 mt-5">

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
  );
}

export default Dashboard;