import express from "express";
import {
  termekHozzaadas,
  velemenyHozzaadas,
  termekLista,
  termekTorles,
  egyTermek,
  velemenyTorles,
  termekLekerdez,
  termekModosit,
  termekSorrendFrissit,
} from "../controllers/termekController.js";

import feltolt from "../middleware/multer.js";
import felhasznaloAzonositas from "../middleware/felhasznaloAzonositas.js";
import adminAzonositas from "../middleware/adminAzonositas.js";

const termekRouter = express.Router();

const kepMezok = [
  { name: "kep1", maxCount: 1 },
  { name: "kep2", maxCount: 1 },
  { name: "kep3", maxCount: 1 },
  { name: "kep4", maxCount: 1 },
  { name: "kep5", maxCount: 1 },
  { name: "kep6", maxCount: 1 },
  { name: "kep7", maxCount: 1 },
  { name: "kep8", maxCount: 1 },
];

termekRouter.post(
  "/hozzaad",
  adminAzonositas,
  feltolt.fields(kepMezok),
  termekHozzaadas
);

termekRouter.post(
  "/modosit",
  adminAzonositas,
  feltolt.fields(kepMezok),
  termekModosit
);

termekRouter.post("/torles", adminAzonositas, termekTorles);

termekRouter.post("/egy", egyTermek);

termekRouter.get("/lista", termekLista);

termekRouter.post("/velemeny-hozzaadas", felhasznaloAzonositas, velemenyHozzaadas);

termekRouter.post("/velemeny-torles", felhasznaloAzonositas, velemenyTorles);
termekRouter.post("/lekerdez", termekLekerdez);


termekRouter.post("/sorrend", adminAzonositas, termekSorrendFrissit);

export default termekRouter;
