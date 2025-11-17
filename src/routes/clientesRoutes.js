import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const {
      NombreCliente,
      ApellidoCliente,
      Coordenadas,
      TelefonoPrincipal,
      TelefonoSecundario,
      Correo,
      Servicio,
      Detalle
    } = req.body;

    const [result] = await pool.query(
      `INSERT INTO solicitudes (NombreCliente, ApellidoCliente, Coordenadas, TelefonoPrincipal, TelefonoSecundario, Correo, Servicio, Detalle)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [NombreCliente, ApellidoCliente, Coordenadas, TelefonoPrincipal, TelefonoSecundario, Correo, Servicio, Detalle]
    );

    res.json({ ok: true, id: result.insertId });
  } catch (error) {
    console.error("❌ Error al registrar solicitud:", error);
    res.status(500).json({ ok: false, error: "Error al registrar la solicitud" });
  }
});

export default router;
