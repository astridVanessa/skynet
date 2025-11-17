import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Cambiar contraseña sin modificar la tabla
router.put("/", async (req, res) => {
  const { NombreUsuario, ContraseñaActual, NuevaContraseña } = req.body;

  try {
    //  Verificar si el usuario existe
    const [usuario] = await pool.query(
      "SELECT CredencialesUsuario FROM Usuario WHERE NombreUsuario = ?",
      [NombreUsuario]
    );

    if (usuario.length === 0) {
      return res.status(404).json({ ok: false, error: "Usuario no encontrado" });
    }

    //  Validar contraseña actual (sin encriptación, como lo tienes ahora)
    if (usuario[0].CredencialesUsuario !== ContraseñaActual) {
      return res.status(400).json({ ok: false, error: "Contraseña actual incorrecta" });
    }

    //  Actualizar por la contraseña nueva
    await pool.query(
      "UPDATE Usuario SET CredencialesUsuario = ? WHERE NombreUsuario = ?",
      [NuevaContraseña, NombreUsuario]
    );

    res.json({ ok: true, message: "✅ Contraseña actualizada correctamente" });

  } catch (error) {
    console.error("Error al cambiar contraseña:", error);
    res.status(500).json({ ok: false, error: "Error en el servidor" });
  }
});

export default router;
