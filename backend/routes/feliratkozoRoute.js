import express from "express";
import felhasznaloAzonositas from "../middleware/felhasznaloAzonositas.js";
import { feliratkozasBeallitas } from "../controllers/feliratkozoController.js";

const feliratkozasRouter = express.Router();

feliratkozasRouter.post("/feliratkozas", felhasznaloAzonositas, feliratkozasBeallitas);

export default feliratkozasRouter;
