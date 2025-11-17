import express from "express";
import pool from "../config/db.js";

const router = express.Router();

//  Obtener todas las solicitudes
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT CodigoCliente, Servicio, Detalle, Supervisor, CodigoTecnico FROM solicitudes"
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes:", error);
    res.status(500).json({ error: "Error al obtener las solicitudes" });
  }
});

//  Obtener solicitudes filtradas 
router.get("/supervisor/:nombre", async (req, res) => {
  try {
    const { nombre } = req.params;
    const [rows] = await pool.query(
      "SELECT CodigoCliente, Servicio, Detalle, Supervisor, CodigoTecnico FROM solicitudes WHERE Supervisor = ?",
      [nombre]
    );

    console.log("Solicitudes del supervisor:", rows);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes por supervisor:", error);
    res.status(500).json({ error: "Error al obtener solicitudes por supervisor" });
  }
});

//  Asignar supervisor
router.put("/asignar", async (req, res) => {
  const { CodigoCliente, Supervisor } = req.body;

  try {
    await pool.query(
      "UPDATE solicitudes SET Supervisor = ? WHERE CodigoCliente = ?",
      [Supervisor, CodigoCliente]
    );
    res.json({ message: "Supervisor asignado correctamente" });
  } catch (error) {
    console.error("Error al asignar supervisor:", error);
    res.status(500).json({ message: "Error al asignar supervisor" });
  }
});

// Asignar técnic
router.put("/tecnico", async (req, res) => {
  const { CodigoCliente, CodigoTecnico } = req.body;

  try {
    await pool.query(
      "UPDATE solicitudes SET CodigoTecnico = ? WHERE CodigoCliente = ?",
      [CodigoTecnico, CodigoCliente]
    );
    res.json({ message: "Técnico asignado correctamente" });
  } catch (error) {
    console.error("Error al asignar técnico:", error);
    res.status(500).json({ message: "Error al asignar técnico" });
  }
});

//  Obtener solicitudes asignadas a un técnico 
router.get("/tecnico/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      "SELECT CodigoCliente FROM solicitudes WHERE CodigoTecnico = ?",
      [id]
    );
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener solicitudes del técnico:", error);
    res.status(500).json({ error: "Error al obtener las solicitudes del técnico" });
  }
});

export default router;
