const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const log = require("../logger");

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

          db.query("SELECT COUNT(*) AS total FROM documents", (err, result) => {
            if (err) return res.status(500).send(err);
            stats.totalDocuments = result[0].total;

            db.query("SELECT COALESCE(SUM(size), 0) AS total FROM documents", (err, result) => {
              if (err) return res.status(500).send(err);
              stats.totalStorageBytes = result[0].total;

              db.query(
                `SELECT d.original_name, d.uploaded_at, d.size, d.label,
                  u.name AS uploaded_by
                  FROM documents d
                  LEFT JOIN users u ON d.uploaded_by = u.id
                  ORDER BY d.uploaded_at DESC LIMIT 5`,
                (err, result) => {
                  if (err) return res.status(500).send(err);
                  stats.recentDocuments = result;

                  db.query(
                    `SELECT u.name, COUNT(d.id) AS total_uploads
                      FROM users u
                      LEFT JOIN documents d ON d.uploaded_by = u.id
                      GROUP BY u.id, u.name
                      ORDER BY total_uploads DESC LIMIT 5`,
                    (err, result) => {
                      if (err) return res.status(500).send(err);
                      stats.topUploaders = result;

                      db.query(
                        `SELECT id, name, username, role, status, created_at
                          FROM users ORDER BY id DESC LIMIT 5`,
                        (err, result) => {
                          if (err) return res.status(500).send(err);
                          stats.recentUsers = result;
                          res.json(stats);
                        }
                      );
                    }
                  );
                }
              );
            });
          });
        });
      });
    });
  });
});

router.get("/dashboard/users", auth, (req, res) => {
  db.query("SELECT id, name, username, role, status FROM users", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.patch("/dashboard/users/:id/status", auth, (req, res) => {
  const { status } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const validStatuses = ['active', 'inactive', 'deleted'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  const isDeleted = status === 'deleted' ? 1 : 0;
  db.query(
    "UPDATE users SET status = ?, is_deleted = ? WHERE id = ?",
    [status, isDeleted, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      log(req.user.id, req.user.username, "UPDATE_USER_STATUS", `Set user ID ${req.params.id} to ${status}`, ip);
      res.json({ message: "Status updated successfully" });
    }
  );
});
module.exports = router;
