
  document.getElementById("btnLogout").addEventListener("click", () => {
   
      localStorage.clear(); // Limpia datos guardados del usuario
      window.location.href = "login.html"; // Redirige al login
    
  });
