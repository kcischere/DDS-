const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/db.config");

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
    if (err || result.length === 0)
      return res.status(401).json({ message: "Invalid credentials" });

    const user = result[0];

    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });
    console.log("DEBUG: LOGIN is using Secret Key: ['" + env.JWT_SECRET + "']");
    const token = jwt.sign(
  { id: user.id, username: user.username, role: user.role },
  env.JWT_SECRET, 
  { expiresIn: "2h" }
);

    res.json({ token, role: user.role, name: user.name });
    
  });
});

module.exports = router;
