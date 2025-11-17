import { pool } from "../config/db.js";

export const solicitudes = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM solicitudes");
    return rows;
  },

  create: async (data) => {
    const {
      NombreCliente,
      ApellidosCliente,
      DireccionCliente,
      CoordenadasVisita,
      TelefonoPrincipal,
      TelefonoSecundario,
      Correo,
    } = data;

    const [result] = await pool.query(
      `INSERT INTO Cliente 
      (NombreCliente, ApellidosCliente, DireccionCliente, CoordenadasVisita, 
       TelefonoPrincipal, TelefonoSecundario, Correo)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        NombreCliente,
        ApellidosCliente,
        DireccionCliente,
        CoordenadasVisita,
        TelefonoPrincipal,
        TelefonoSecundario,
        Correo,
      ]
    );

    return result.insertId;
  },
};
