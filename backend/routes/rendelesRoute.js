import express from "express";
import {
  osszesRendeles,
  rendelesKeszpenz,
  rendelesStripe,
  rendelesStatuszFrissites,
  felhasznaloRendelesek,
  stripeEllenorzes,
  rendelesTorles,
  fizetesFrissites,
  egyRendelesElemei,
} from "../controllers/rendelesController.js";
import adminAzonositas from "../middleware/adminAzonositas.js";
import felhasznaloAzonositas from "../middleware/felhasznaloAzonositas.js";

const rendelesRouter = express.Router();

rendelesRouter.post("/keszpenz", felhasznaloAzonositas, rendelesKeszpenz);
rendelesRouter.post("/stripe", felhasznaloAzonositas, rendelesStripe);
rendelesRouter.post(
  "/felhasznalo",
  felhasznaloAzonositas,
  felhasznaloRendelesek
);
rendelesRouter.post(
  "/ellenorzes-stripe",
  felhasznaloAzonositas,
  stripeEllenorzes
);

rendelesRouter.post("/osszes", adminAzonositas, osszesRendeles);
rendelesRouter.post("/statusz", adminAzonositas, rendelesStatuszFrissites);
rendelesRouter.post("/torles", adminAzonositas, rendelesTorles);
rendelesRouter.post("/fizetes", adminAzonositas, fizetesFrissites);
rendelesRouter.post("/rendeles-tetelei", adminAzonositas, egyRendelesElemei);

export default rendelesRouter;
