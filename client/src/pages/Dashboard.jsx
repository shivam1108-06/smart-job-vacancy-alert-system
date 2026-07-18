import { useEffect, useState } from "react";
import { getJobs } from "../services/job.service";

function Dashboard() {
  const [jobs, setJobs] = useState([]);

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

  return (
    <div className="min-h-screen bg-slate-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        Dashboard
      </h1>

      {jobs.length === 0 ? (
        <h2>No Jobs Found</h2>
      ) : (
        jobs.map((job) => (
          <div
            key={job.id}
            className="bg-white shadow rounded p-5 mb-5"
          >
            <h2 className="text-2xl font-bold">
              {job.title}
            </h2>

            <p>{job.company}</p>

            <p>{job.location}</p>

            <p>₹ {job.salary}</p>

            <a
              href={job.applyLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600"
            >
              Apply
            </a>
          </div>
        ))
      )}

    </div>
  );
}

export default Dashboard;