import express from "express";
import pool from "../config/db.js";
import nodemailer from "nodemailer";

const router = express.Router();


router.get("/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    const [rows] = await pool.query(
      `SELECT 
        s.CodigoCliente   AS CodigoSolicitud,
        s.NombreCliente   AS NombreCliente,
        s.ApellidoCliente,
        s.Correo,
        s.TelefonoPrincipal,
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

    res.json({ message: "Visita iniciada correctamente" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al iniciar visita" });
  }
});



router.put("/fin/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    const [exist] = await pool.query(
      "SELECT 1 FROM visita WHERE CodigoSolicitud = ? LIMIT 1",
      [codigo]
    );

    if (exist.length === 0) {
      await pool.query(
        "INSERT INTO visita (CodigoSolicitud, FechaFinVisita) VALUES (?, NOW())",
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

    if (!info.length || !info[0].Correo) {
      return res.json({
        message: "Visita finalizada. No se envió correo porque no hay correo registrado."
      });
    }

    const { Correo, NombreCliente, Servicio, DetalleSolicitud, DetalleVisita } = info[0];

   

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,          // smtp.gmail.com
      port: Number(process.env.SMTP_PORT),  // 587
      secure: process.env.SMTP_SECURE === "true", // false
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false, // evita bloqueos en Railway
      },
    });

  
    await transporter.sendMail({
      from: `"SkyNet S.A." <${process.env.SMTP_USER}>`,
      to: Correo,
      subject: `Visita finalizada - Solicitud #${codigo}`,
      html: `
        <h2>SkyNet S.A.</h2>
        <p>Hola <strong>${NombreCliente}</strong>,</p>
        <p>Tu solicitud #${codigo} ha sido finalizada.</p>
        <p><strong>Servicio:</strong> ${Servicio}</p>
        <p><strong>Detalle de la solicitud:</strong> ${DetalleSolicitud}</p>
        <p><strong>Detalle técnico:</strong> ${DetalleVisita}</p>
      `,
    });

    res.json({ message: "✔ Visita finalizada y correo enviado correctamente" });

  } catch (error) {
    console.error("ERROR enviando correo:", error);
    res.status(500).json({ error: "Error al finalizar y enviar correo" });
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

    res.json({ message: "Detalle guardado correctamente" });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Error al guardar detalle" });
  }
});

export default router;
