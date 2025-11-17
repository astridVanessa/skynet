import express from "express";
import pool from "../db.js";

const router = express.Router();

// Listar roles
router.get("/api/roles", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Roles");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
