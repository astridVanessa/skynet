document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaSolicitudes");

  if (!tabla) {
    console.error("No se encontró la tabla con id 'tablaSolicitudes'");
    return;
  }

  // mensaje de accion
  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = `
    <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3"
         id="toastSuccess" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body" id="toastMessage">✅ Acción realizada con éxito</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  document.body.appendChild(toastContainer);
  const toastBootstrap = new bootstrap.Toast(document.getElementById("toastSuccess"));

  try {
    //  Cargar solicitudes 
    const res = await fetch("/api/solicitudes");
    const solicitudes = await res.json();

    if (!solicitudes.length) {
      tabla.innerHTML = `<tr><td colspan="4" class="text-muted text-center">No hay solicitudes registradas</td></tr>`;
      return;
    }

    solicitudes.forEach((sol) => {
      const fila = document.createElement("tr");

      const selectSupervisor = `
        <select class="form-select form-select-sm supervisor-select" data-codigocliente="${sol.CodigoCliente}">
          <option value="">Seleccionar Supervisor</option>
          <option value="1">Supervisor 1</option>
          <option value="2">Supervisor 2</option>
        </select>
      `;

      fila.innerHTML = `
        <td>${sol.CodigoCliente}</td>
        <td>${sol.Servicio}</td>
        <td>${sol.Detalle}</td>
        <td>${selectSupervisor}</td>
      `;
      tabla.appendChild(fila);
    });

    //  Asignacion de supervisor
    tabla.addEventListener("change", async (e) => {
      if (e.target.classList.contains("supervisor-select")) {
        const CodigoCliente = e.target.dataset.codigocliente;
        const Supervisor = e.target.value;

        if (Supervisor) {
          try {
            const res = await fetch("/api/solicitudes/asignar", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ CodigoCliente, Supervisor }),
            });

            const data = await res.json();

            //  Mostrar Toast
            document.getElementById("toastMessage").textContent =
              `✅ Solicitud ${CodigoCliente} asignada al Supervisor ${Supervisor}`;
            toastBootstrap.show();

            //  Eliminar fila de la tabla
            e.target.closest("tr").remove();

            
            if (tabla.children.length === 0) {
              tabla.innerHTML = `<tr><td colspan="4" class="text-muted text-center">No hay más solicitudes</td></tr>`;
            }
          } catch (err) {
            console.error("Error al asignar supervisor:", err);
          }
        }
      }
    });
  } catch (error) {
    console.error("Error al cargar las solicitudes:", error);
    tabla.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Error al conectar con el servidor</td></tr>`;
  }
});
