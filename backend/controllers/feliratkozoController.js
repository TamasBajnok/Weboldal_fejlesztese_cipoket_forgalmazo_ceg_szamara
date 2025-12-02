import FelhasznaloModel from "../models/felhasznaloModel.js";
import validator from "validator";
import kuldEmail from "../config/nodemailer.js";
import FeliratkozoModel from "../models/feliratkozoModel.js";
import { HIRLEVEL_FELIRATKOZAS_HTML } from "../config/emailMintak.js";

const feliratkozasBeallitas = async (req, res) => {
  const { felhasznaloId, email } = req.body;

  if (!email) {
    return res.json({ siker: false, uzenet: "Nincs megadva email!" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ siker: false, uzenet: "Érvénytelen email cím!" });
  }

  const valodiFelhasznalo = await FelhasznaloModel.findById(felhasznaloId);
  if (!valodiFelhasznalo) {
    return res.json({ siker: false, uzenet: "Felhasználó nem létezik!" });
  }

  try {
    const feliratkozo = await FeliratkozoModel.findOne({ email: email });
    if (!feliratkozo) {
      const ujFeliratkozo = new FeliratkozoModel({
        email: email,
        felhasznaloId: felhasznaloId,
        letrehozva: new Date(),
      });
      await ujFeliratkozo.save();
    } else {
      return res.json({ siker: false, uzenet: "Már fel van iratkozva!" });
    }

    const karakterek = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let kod = "";
    for (let i = 0; i < 6; i++) {
      kod += karakterek.charAt(Math.floor(Math.random() * karakterek.length));
    }

    const kupon = {
      kupon: String(kod),
      kedvezmeny: 20,
      lejaratiDatum: new Date("9999-01-01"),
    };

    valodiFelhasznalo.kuponok.push(kupon);
    await valodiFelhasznalo.save();

    const emailUzenetTartalom = {
      to: valodiFelhasznalo.email,
      subject: "Hírlevélre való feliratkozás",
      text: `Kedves Felhasználó! Köszönjük, hogy feliratkozott a hírlevelünkre. A '${String(
        kod
      )}' kuponkódot bármikor igénybe veheti, hogy 20%-kal olcsóbban vásároljon nálunk!`,
      html: HIRLEVEL_FELIRATKOZAS_HTML(kod, valodiFelhasznalo.nev),
    };

    await kuldEmail.sendMail(emailUzenetTartalom);

    return res.json({
      siker: true,
      uzenet: "Sikeresen feliratkoztál a hírlevélre!",
    });
  } catch (error) {
    return res.json({ siker: false, uzenet: error.message });
  }
};

export { feliratkozasBeallitas };
