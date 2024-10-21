const express = require("express");
const cors = require("cors");
const mysql = require("mysql2");
const performance = require("perf_hooks").performance;

// Create the MySQL connection pool
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "Rahul0202",
  database: "ecommerce",
});

const app = express();

// Middleware to handle CORS and body parsing
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// POST route to run SQL query
app.post("/api/run-query", (req, res) => {
  const userQuery = req.body.query;

  const start = performance.now();

  // Basic validation to prevent DROP and delete statements
  const forbidden = /DROP|DELETE/i;
  if (forbidden.test(userQuery)) {
    return res
      .status(400)
      .json({ error: "Unsafe SQL queries are not allowed!" });
  }

  // Test MySQL connection health
  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error connecting to MySQL database:", err);
      return res.status(500).send("Database connection error");
    }

    connection.release(); // Always release connection back to the pool
  });

  // Execute SQL query
  pool.query(userQuery, (err, results) => {
    const end = performance.now();
    const runtime = end - start;

    if (err) {
      console.error("Error executing query:", err); // Log full error object
      return res
        .status(400)
        .json({ error: `Error: ${err.code}, Message: ${err.sqlMessage}` });
    }

    res.status(200).json({ result: results, runtime: runtime });
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
