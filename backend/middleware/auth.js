const jwt = require("jsonwebtoken");
const env = require("../config/db.config");

module.exports = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  console.log("DEBUG: Middleware is using Secret Key: ['" + env.JWT_SECRET + "']");

  jwt.verify(token, env.JWT_SECRET, (err, decoded) => {
    if (err) {
      console.error("JWT Verification Error:", err.message); 
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    req.user = decoded;
    next(); 
  });
};