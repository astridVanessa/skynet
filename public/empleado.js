const form = document.getElementById("formEmpleado");
const btnBuscar = document.getElementById("btnBuscar");
const btnEliminar = document.getElementById("btnEliminar");
const mensaje = document.getElementById("mensaje");

// Buscar empleado
btnBuscar.addEventListener("click", async () => {
  const codigo = document.getElementById("codigoBuscar").value.trim();
  if (!codigo) {
    alert("Por favor ingresa un código para buscar.");
    return;
  }

  try {
    const res = await fetch(`http://localhost:3000/api/empleados/${codigo}`);
    if (res.ok) {
      const emp = await res.json();
      document.getElementById("nombre").value = emp.NombreTrabajador;
      document.getElementById("apellido").value = emp.ApellidoTrabajador;
      document.getElementById("telefono").value = emp.TelefonoTrabajador;
      document.getElementById("correo").value = emp.CorreoTrabajador;
      document.getElementById("credencial").value = emp.CredencialTrabajador;
      document.getElementById("rol").value = emp.CodigoRol;
      document.getElementById("fechaInicio").value = emp.FechaInicioLabores?.split("T")[0] || "";
      document.getElementById("fechaFin").value = emp.FechaFinLabores?.split("T")[0] || "";

      mensaje.className = "alert alert-success mt-3";
      mensaje.textContent = "✅ Empleado encontrado";
      mensaje.classList.remove("d-none");
    } else {
      mensaje.className = "alert alert-warning mt-3";
      mensaje.textContent = "⚠️ Empleado no encontrado";
      mensaje.classList.remove("d-none");
      form.reset();
    }
  } catch {
    mensaje.className = "alert alert-danger mt-3";
    mensaje.textContent = "❌ Error al buscar empleado";
    mensaje.classList.remove("d-none");
  }
});

// Guardar o actualizar empleado
form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const codigo = document.getElementById("codigoBuscar").value.trim();
  const empleado = {
    NombreTrabajador: document.getElementById("nombre").value,
    ApellidoTrabajador: document.getElementById("apellido").value,
    TelefonoTrabajador: document.getElementById("telefono").value,
    CorreoTrabajador: document.getElementById("correo").value,
    CredencialTrabajador: document.getElementById("credencial").value,
    CodigoRol: document.getElementById("rol").value,
    FechaInicioLabores: document.getElementById("fechaInicio").value,
    FechaFinLabores: document.getElementById("fechaFin").value,
  };

  const method = codigo ? "PUT" : "POST";
  const url = codigo
    ? `http://localhost:3000/api/empleados/${codigo}`
    : "http://localhost:3000/api/empleados";

  try {
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(empleado),
    });

    if (res.ok) {
      mensaje.className = "alert alert-success mt-3";
      mensaje.textContent = codigo
        ? "✅ Empleado actualizado correctamente"
        : "✅ Empleado registrado con éxito";
      mensaje.classList.remove("d-none");
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    mensaje.className = "alert alert-danger mt-3";
    mensaje.textContent = "❌ Error al guardar empleado";
    mensaje.classList.remove("d-none");
  }
});

// Eliminar empleado
btnEliminar.addEventListener("click", async () => {
  const codigo = document.getElementById("codigoBuscar").value.trim();
  if (!codigo) {
    alert("Debes ingresar un código para eliminar.");
    return;
  }

  if (!confirm("¿Seguro que deseas eliminar este empleado?")) return;

  try {
    const res = await fetch(`http://localhost:3000/api/empleados/${codigo}`, {
      method: "DELETE",
    });
    if (res.ok) {
      mensaje.className = "alert alert-success mt-3";
      mensaje.textContent = "✅ Empleado eliminado correctamente";
      mensaje.classList.remove("d-none");
      form.reset();
    } else {
      throw new Error();
    }
  } catch {
    mensaje.className = "alert alert-danger mt-3";
    mensaje.textContent = "❌ Error al eliminar empleado";
    mensaje.classList.remove("d-none");
  }
});
