const express = require("express");
const cors = require("cors");
const path = require("path");
const PORT = 4000;
const db = require("./db");
const userRoutes = require("./routes/user");
const authRoutes = require("./routes/auth");
const documentRoutes = require("./routes/documents");
const labelRoutes = require("./routes/labels");
const dashboardRoutes = require("./routes/dashboard");
const logsRoutes = require("./routes/logs");
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/", logsRoutes);
app.use("/", userRoutes);
app.use("/", authRoutes);
app.use("/", documentRoutes);
app.use("/", labelRoutes);
app.use("/", dashboardRoutes);

app.get("/", (req, res) => res.send("Backend is running successfully"));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
