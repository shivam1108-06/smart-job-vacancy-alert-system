import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
  "#9333ea",
  "#0891b2",
  "#ea580c",
  "#db2777",
];

function JobPieChart({ jobs }) {
  // Location-wise job count
  const locationMap = {};

  jobs.forEach((job) => {
    locationMap[job.location] =
      (locationMap[job.location] || 0) + 1;
  });

  const data = Object.keys(locationMap).map((location) => ({
    name: location,
    value: locationMap[location],
  }));

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-5">
        Jobs by Location
      </h2>

      <ResponsiveContainer width="100%" height={350}>
        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={120}
            label
          >
            {data.map((entry, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>

          <Tooltip />
          <Legend />

        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default JobPieChart;