import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getJobById, updateJob } from "../services/job.service";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    applyLink: "",
  });

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const response = await getJobById(id);
      setJob(response.data.job);
    } catch (error) {
      console.log(error);
      alert("Failed to load job.");
    }
  };

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateJob(id, job);

      alert("Job Updated Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.log(error);

      alert(
        error.response?.data?.message || "Update Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-[500px]"
      >
        <h1 className="text-3xl font-bold mb-6">
          Edit Job
        </h1>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          className="border p-2 w-full mb-3"
          value={job.title}
          onChange={handleChange}
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          className="border p-2 w-full mb-3"
          value={job.company}
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="border p-2 w-full mb-3"
          value={job.location}
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="border p-2 w-full mb-3"
          value={job.salary}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          rows="4"
          className="border p-2 w-full mb-3"
          value={job.description}
          onChange={handleChange}
        />

        <input
          type="url"
          name="applyLink"
          placeholder="Apply Link"
          className="border p-2 w-full mb-4"
          value={job.applyLink}
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-yellow-500 text-white w-full p-2 rounded"
        >
          Update Job
        </button>
      </form>
    </div>
  );
}

export default EditJob;