const mysql = require('mysql2');
const env = require("./config/db.config");

const db = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USER,
  password: env.DB_PASS,
  database: env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log("MySQL Connected");
});

module.exports = db;