document.addEventListener("DOMContentLoaded", async () => {
  const tabla = document.getElementById("tablaSolicitudes");
  const supervisorActual = 1; 

  //  Crear Toast emergente 
  const toastContainer = document.createElement("div");
  toastContainer.innerHTML = `
    <div class="toast align-items-center text-bg-success border-0 position-fixed bottom-0 end-0 m-3" id="toastSuccess" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body" id="toastMessage">✅ Acción realizada correctamente.</div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  document.body.appendChild(toastContainer);
  const toastBootstrap = new bootstrap.Toast(document.getElementById("toastSuccess"));

  try {
    const res = await fetch(`/api/solicitudes/supervisor/${supervisorActual}`);
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
          <option value="101">Técnico A</option>
          <option value="102">Técnico B</option>
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

    // Asignar técnic
    tabla.addEventListener("change", async (e) => {
      if (e.target.classList.contains("tecnico-select")) {
        const CodigoCliente = e.target.dataset.codigocliente;
        const CodigoTecnico = e.target.value;

        if (CodigoTecnico) {
          try {
            const res = await fetch("/api/solicitudes/tecnico", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ CodigoCliente, CodigoTecnico }),
            });

            const data = await res.json();

           
            document.getElementById("toastMessage").textContent = `✅ Técnico asignado correctamente`;
            toastBootstrap.show();

            
            e.target.closest("tr").remove();

           
            if (tabla.children.length === 0) {
              tabla.innerHTML = `<tr><td colspan="5" class="text-muted text-center">No hay más solicitudes</td></tr>`;
            }

          } catch (err) {
            console.error(err);
          }
        }
      }
    });
  } catch (error) {
    console.error("Error al cargar solicitudes:", error);
    tabla.innerHTML = `<tr><td colspan="5" class="text-danger text-center">Error al conectar con el servidor</td></tr>`;
  }
});
