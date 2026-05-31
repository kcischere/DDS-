const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

// Get all labels
router.get("/labels", auth, (req, res) => {
  db.query("SELECT * FROM labels ORDER BY is_default DESC, name ASC", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

// Create custom label
router.post("/labels", auth, (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ message: "Label name required" });
  db.query("INSERT INTO labels (name, is_default) VALUES (?, 0)", [name.trim()], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") return res.status(400).json({ message: "Label already exists" });
      return res.status(500).send(err);
    }
    res.status(201).json({ id: result.insertId, name: name.trim(), is_default: 0 });
  });
});

// Rename a custom label (not allowed on defaults)
router.put("/labels/:id", auth, (req, res) => {
  const { name } = req.body;
  db.query("UPDATE labels SET name = ? WHERE id = ? AND is_default = 0", [name, req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Cannot rename a default label" });
    res.json({ message: "Label renamed" });
  });
});

// Delete a custom label
router.delete("/labels/:id", auth, (req, res) => {
  db.query("DELETE FROM labels WHERE id = ? AND is_default = 0", [req.params.id], (err, result) => {
    if (err) return res.status(500).send(err);
    if (result.affectedRows === 0) return res.status(403).json({ message: "Cannot delete a default label" });
    // Clear label from documents that used it
    db.query("UPDATE documents SET label = NULL WHERE label = (SELECT name FROM labels WHERE id = ?)", [req.params.id], () => {
      res.json({ message: "Label deleted" });
    });
  });
});

module.exports = router;