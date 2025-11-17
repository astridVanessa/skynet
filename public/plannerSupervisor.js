document.addEventListener("DOMContentLoaded", async () => {
  const contenedor = document.getElementById("contenedorPlanner");
  const supervisorActual = "Supervisor 1";
  contenedor.innerHTML = `<p class="text-center text-muted">Cargando planner...</p>`;

  try {
    const res = await fetch(`/api/planner/${supervisorActual}`);
    const planner = await res.json();

    if (!planner.length) {
      contenedor.innerHTML = `<p class="text-center text-muted">No hay solicitudes registradas para este supervisor.</p>`;
      return;
    }

    contenedor.innerHTML = ""; 
    planner.forEach((p) => {
      // Determinar color según estado
      let estado = "Pendiente ⏳";
      let color = "secondary";

      if (p.FechaInicioVisita && !p.FechaFinVisita) {
        estado = "En curso 🟢";
        color = "success";
      } else if (p.FechaFinVisita) {
        estado = "Finalizada 🪄";
        color = "primary";
      }

      const card = document.createElement("div");
      card.className = "col-md-4 col-lg-3 d-flex";
      card.innerHTML = `
        <div class="card shadow-sm border-0 flex-fill">
          <div class="card-body">
            <h5 class="card-title text-dark">Solicitud #${p.CodigoSolicitud}</h5>
            <p class="card-text"><strong>Servicio:</strong> ${p.Servicio}</p>
            <p class="card-text"><strong>Detalle:</strong> ${p.Detalle || "Sin detalle"}</p>
            <p class="card-text"><strong>Estado:</strong> <span class="badge bg-${color}">${estado}</span></p>
            <p class="card-text"><strong>Inicio:</strong> ${p.FechaInicioVisita ? new Date(p.FechaInicioVisita).toLocaleString("es-GT") : "-"}</p>
            <p class="card-text"><strong>Fin:</strong> ${p.FechaFinVisita ? new Date(p.FechaFinVisita).toLocaleString("es-GT") : "-"}</p>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });

    console.log(`🪄 Planner cargado con ${planner.length} registros`);
  } catch (error) {
    console.error("Error al cargar planner:", error);
    contenedor.innerHTML = `<p class="text-center text-danger">❌ Error al cargar el planner.</p>`;
  }
});
