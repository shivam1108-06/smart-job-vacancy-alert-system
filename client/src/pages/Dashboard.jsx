import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getJobs, deleteJob } from "../services/job.service";
import Navbar from "../components/Navbar";

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

  const filteredJobs = jobs.filter((job) => {
    return (
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-slate-100 p-8">

        {/* Statistics */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-blue-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">
              Total Jobs
            </h2>

            <p className="text-4xl mt-2">
              {jobs.length}
            </p>
          </div>

          <div className="bg-green-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">
              Companies
            </h2>

            <p className="text-4xl mt-2">
              {new Set(jobs.map((job) => job.company)).size}
            </p>
          </div>

          <div className="bg-purple-600 text-white rounded-lg p-6 shadow">
            <h2 className="text-xl font-bold">
              Locations
            </h2>

            <p className="text-4xl mt-2">
              {new Set(jobs.map((job) => job.location)).size}
            </p>
          </div>

        </div>

        {/* Search */}

        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by Job Title or Company..."
            className="w-full border rounded-lg p-3 shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Jobs */}

        {filteredJobs.length === 0 ? (
          <h2 className="text-center text-xl font-semibold">
            No Jobs Found
          </h2>
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
    </>
  );
}

export default Dashboard;