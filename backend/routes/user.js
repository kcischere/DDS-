const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const bcrypt = require("bcryptjs");
const log = require("../logger");

const hashPassword = (password) => bcrypt.hashSync(password, 10);

router.post("/register", (req, res) => {
  const { username, password, name } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!username || !password || !name) return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).json({ message: "Username is already taken" });

    const hashedPassword = hashPassword(password);
    db.query("INSERT INTO users (username, password, name, role, status) VALUES (?, ?, ?, 'User', 'active')",
      [username, hashedPassword, name], (err) => {
        if (err) return res.status(500).send(err);
        log(null, username, "REGISTER", `New user registered: ${username}`, ip);
        res.status(201).json({ message: "Registration successful!" });
      });
  });
});

router.get("/users", auth, admin, (req, res) => {
  db.query("SELECT id, name, username, role, status, email, contact_number, is_deleted FROM users WHERE status != 'deleted'", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.get("/users/employees", auth, admin, (req, res) => {
  db.query("SELECT id, name, username, role, status, email, contact_number FROM users WHERE role = 'User' AND status != 'deleted'", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.get("/profile", auth, (req, res) => {
  db.query("SELECT id, name, username, role, status, email, contact_number FROM users WHERE id = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  });
});

router.put("/profile", auth, (req, res) => {
  const { name, username, email, contact_number } = req.body;
  db.query("SELECT * FROM users WHERE username = ? AND id != ?", [username, req.user.id], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).json({ message: "Username is already taken" });
    db.query("UPDATE users SET name = ?, username = ?, email = ?, contact_number = ? WHERE id = ?",
      [name, username, email || null, contact_number || null, req.user.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Profile updated successfully" });
      });
  });
});

router.put("/profile/password", auth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  db.query("SELECT * FROM users WHERE id = ?", [req.user.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    const valid = bcrypt.compareSync(oldPassword, result[0].password);
    if (!valid) return res.status(400).json({ message: "Current password is incorrect" });
    const hashed = hashPassword(newPassword);
    db.query("UPDATE users SET password = ? WHERE id = ?", [hashed, req.user.id], (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Password changed successfully" });
    });
  });
});

router.post("/add-user", auth, admin, (req, res) => {
  const { name, username, password, role } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!name || !username || !password) return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).json({ message: "Username is already taken" });

    const hashedPassword = hashPassword(password);
    db.query("INSERT INTO users (name, username, password, role, status) VALUES (?, ?, ?, ?, 'active')",
      [name, username, hashedPassword, role || 'User'], (err) => {
        if (err) return res.status(500).send(err);
        log(req.user.id, req.user.username, "ADD_USER", `Added user: ${username} (${role || 'User'})`, ip);
        res.status(201).send("User added successfully");
      });
  });
});

router.put("/update-user/:id", auth, admin, (req, res) => {
  const { name, username, role, email, contact_number } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  db.query("UPDATE users SET name = ?, username = ?, role = ?, email = ?, contact_number = ? WHERE id = ?",
    [name, username, role, email || null, contact_number || null, req.params.id], (err) => {
      if (err) return res.status(500).send(err);
      log(req.user.id, req.user.username, "UPDATE_USER", `Updated user ID: ${req.params.id}`, ip);
      res.json({ message: "User profile updated successfully" });
    });
});

router.patch("/disable-user/:id", auth, admin, (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  console.log("DISABLE USER HIT", req.params.id, req.user); // debug line
  db.query("UPDATE users SET status='inactive' WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    log(req.user.id, req.user.username, "DISABLE_USER", `Disabled user ID: ${req.params.id}`, ip);
    console.log("LOG CALLED"); // debug line
    res.send("User disabled");
  });
});

router.patch("/enable-user/:id", auth, admin, (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  db.query("UPDATE users SET status='active' WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    log(req.user.id, req.user.username, "ENABLE_USER", `Enabled user ID: ${req.params.id}`, ip);
    res.send("User enabled");
  });
});

router.patch("/soft-delete-user/:id", auth, admin, (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  db.query("UPDATE users SET status='deleted', is_deleted = 1 WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    log(req.user.id, req.user.username, "DELETE_USER", `Soft-deleted user ID: ${req.params.id}`, ip);
    res.send("User soft-deleted");
  });
});

module.exports = router;
