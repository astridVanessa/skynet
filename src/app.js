import "dotenv/config";
import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Rutas
import clienteRoutes from "./routes/clientesRoutes.js"; 
import loginRoutes from "./routes/loginRoutes.js"; 
import solicitudesRoutes from "./routes/solicitudesRoutes.js";
import empleadoRoutes from "./routes/empleadoRoutes.js";
import visitaRoutes from "./routes/visitaRoutes.js";
import plannerRoutes from "./routes/plannerRoutes.js";
import planner2Routes from "./routes/planner2Routes.js";
import cambiarContrasenaRoutes from "./routes/cambiarContrasenaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Servir frontend
app.use(express.static(path.join(__dirname, "../public")));

// API
app.use("/api/clientes", clienteRoutes);
app.use("/api/empleados", empleadoRoutes);
app.use("/api/solicitudes", solicitudesRoutes);
app.use("/api/login", loginRoutes); 
app.use("/api/visita", visitaRoutes);
app.use("/api/planner", plannerRoutes); 
app.use("/api/planner2", planner2Routes);
app.use("/api/cambiar-contrasena", cambiarContrasenaRoutes);

console.log("✅ SMTP_USER cargado:", process.env.SMTP_USER ? "Sí" : "No");

// Ruta raíz
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// Catch-all (Express 5 compatible)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

export default app;
