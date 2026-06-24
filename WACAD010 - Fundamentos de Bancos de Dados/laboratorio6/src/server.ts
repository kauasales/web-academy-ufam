import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { clientRoutes } from "./routes/clientRoutes.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());

// Servir os arquivos estáticos do Front-end (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "../public")));

// Rotas da API
app.use("/api/clientes", clientRoutes);

export { app };