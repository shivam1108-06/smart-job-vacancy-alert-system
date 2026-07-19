import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

function JobBarChart({ jobs }) {
  // Company-wise job count
  const companyMap = {};

  jobs.forEach((job) => {
    companyMap[job.company] =
      (companyMap[job.company] || 0) + 1;
  });

  const data = Object.keys(companyMap).map((company) => ({
    company,
    jobs: companyMap[company],
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-5">
        Jobs by Company
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="company" />

          <YAxis allowDecimals={false} />

          <Tooltip />

          <Bar
            dataKey="jobs"
            fill="#2563eb"
            radius={[5, 5, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default JobBarChart;