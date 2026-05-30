const express = require("express");
const cors = require("cors");
const PORT = 4000;
const db = require("./db");
const userRoutes = require("./routes/user");

const authRoutes = require("./routes/auth");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", userRoutes);

app.use("/", authRoutes);

app.get("/", (req, res) => {
 res.send("Backend is running successfully");
});

app.listen(PORT, () => {
 console.log(`Server running on port ${PORT}`);
})