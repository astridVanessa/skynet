document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaAsignaciones");
  const tecnicoActual = 101;

  try {
    //  Obtener solicitudes asignadas al técnico
    const res = await fetch(`/api/solicitudes/tecnico/${tecnicoActual}`);
    const solicitudes = await res.json();

    if (!solicitudes.length) {
      tabla.innerHTML = `<tr><td colspan="2" class="text-muted text-center">No tienes asignaciones pendientes</td></tr>`;
      return;
    }

    //  Mostrar las solicitudes en tabla
    solicitudes.forEach((sol) => {
      const fila = document.createElement("tr");
      fila.innerHTML = `
        <td>${sol.CodigoCliente}</td>
        <td>
          <button class="btn btn-info btn-sm ver-detalle" data-id="${sol.CodigoCliente}">
            Ver más detalles
          </button>
        </td>
      `;
      tabla.appendChild(fila);
    });

    // Evento para redirigir al detalle
    tabla.addEventListener("click", (e) => {
      if (e.target.classList.contains("ver-detalle")) {
        const id = e.target.dataset.id;
        // Redirige al detalle 
        window.location.href = `verDetalle.html?codigo=${id}`;
      }
    });

  } catch (error) {
    console.error("Error al cargar las asignaciones:", error);
    tabla.innerHTML = `<tr><td colspan="2" class="text-danger text-center">Error al conectar con el servidor</td></tr>`;
  }
});
