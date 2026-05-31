const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/logs", auth, admin, (req, res) => {
  db.query(
    "SELECT * FROM logs ORDER BY created_at DESC LIMIT 100",
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

router.get("/logs/filter", auth, admin, (req, res) => {
  const { action } = req.query;
  db.query(
    "SELECT * FROM logs WHERE action = ? ORDER BY created_at DESC LIMIT 100",
    [action],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json(result);
    }
  );
});

module.exports = router;