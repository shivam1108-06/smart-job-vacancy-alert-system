import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createJob } from "../services/job.service";

function AddJob() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
    applyLink: "",
  });

  const handleChange = (e) => {
    setJob({
      ...job,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createJob(job);

      alert("Job Created Successfully!");

      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      alert(
        error.response?.data?.message || "Failed to create job."
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
          Add New Job
        </h1>

        <input
          type="text"
          name="title"
          placeholder="Job Title"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          name="company"
          placeholder="Company"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <input
          type="number"
          name="salary"
          placeholder="Salary"
          className="border p-2 w-full mb-3"
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="border p-2 w-full mb-3"
          rows="4"
          onChange={handleChange}
        />

        <input
          type="url"
          name="applyLink"
          placeholder="Apply Link"
          className="border p-2 w-full mb-4"
          onChange={handleChange}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white w-full p-2 rounded"
        >
          Create Job
        </button>
      </form>
    </div>
  );
}

export default AddJob;  