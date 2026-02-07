require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "weather_app",
  password: process.env.DB_PASSWORD || "postgres",
  port: process.env.DB_PORT || 5432,
});

async function initDB() {
  let connected = false;

  while (!connected) {
    try {
      await pool.query("SELECT 1");
      connected = true;

      await pool.query(`
        CREATE TABLE IF NOT EXISTS cities (
          id SERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          country TEXT NOT NULL
        );
      `);

      const res = await pool.query("SELECT COUNT(*) FROM cities");

      if (parseInt(res.rows[0].count) === 0) {
        await pool.query(`
          INSERT INTO cities (name, country) VALUES
          ('Riga','LV'),
          ('London','UK'),
          ('Paris','FR');
        `);
      }

    } catch (err) {
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

initDB();

app.get("/cities", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM cities ORDER BY id");
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("DB error");
  }
});

app.post("/cities", async (req, res) => {
  try {
    const { name, country } = req.body;

    const result = await pool.query(
      "INSERT INTO cities (name, country) VALUES ($1, $2) RETURNING *",
      [name, country]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Insert error");
  }
});

app.delete("/cities/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM cities WHERE id=$1", [req.params.id]);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).send("Delete error");
  }
});

app.listen(3001);
