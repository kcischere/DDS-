const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const env = require("../config/db.config");
const log = require("../logger");

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, result) => {
    if (err || result.length === 0) {
      log(null, username, "LOGIN_FAILED", "Invalid credentials", ip);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result[0];
    const valid = bcrypt.compareSync(password, user.password);
    if (!valid) {
      log(null, username, "LOGIN_FAILED", "Invalid credentials", ip);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    log(user.id, user.username, "LOGIN", "User logged in", ip);
    res.json({ token, role: user.role, name: user.name });
  });
});

module.exports = router;