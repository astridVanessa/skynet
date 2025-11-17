document.addEventListener("DOMContentLoaded", function() {
    const saludo = document.getElementById('saludo');
    if (saludo) {
        const hora = new Date().getHours();
        let mensaje = "";

        if (hora >= 5 && hora < 12) {
            mensaje = "¡Buenos días!🌞";
        } else if (hora >= 12 && hora < 19) {
            mensaje = "¡Buenas tardes!🌤️";
        } else {
            mensaje = "¡Buenas noches!🌛";
        }

        saludo.textContent = mensaje;
    }
});
