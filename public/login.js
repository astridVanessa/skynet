const form = document.getElementById("loginForm");
const mensaje = document.getElementById("mensaje");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const data = {
    NombreUsuario: form.NombreUsuario.value,
    CredencialesUsuario: form.ContraseñaUsuario.value
  };

  try {
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const json = await res.json();
    console.log(json); // Para depuración

    if (json.ok) {
      mensaje.textContent = `Bienvenido ${json.usuario} (${json.rol})`;
      mensaje.className = "text-success mt-3 text-center";

      // Redirección según rol
      if (json.rol === "Administrador") {
        setTimeout(() => window.location.href = "/admin.html", 1000);
      } else if (json.rol === "Supervisor1") {
        setTimeout(() => window.location.href = "/supervisor.html", 1000);
      } else if (json.rol === "Supervisor2") {
        setTimeout(() => window.location.href = "/supervisor2.html", 1000);
      } else if (json.rol === "Tecnico") {
        setTimeout(() => window.location.href = "/tecnico.html", 1000);
      } else if (json.rol === "Tecnico2") {
        setTimeout(() => window.location.href = "/tecnico2.html", 1000);
      }
    } else {
      mensaje.textContent = json.error;
      mensaje.className = "text-danger mt-3 text-center";
    }

  } catch (err) {
    mensaje.textContent = "Error de conexión al servidor";
    mensaje.className = "text-danger mt-3 text-center";
    console.error(err);
  }
});
