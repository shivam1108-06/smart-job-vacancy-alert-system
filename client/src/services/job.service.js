import axios from "axios";

const API = "http://localhost:5000/api/jobs";

export const getJobs = () => {
  return axios.get(API, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};

export const createJob = (jobData) => {
  return axios.post(API, jobData, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};