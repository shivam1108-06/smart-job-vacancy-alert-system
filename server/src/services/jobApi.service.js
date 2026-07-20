const JOB_API_URL =
  process.env.JOB_API_URL || "https://remotive.com/api/remote-jobs";
const JOB_API_SOURCE = process.env.JOB_API_SOURCE || "Remotive";

const stripHtml = (html) => {
  if (!html) return "";

  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
};

const normalizeSalary = (salary) => {
  if (!salary || typeof salary !== "string" || !salary.trim()) {
    return null;
  }

  return salary.trim();
};

// Fetches jobs from the configured public job API and converts each entry
// into this project's Job shape so callers never touch the raw API format.
const fetchExternalJobs = async (limit = 20) => {
  const url = `${JOB_API_URL}?limit=${limit}`;

  let response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new Error("Unable to reach the job API. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(`Job API request failed with status ${response.status}`);
  }

  const data = await response.json();
  const jobs = Array.isArray(data.jobs) ? data.jobs : [];

  return jobs
    .filter((job) => job.title && job.company_name && job.url)
    .map((job) => ({
      title: job.title.trim(),
      company: job.company_name.trim(),
      location: (job.candidate_required_location || "Remote").trim(),
      salary: normalizeSalary(job.salary),
      description: stripHtml(job.description) || "No description provided.",
      applyLink: job.url,
      source: JOB_API_SOURCE
    }));
};

module.exports = { fetchExternalJobs };
