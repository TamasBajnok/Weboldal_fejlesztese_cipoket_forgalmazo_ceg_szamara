import express from "express";
import {
  kosarhozAdas,
  kosarFrissites,
  kosarLekeres,
  kosarTorles,
  kocsiAtvitele,
} from "../controllers/kosarController.js";
import felhasznaloAzonositas from "../middleware/felhasznaloAzonositas.js";

const kosarRouter = express.Router();

kosarRouter.post("/hozzaadas", felhasznaloAzonositas, kosarhozAdas);
kosarRouter.post("/frissites", felhasznaloAzonositas, kosarFrissites);
kosarRouter.post("/lekeres", felhasznaloAzonositas, kosarLekeres);
kosarRouter.post("/kocsi-torles", felhasznaloAzonositas, kosarTorles);
kosarRouter.post("/kosar-atvitele", felhasznaloAzonositas, kocsiAtvitele);

export default kosarRouter;
