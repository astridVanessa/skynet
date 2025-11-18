router.put("/fin/:codigo", async (req, res) => {
  try {
    const { codigo } = req.params;

    // Registrar fin
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

    // Obtener info para correo
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

    // Configurar Gmail + App Password
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Enviar correo
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
