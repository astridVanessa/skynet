import { Router } from "express";
import pool from "../config/db.js";

const router = Router();

router.post("/", async (req, res) => {  
  const { NombreUsuario, CredencialesUsuario } = req.body;

  try {
    const [usuario] = await pool.query(
      `SELECT u.NombreUsuario, r.Rol
       FROM Usuario u
       JOIN Roles r ON u.CodigoRol = r.CodigoRol
       WHERE u.NombreUsuario = ? AND u.CredencialesUsuario = ?`,
      [NombreUsuario, CredencialesUsuario]
    );

    if (usuario.length > 0) {
      res.json({
        ok: true,
        usuario: usuario[0].NombreUsuario,
        rol: usuario[0].Rol
      });
    } else {
      res.json({
        ok: false,
        error: "Usuario o contraseña incorrectos"
      });
    }
  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({
      ok: false,
      error: "Error del servidor"
    });
  }
});

export default router;
