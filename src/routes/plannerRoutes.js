import express from "express";
import pool from "../config/db.js";

const router = express.Router();

//  Planner filtrado
router.get("/:supervisor", async (req, res) => {
  try {
    let { supervisor } = req.params;

    
    const numeroSupervisor = parseInt(supervisor.replace(/\D/g, ""), 10);

    // Solo mostrar las solicitudes asignadas al técnico 
    const [rows] = await pool.query(
      `SELECT 
         s.CodigoCliente   AS CodigoSolicitud,
         s.Servicio,
         s.Detalle,
         s.Supervisor,
         s.CodigoTecnico,
         v.CodigoVisita,
         v.FechaAsignada,
         v.FechaInicioVisita,
         v.FechaFinVisita,
         v.Detalle         AS DetalleVisita
       FROM solicitudes s
       LEFT JOIN visita v ON s.CodigoCliente = v.CodigoSolicitud
       WHERE s.Supervisor = ? AND s.CodigoTecnico = 101
       ORDER BY s.CodigoCliente DESC`,
      [numeroSupervisor]
    );

    console.log(`🪄 Planner del Supervisor ${numeroSupervisor} cargado con ${rows.length} registros (solo Técnico 1)`);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener planner:", error);
    res.status(500).json({ error: "Error al obtener el planner del técnico" });
  }
});

export default router;
