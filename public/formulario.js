const form = document.getElementById("solicitudForm");
  const toastEl = document.getElementById("toastSolicitud");
  const toastBody = document.getElementById("toastBody");
  const toast = new bootstrap.Toast(toastEl);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.ok) {
        toastBody.textContent = `¡Solicitud enviada! Número de solicitud: ${result.id}`;
        toast.show();
        form.reset();
      } else {
        toastBody.textContent = `Error: ${result.error}`;
        toast.show();
      }
    } catch (err) {
      toastBody.textContent = `Error al registrar la solicitud: ${err.message}`;
      toast.show();
    }
  });