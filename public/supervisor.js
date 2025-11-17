document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaSolicitudes");

  try {
   
    const res = await fetch("/api/solicitudes/supervisor/Supervisor 1");

    const solicitudes = await res.json();

    if (!solicitudes.length) {
      tabla.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No hay solicitudes asignadas</td></tr>`;
      return;
    }

    solicitudes.forEach((sol) => {
      const fila = document.createElement("tr");

      const selectTecnico = `
        <select class="form-select form-select-sm tecnico-select" data-codigocliente="${sol.CodigoCliente}">
          <option value="">Seleccionar Técnico</option>
          <option value="1">Técnico</option>
         
        </select>
      `;

      fila.innerHTML = `
        <td>${sol.CodigoCliente}</td>
        <td>${sol.Servicio}</td>
        <td>${sol.Detalle}</td>
        <td>${sol.Supervisor}</td>
        <td>${selectTecnico}</td>
      `;

      tabla.appendChild(fila);
    });

    //  asigna técnico
    tabla.addEventListener("change", async (e) => {
      if (e.target.classList.contains("tecnico-select")) {
        const CodigoCliente = e.target.dataset.codigocliente;
        const CodigoTecnico = e.target.value;

        if (CodigoTecnico) {
          const confirmacion = confirm(
            `¿Asignar Técnico ${CodigoTecnico} a la solicitud ${CodigoCliente}?`
          );
          if (!confirmacion) return;

          const res = await fetch("/api/solicitudes/tecnico", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ CodigoCliente, CodigoTecnico }),
          });

          const data = await res.json();
          alert(data.message || "Técnico asignado correctamente");

          // Elimina la fila una vez asignado el técnico
          e.target.closest("tr").remove();
        }
      }
    });
  } catch (error) {
    console.error("Error al cargar las solicitudes:", error);
    tabla.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error al conectar con el servidor</td></tr>`;
  }
});
