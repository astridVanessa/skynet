import express from "express";
import pool from "../db.js";

const router = express.Router();

// Listar usuarios
router.get("/api/usuarios", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT u.CodigoLogin, u.NombreUsuario, r.Rol FROM Usuario u JOIN Roles r ON u.CodigoRol = r.CodigoRol");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

// Crear usuario
router.post("/api/usuarios", async (req, res) => {
  const { NombreUsuario, ContraseñaUsuario, CodigoRol } = req.body;
  try {
    const [result] = await pool.query(
      "INSERT INTO Usuario (NombreUsuario, ContraseñaUsuario, CodigoRol) VALUES (?, ?, ?)",
      [NombreUsuario, ContraseñaUsuario, CodigoRol]
    );
    res.json({ ok: true, id: result.insertId });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default router;
