
import express from "express";
import cors from "cors";
import visitaRoutes from "./routes/visitaRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/visita", visitaRoutes);

app.get("/", (req, res) => {
  res.send("API corriendo");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Servidor en puerto", PORT));
