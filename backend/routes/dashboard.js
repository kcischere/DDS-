const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.get("/dashboard/stats", auth, (req, res) => {
  const stats = {};

  db.query("SELECT COUNT(*) AS total FROM users WHERE status != 'deleted'", (err, result) => {
    if (err) return res.status(500).send(err);
    stats.totalUsers = result[0].total;

    db.query("SELECT COUNT(*) AS total FROM users WHERE status = 'active'", (err, result) => {
      if (err) return res.status(500).send(err);
      stats.activeUsers = result[0].total;

      db.query("SELECT COUNT(*) AS total FROM users WHERE status = 'inactive'", (err, result) => {
        if (err) return res.status(500).send(err);
        stats.inactiveUsers = result[0].total;

        db.query("SELECT COUNT(*) AS total FROM users WHERE is_deleted = 1", (err, result) => {
          if (err) return res.status(500).send(err);
          stats.deletedUsers = result[0].total;

          db.query(
            "SELECT id, name, username, role, status, created_at FROM users ORDER BY id DESC LIMIT 5",
             (err, result) => {
             if (err) return res.status(500).send(err);
             stats.recentUsers = result;
             res.json(stats);
             }
            );
        });
      });
    });
  });
});

module.exports = router;