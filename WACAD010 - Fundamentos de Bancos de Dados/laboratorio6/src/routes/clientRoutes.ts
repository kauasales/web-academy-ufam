import { Router } from "express";
import { ClientController } from "../controllers/ClientController.js";

const clientRoutes = Router();
const clientController = new ClientController();

clientRoutes.post("/", clientController.create);
clientRoutes.get("/", clientController.list);
clientRoutes.put("/:rg", clientController.update);
clientRoutes.delete("/:rg", clientController.delete);

export { clientRoutes };