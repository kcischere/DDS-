const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const log = require("../logger");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  },
});

const allowedMimes = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "application/rtf",
];

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (allowedMimes.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only document files are allowed"), false);
  },
});


router.get("/folders", auth, (req, res) => {
  db.query("SELECT f.*, u.name as created_by_name FROM folders f JOIN users u ON f.created_by = u.id", (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.post("/folders", auth, (req, res) => {
  const { name, parent_id } = req.body;
  if (!name) return res.status(400).json({ message: "Folder name is required" });
  db.query("INSERT INTO folders (name, parent_id, created_by) VALUES (?, ?, ?)",
    [name, parent_id || null, req.user.id], (err, result) => {
      if (err) return res.status(500).send(err);
      res.status(201).json({ id: result.insertId, name, parent_id: parent_id || null });
    });
});

router.put("/folders/:id", auth, (req, res) => {
  const { name } = req.body;
  db.query("UPDATE folders SET name = ? WHERE id = ?", [name, req.params.id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: "Folder renamed" });
  });
});

router.delete("/folders/:id", auth, (req, res) => {
  db.query("SELECT stored_name FROM documents WHERE folder_id = ?", [req.params.id], (err, docs) => {
    if (err) return res.status(500).send(err);
    docs.forEach(doc => {
      const filePath = path.join(__dirname, "../uploads", doc.stored_name);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });
    db.query("DELETE FROM documents WHERE folder_id = ?", [req.params.id], (err) => {
      if (err) return res.status(500).send(err);
      db.query("DELETE FROM folders WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).send(err);
        res.json({ message: "Folder deleted" });
      });
    });
  });
});


router.get("/documents", auth, (req, res) => {
  const folderId = req.query.folder_id;
  let query = "SELECT d.*, u.name as uploaded_by_name FROM documents d JOIN users u ON d.uploaded_by = u.id";
  const params = [];
  if (folderId === "null" || folderId === "") {
    query += " WHERE d.folder_id IS NULL";
  } else if (folderId) {
    query += " WHERE d.folder_id = ?";
    params.push(folderId);
  }
  db.query(query, params, (err, result) => {
    if (err) return res.status(500).send(err);
    res.json(result);
  });
});

router.post("/documents/upload", auth, upload.single("file"), (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  const { folder_id } = req.body;
  db.query(
    "INSERT INTO documents (original_name, stored_name, mime_type, size, folder_id, uploaded_by) VALUES (?, ?, ?, ?, ?, ?)",
    [req.file.originalname, req.file.filename, req.file.mimetype, req.file.size, folder_id || null, req.user.id],
    (err, result) => {
      if (err) return res.status(500).send(err);
      log(req.user.id, req.user.username, "UPLOAD_DOCUMENT", `Uploaded: ${req.file.originalname}`, ip);
      res.status(201).json({ id: result.insertId, original_name: req.file.originalname });
    }
  );
});

router.put("/documents/:id", auth, (req, res) => {
  const { original_name, folder_id, label } = req.body;
  db.query(
    "UPDATE documents SET original_name = ?, folder_id = ?, label = ? WHERE id = ?",
    [original_name, folder_id ?? null, label ?? null, req.params.id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Document updated" });
    }
  );
});

router.delete("/documents/:id", auth, (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  db.query("SELECT stored_name, original_name FROM documents WHERE id = ?", [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "Not found" });
    const filePath = path.join(__dirname, "../uploads", result[0].stored_name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    db.query("DELETE FROM documents WHERE id = ?", [req.params.id], (err) => {
      if (err) return res.status(500).send(err);
      log(req.user.id, req.user.username, "DELETE_DOCUMENT", `Deleted: ${result[0].original_name}`, ip);
      res.json({ message: "Document deleted" });
    });
  });
});

router.get("/documents/:id/download", auth, (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  db.query("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "Not found" });
    const doc = result[0];
    const filePath = path.join(__dirname, "../uploads", doc.stored_name);
    log(req.user.id, req.user.username, "DOWNLOAD_DOCUMENT", `Downloaded: ${doc.original_name}`, ip);
    res.download(filePath, doc.original_name);
  });
});

router.get("/documents/:id/view", (req, res) => {
  const token = req.query.token || (req.headers['authorization']?.split(' ')[1]);
  const jwt = require('jsonwebtoken');
  const env = require('../config/db.config');
  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    return res.status(403).json({ message: 'Invalid token' });
  }
  db.query("SELECT * FROM documents WHERE id = ?", [req.params.id], (err, result) => {
    if (err || result.length === 0) return res.status(404).json({ message: "Not found" });
    const doc = result[0];
    const filePath = path.join(__dirname, "../uploads", doc.stored_name);
    res.setHeader("Content-Type", doc.mime_type);
    res.setHeader("Content-Disposition", "inline");
    fs.createReadStream(filePath).pipe(res);
  });
});

module.exports = router;