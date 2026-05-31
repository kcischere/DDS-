const express = require("express");
const cors = require("cors");
const PORT = 4000;
const db = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const dashboardRoutes = require("./routes/dashboard");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// API routes first
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", dashboardRoutes);

// Static files and catch-all LAST
app.use(express.static(path.join(__dirname, "../frontend/src")));

app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/src/index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});