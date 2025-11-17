document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaSolicitudes");

  try {
    const res = await fetch("/api/solicitudes");
    const solicitudes = await res.json();

    if (!solicitudes.length) {
      tabla.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No hay solicitudes registradas</td></tr>`;
      return;
    }

    solicitudes.forEach((sol) => {
      const fila = document.createElement("tr");
      const fechaActual = new Date().toLocaleDateString("es-GT", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      const selectSupervisor = `
        <select class="form-select form-select-sm supervisor-select" data-codigocliente="${sol.CodigoCliente}">
          <option value="">Seleccionar Supervisor</option>
          <option value="1" ${sol.CodigoSupervisor === 1 ? "selected" : ""}>Supervisor 1 (Soporte)</option>
          <option value="2" ${sol.CodigoSupervisor === 2 ? "selected" : ""}>Supervisor 2 (Infraestructura)</option>
        </select>
      `;

      fila.innerHTML = `
        <td>${sol.CodigoCliente}</td>
        <td>${sol.Servicio}</td>
        <td>${sol.Detalle}</td>
        <td>${fechaActual}</td>
        <td>${selectSupervisor}</td>
      `;

      tabla.appendChild(fila);
    });

    //  Evento para asignar supervisor
    tabla.addEventListener("change", async (e) => {
      if (e.target.classList.contains("supervisor-select")) {
        const CodigoCliente = e.target.dataset.codigocliente;
        const CodigoSupervisor = e.target.value;

        if (CodigoSupervisor) {
          const confirmacion = confirm(
            `¿Asignar Supervisor ${CodigoSupervisor} a la solicitud ${CodigoCliente}?`
          );
          if (!confirmacion) return;

          const res = await fetch("/api/solicitudes/asignar", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CodigoCliente, CodigoSupervisor }),
          });

          const data = await res.json();
          alert(data.message || "Supervisor asignado correctamente");
        }
      }
    });
  } catch (error) {
    console.error("Error al cargar las solicitudes:", error);
    tabla.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error al conectar con el servidor</td></tr>`;
  }
});
