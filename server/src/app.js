const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth.routes");
const jobRoutes = require("./routes/jobs.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Server is running successfully!"
  });
});

module.exports = app;