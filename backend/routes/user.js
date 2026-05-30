const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth"); 
const admin = require("../middleware/admin"); 
const bcrypt = require("bcryptjs");

const hashPassword = (password) => bcrypt.hashSync(password, 10);

router.post("/register", (req, res) => {
  const { username, password, name } = req.body;
  if (!username || !password || !name) return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).json({ message: "Username is already taken" });

    const hashedPassword = hashPassword(password);
    db.query("INSERT INTO users (username, password, name, role, status) VALUES (?, ?, ?, 'User', 'active')", 
      [username, hashedPassword, name], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).json({ message: "Registration successful!" });
    });
  });
});

router.get("/users", auth, (req, res) => {
  db.query("SELECT id, name, username, role, status, is_deleted FROM users WHERE status != 'deleted'", (err, result) => {
    if (err) return res.status(500).send(err); 
    res.json(result);
  });
});

router.post("/add-user", auth, admin, (req, res) => {
  const { name, username, password, role } = req.body;
  if (!name || !username || !password) return res.status(400).json({ message: "All fields are required" });

  db.query("SELECT * FROM users WHERE username = ?", [username], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) return res.status(400).json({ message: "Username is already taken" });

    const hashedPassword = hashPassword(password);
    db.query("INSERT INTO users (name, username, password, role, status) VALUES (?, ?, ?, ?, 'active')", 
      [name, username, hashedPassword, role || 'User'], (err) => {
        if (err) return res.status(500).send(err);
        res.status(201).send("User added successfully");
    });
  });
});

router.put("/update-user/:id", auth, admin, (req, res) => {
  const { name, username, role } = req.body;
  db.query("UPDATE users SET name = ?, username = ?, role = ? WHERE id = ?", [name, username, role, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User profile updated successfully");
  });
});

router.patch("/disable-user/:id", auth, admin, (req, res) => {
  db.query("UPDATE users SET status='inactive' WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User disabled");
  });
});

router.patch("/enable-user/:id", auth, admin, (req, res) => {
  db.query("UPDATE users SET status='active' WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User enabled");
  });
});

router.patch("/soft-delete-user/:id", auth, admin, (req, res) => {
  db.query("UPDATE users SET status='deleted', is_deleted = 1 WHERE id=?", [req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.send("User soft-deleted");
  });
});

module.exports = router;