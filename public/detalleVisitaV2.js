const API = "https://skynet-production-f480.up.railway.app/api";

// Si no hay ?codigo en la URL, intenta recuperar desde localStorage
if (!location.search.includes("codigo")) {
  const codigoGuardado = localStorage.getItem("codigo_visita");
  if (codigoGuardado) {
    location.href = `verDetalle.html?codigo=${codigoGuardado}`;
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
    const res = await fetch(`${API}/visita/${codigo}`);
    const data = await res.json();

    document.getElementById("nombreCliente").textContent =
      data.NombreCliente || "-";
    document.getElementById("coordenadas").textContent =
      data.Coordenadas || "-";
    document.getElementById("detalleSolicitud").textContent =
      data.DetalleSolicitud || "-";
    document.getElementById("fechaInicio").textContent =
      formatearFecha(data.FechaInicioVisita);
    document.getElementById("fechaFin").textContent =
      formatearFecha(data.FechaFinVisita);
    document.getElementById("detalleTecnico").value =
      data.DetalleVisita || "";
  };

  await cargarDetalle();

  // Iniciar visita
  document.getElementById("btnInicio").addEventListener("click", async () => {
    const res = await fetch(`${API}/visita/inicio/${codigo}`, {
      method: "PUT",
    });

    if (!res.ok)
      return mostrarMsg("❌ No se pudo iniciar la visita", "error");

    mostrarMsg("✅ Visita iniciada correctamente", "ok");
    await cargarDetalle();
  });

  // Guardar detalle técnico
  document.getElementById("btnGuardar").addEventListener("click", async () => {
    const Detalle = document
      .getElementById("detalleTecnico")
      .value.trim();

    if (!Detalle)
      return mostrarMsg("❗ Escribe un detalle", "error");

    const res = await fetch(`${API}/visita/detalle/${codigo}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Detalle }),
    });

    if (!res.ok)
      return mostrarMsg("❌ Error al guardar detalle", "error");

    mostrarMsg("📝 Detalle actualizado", "ok");
    await cargarDetalle();
  });

  // Mostrar mapa
  document.getElementById("coordenadas").addEventListener("click", () => {
    const coords = document
      .getElementById("coordenadas")
      .textContent.trim();
    if (!coords || coords === "-") {
      alert("⚠ No hay coordenadas registradas.");
      return;
    }

    const [lat, lng] = coords.split(",").map(Number);
    const modal = new bootstrap.Modal(
      document.getElementById("mapModal")
    );
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

  // Exportar PDF
  document.getElementById("btnPDF").addEventListener("click", async () => {
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

  
    y += 7;
    doc.text(`Detalle Visita: ${data.DetalleVisita || "-"}`, 20, y);
    y += 7;
    doc.text(`Inicio Visita: ${data.FechaInicioVisita || "-"}`, 20, y);
y += 7;
    doc.text(`Fin Visita: ${data.FechaFinVisita || "-"}`, 20, y);



    y += 15;
    doc.setFont("helvetica", "bold");
    doc.text("Detalle del Técnico:", 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.text(data.DetalleVisita || "-", 20, y, { maxWidth: 170 });

    doc.save(`Visita_${codigo}.pdf`);
  });

});
// Finalizar Visita
window.finalizarVisita = async function () {
  const params = new URLSearchParams(window.location.search);
  const codigo = params.get("codigo");
  const mensaje = document.getElementById("mensaje");

  try {
    const res = await fetch(`${API}/visita/fin/${codigo}`, {
      method: "PUT",
    });

    console.log("PUT /visita/fin status:", res.status);

    if (!res.ok) {
      mensaje.textContent = "❌ Error al finalizar la visita";
      mensaje.className = "text-danger text-center fw-semibold";
      return;
    }

    mensaje.textContent = "✅ Visita finalizada y correo enviado";
    mensaje.className = "text-success text-center fw-semibold";

  } catch (err) {
    console.error("Error en finalizarVisita:", err);
    mensaje.textContent = "❌ Error al finalizar la visita";
    mensaje.className = "text-danger text-center fw-semibold";
  }
};
