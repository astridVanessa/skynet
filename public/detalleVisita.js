const API = "https://skynet-production-f480.up.railway.app/api";

if (!location.search.includes("codigo")) {
  const codigoGuardado = localStorage.getItem("codigo_visita");
  if (codigoGuardado) {
    location.href = `detalleVisita.html?codigo=${codigoGuardado}`;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const mensaje = document.getElementById("mensaje");

  const mostrarMsg = (txt, tipo) => {
    mensaje.textContent = txt;
    mensaje.className =
      tipo === "ok"
        ? "text-success text-center fw-semibold"
        : "text-danger text-center fw-semibold";
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "-";
    return new Date(fecha).toLocaleString("es-GT", {
      dateStyle: "short",
      timeStyle: "short",
      hour12: true,
    });
  };

  const cargarDetalle = async () => {
    try {
      const res = await fetch(`${API}/visita/${codigo}`);
      const data = await res.json();
      if (!res.ok) throw new Error();

      document.getElementById("nombreCliente").textContent = data.NombreCliente || "-";
      document.getElementById("coordenadas").textContent = data.Coordenadas || "-";
      document.getElementById("detalleSolicitud").textContent = data.DetalleSolicitud || "-";
      document.getElementById("fechaInicio").textContent = formatearFecha(data.FechaInicioVisita);
      document.getElementById("fechaFin").textContent = formatearFecha(data.FechaFinVisita);
      document.getElementById("detalleTecnico").value = data.DetalleVisita || "";
    } catch (err) {
      mostrarMsg("❌ Error al cargar los datos de la visita", "error");
    }
  };

  await cargarDetalle();

  document.getElementById("btnInicio").addEventListener("click", async () => {
    try {
      const res = await fetch(`${API}/visita/inicio/${codigo}`, { method: "PUT" });
      if (!res.ok) throw new Error();
      mostrarMsg("✅ Visita iniciada correctamente", "ok");
      await cargarDetalle();
    } catch (err) {
      mostrarMsg("❌ No se pudo iniciar la visita", "error");
    }
  });

  document.getElementById("btnFin").addEventListener("click", async () => {
    try {
      const res = await fetch(`${API}/visita/fin/${codigo}`, { method: "PUT" });
      if (!res.ok) throw new Error();
      mostrarMsg("✅ Visita finalizada y correo enviado", "ok");
      await cargarDetalle();
    } catch (err) {
      mostrarMsg("❌ Error al finalizar la visita", "error");
    }
  });

  document.getElementById("btnGuardar").addEventListener("click", async () => {
    const Detalle = document.getElementById("detalleTecnico").value.trim();
    if (!Detalle) return mostrarMsg("❗ Escribe un detalle", "error");

    try {
      const res = await fetch(`${API}/visita/detalle/${codigo}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Detalle }),
      });
      if (!res.ok) throw new Error();

      mostrarMsg("📝 Detalle actualizado", "ok");
      await cargarDetalle();
    } catch (err) {
      mostrarMsg("❌ Error al guardar detalle", "error");
    }
  });

  document.getElementById("coordenadas").addEventListener("click", () => {
    const coords = document.getElementById("coordenadas").textContent.trim();
    if (!coords || coords === "-") {
      alert("⚠ No hay coordenadas registradas.");
      return;
    }

    const [lat, lng] = coords.split(",").map(Number);
    const modal = new bootstrap.Modal(document.getElementById("mapModal"));
    modal.show();

    setTimeout(() => {
      const map = new google.maps.Map(document.getElementById("map"), {
        center: { lat, lng },
        zoom: 15,
      });

      new google.maps.Marker({
        position: { lat, lng },
        map,
        title: "Ubicación del cliente",
      });
    }, 500);
  });

  document.getElementById("btnPDF").addEventListener("click", async () => {
    try {
      const { jsPDF } = window.jspdf;
      const res = await fetch(`${API}/visita/${codigo}`);
      const data = await res.json();

      const doc = new jsPDF();
      let y = 20;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(18);
      doc.text("SkyNet S.A.", 105, y, { align: "center" });

      y += 10;
      doc.setFontSize(12);
      doc.text("Reporte de Visita Técnica", 105, y, { align: "center" });

      y += 10;
      doc.line(20, y, 190, y);
      y += 10;

      doc.setFont("helvetica", "normal");
      doc.text(`Solicitud: ${codigo}`, 20, y);
      y += 7;
      doc.text(`Cliente: ${data.NombreCliente || "-"}`, 20, y);
      y += 7;
      doc.text(`Servicio: ${data.Servicio || "-"}`, 20, y);
      y += 7;
      doc.text(`Coordenadas: ${data.Coordenadas || "-"}`, 20, y);

      y += 15;
      doc.setFont("helvetica", "bold");
      doc.text("Detalle del Técnico:", 20, y);
      y += 7;
      doc.setFont("helvetica", "normal");
      doc.text(data.DetalleVisita || "-", 20, y, { maxWidth: 170 });

      doc.save(`Visita_${codigo}.pdf`);
    } catch (err) {
      mostrarMsg("❌ No se pudo generar el PDF", "error");
    }
  });
});
