import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// GET por ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Trabajador WHERE CodigoTrabajador = ?", [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ message: "Empleado no encontrado" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Error al buscar" });
  }
});
// Obtener empleado por ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Trabajador WHERE CodigoTrabajador = ?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al buscar empleado" });
  }
});


// POST nuevo
router.post("/", async (req, res) => {
  try {
    const {
      NombreTrabajador,
      ApellidoTrabajador,
      TelefonoTrabajador,
      CorreoTrabajador,
      CredencialTrabajador,
      CodigoRol,
      FechaInicioLabores,
      FechaFinLabores
    } = req.body;

    const sql = `
      INSERT INTO Trabajador
      (NombreTrabajador, ApellidoTrabajador, TelefonoTrabajador, CorreoTrabajador, CredencialTrabajador, CodigoRol, FechaInicioLabores, FechaFinLabores)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(sql, [
      NombreTrabajador,
      ApellidoTrabajador,
      TelefonoTrabajador,
      CorreoTrabajador,
      CredencialTrabajador,
      CodigoRol,
      FechaInicioLabores,
      FechaFinLabores || null
    ]);

    res.json({ message: "✅ Empleado registrado correctamente" });
  } catch (error) {
    console.error("❌ Error al registrar empleado:", error);
    res.status(500).json({ message: "Error al registrar empleado" });
  }
});

// PUT actualizar
router.put("/:id", async (req, res) => {
  try {
    await pool.query("UPDATE Trabajador SET ? WHERE CodigoTrabajador = ?", [req.body, req.params.id]);
    res.json({ message: "Empleado actualizado" });
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar" });
  }
});

// DELETE eliminar
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM Trabajador WHERE CodigoTrabajador = ?", [req.params.id]);
    res.json({ message: "Empleado eliminado" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar" });
  }
});

export default router;
