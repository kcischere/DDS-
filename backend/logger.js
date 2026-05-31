const db = require("./db");

const log = (userId, username, action, details, ipAddress) => {
  db.query(
    "INSERT INTO logs (user_id, username, action, details, ip_address) VALUES (?, ?, ?, ?, ?)",
    [userId || null, username || "unknown", action, details || null, ipAddress || null]
  );
};

module.exports = log;