import express from "express";
import pool from "../config/db.js";
import nodemailer from "nodemailer";

const router = express.Router();


const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});


router.get("/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    const [rows] = await pool.query(
      `SELECT 
         s.CodigoCliente   AS CodigoSolicitud,
         s.NombreCliente   AS NombreCliente,
         s.Servicio,
         s.Detalle         AS DetalleSolicitud,
         s.Coordenadas,
         v.Detalle         AS DetalleVisita,
         v.FechaAsignada,
         v.FechaInicioVisita,
         v.FechaFinVisita
       FROM solicitudes s
       LEFT JOIN visita v ON s.CodigoCliente = v.CodigoSolicitud
       WHERE s.CodigoCliente = ?`,
      [codigo]
    );

    res.json(rows[0] || {});
  } catch (error) {
    console.error("Error al obtener detalle:", error);
    res.status(500).json({ error: "Error al obtener el detalle de la visita" });
  }
});


router.put("/inicio/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    const [exist] = await pool.query(
      "SELECT 1 FROM visita WHERE CodigoSolicitud = ? LIMIT 1",
      [codigo]
    );

    if (exist.length === 0) {
      await pool.query(
        "INSERT INTO visita (CodigoSolicitud, FechaInicioVisita) VALUES (?, NOW())",
        [codigo]
      );
    } else {
      await pool.query(
        "UPDATE visita SET FechaInicioVisita = NOW() WHERE CodigoSolicitud = ?",
        [codigo]
      );
    }

    res.json({ message: "✅ Visita iniciada correctamente" });
  } catch (error) {
    console.error("Error al registrar inicio:", error);
    res.status(500).json({ error: "Error al registrar el inicio" });
  }
});


router.put("/fin/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    // upsert de la fecha fin
    const [exist] = await pool.query(
      "SELECT 1 FROM visita WHERE CodigoSolicitud = ? LIMIT 1",
      [codigo]
    );

    if (exist.length === 0) {
      await pool.query(
        "INSERT INTO visita ( CodigoSolicitud, FechaFinVisita) VALUES (?, NOW())",
        [codigo]
      );
    } else {
      await pool.query(
        "UPDATE visita SET FechaFinVisita = NOW() WHERE CodigoSolicitud = ?",
        [codigo]
      );
    }

   
   const [info] = await pool.query(
  `SELECT 
      s.Correo,
      s.NombreCliente,
      s.Servicio,
      s.Detalle AS DetalleSolicitud,
      v.Detalle AS DetalleVisita
   FROM solicitudes s
   LEFT JOIN visita v ON s.CodigoCliente = v.CodigoSolicitud
   WHERE s.CodigoCliente = ?`,
  [codigo]
);


    if (info.length === 0 || !info[0].Correo) {
      return res.json({
        message:
          " Visita finalizada. (No se envió correo porque no se encontró correo asociado).",
      });
    }

    const { Correo, NombreCliente, Servicio,  DetalleSolicitud, DetalleVisita } = info[0];

   
    await transporter.sendMail({
      from: `"SkyNet" <${process.env.SMTP_USER}>`,
      to: Correo,
      subject: `Visita finalizada - Solicitud #${codigo}`,
      html: `
        <div style="font-family:Arial,Helvetica,sans-serif; line-height:1.5;">
          <h2 style="color:#0c7;margin:0;">SkyNet S.A.</h2>
          <p>Hola <strong>${NombreCliente || "Cliente"}</strong>,</p>
          <p>Tu solicitud <strong>#${codigo}</strong> de <strong>${Servicio ||
            "-"}</strong> ha sido atendida y marcada como <strong>finalizada</strong>.</p>
          <p><strong>Detalle registrado:</strong> ${DetalleSolicitud || "-"}</p>
         <p><strong>Detalle Técnico:</strong> ${DetalleVisita || "-"}</p>
          <p>Gracias por confiar en <strong>SkyNet S.A.</strong>.</p>
        </div>
      `,
    });

    res.json({ message: "✅ Visita finalizada y correo enviado correctamente" });
  } catch (error) {
    console.error("Error al finalizar visita o enviar correo:", error);
    res
      .status(500)
      .json({ error: "Error al finalizar visita o al enviar el correo" });
  }
});


router.put("/detalle/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;
    const { Detalle } = req.body;

    const [exist] = await pool.query(
      "SELECT 1 FROM visita WHERE CodigoSolicitud = ? LIMIT 1",
      [codigo]
    );

    if (exist.length === 0) {
      await pool.query(
        "INSERT INTO visita (CodigoSolicitud, Detalle) VALUES (?, ?)",
        [codigo, Detalle]
      );
    } else {
      await pool.query(
        "UPDATE visita SET Detalle = ? WHERE CodigoSolicitud = ?",
        [Detalle, codigo]
      );
    }

    res.json({ message: "📝 Detalle guardado correctamente" });
  } catch (error) {
    console.error("Error al guardar detalle:", error);
    res.status(500).json({ error: "Error al guardar el detalle" });
  }
});

export default router;
