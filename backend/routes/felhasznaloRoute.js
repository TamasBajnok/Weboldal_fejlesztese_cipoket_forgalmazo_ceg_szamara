import express from "express";
import felhasznaloAzonositas from "../middleware/felhasznaloAzonositas.js";
import adminAzonositas from "../middleware/adminAzonositas.js";

import {
  adminBelepes,
  felhasznaloAdatok,
  adminHitelesitve,
  adminKilepes,
  profilFrissites,
  cimTorles,
  regisztracio,
  belepes,
  kilepes,
  ellenorzoOtpKuldes,
  emailEllenorzes,
  hitelesitve,
  jelszoVisszaallitasOtpKuldes,
  otpEllenorzes,
  jelszoVisszaallitas,
  kuponEllenorzes,
  kuponKuldes,
  otpEllenorzesKetlepcsos,
  googleBelepes,
  googleCallback
} from "../controllers/felhasznaloController.js";

const felhasznaloRouter = express.Router();


felhasznaloRouter.post("/kupon-ellenorzes", felhasznaloAzonositas, kuponEllenorzes);
felhasznaloRouter.post("/kupon-kuldes", adminAzonositas, kuponKuldes);

felhasznaloRouter.post("/ketlepcsos", otpEllenorzesKetlepcsos); 
felhasznaloRouter.post("/otp-ellenorzes", otpEllenorzes); 
felhasznaloRouter.post("/jelszo-visszaallitas-otp", jelszoVisszaallitasOtpKuldes); 
felhasznaloRouter.post("/jelszo-visszaallitas", jelszoVisszaallitas); 
felhasznaloRouter.post("/admin-belepes", adminBelepes);
felhasznaloRouter.get("/adatok", felhasznaloAzonositas, felhasznaloAdatok);
felhasznaloRouter.get("/admin-hitelesitve", adminAzonositas, adminHitelesitve);
felhasznaloRouter.post("/admin-kilepes", adminKilepes);


felhasznaloRouter.post("/profil-frissites", felhasznaloAzonositas, profilFrissites); 
felhasznaloRouter.post("/cim-torles", felhasznaloAzonositas, cimTorles); 


felhasznaloRouter.post("/regisztracio", regisztracio); 
felhasznaloRouter.post("/bejelentkezes", belepes);
felhasznaloRouter.post("/kilepes", kilepes); 
felhasznaloRouter.post("/ellenorzo-otp-kuldes", felhasznaloAzonositas, ellenorzoOtpKuldes); 
felhasznaloRouter.post("/email-ellenorzes", felhasznaloAzonositas, emailEllenorzes); 
felhasznaloRouter.get("/hitelesitve", felhasznaloAzonositas, hitelesitve); 




felhasznaloRouter.get("/google", googleBelepes);


felhasznaloRouter.get("/google/callback", googleCallback);


export default felhasznaloRouter;
