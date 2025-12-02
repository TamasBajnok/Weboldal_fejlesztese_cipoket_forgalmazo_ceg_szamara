import RendelesModel from "../models/rendelesModel.js";
import FelhasznaloModel from "../models/felhasznaloModel.js";
import TermekModel from "../models/termekModel.js";
import Stripe from "stripe";
import kuldEmail from "../config/nodemailer.js";
import {
  UTON,
  RENDELES_HTML,
  SZALLITAS_KULDES_HTML,
  SZALLITAS_FOLYAMAT_HTML,
  SZALLITAS_KESZULT_HTML,
} from "../config/emailMintak.js";

const penznem = "HUF";
const szallitasiDij = 2000;

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const rendelesKeszpenz = async (req, res) => {
  try {
    const { felhasznaloId, tetelek, osszeg, cim, kupon, kuponKedvezmeny } =
      req.body;
    const felhasznalo = await FelhasznaloModel.findById(felhasznaloId);
    if (!felhasznalo) {
      return res.json({
        siker: false,
        uzenet: "Felhasználó nem található!",
      });
    }

    const rendelesAdat = {
      felhasznaloId,
      tetelek,
      cim,
      osszeg,
      fizetesiMod: "Készpénz",
      fizetve: false,
      datum: new Date(Date.now()),
    };

    const ujRendeles = new RendelesModel(rendelesAdat);
    await ujRendeles.save();

    for (const tetel of rendelesAdat.tetelek) {
      const termek = await TermekModel.findById(tetel._id);

      const meret = termek.meretek.find(
        (m) => String(m.meret) === String(tetel.meret)
      );
      if (!meret) continue;

      meret.mennyiseg = Math.max(0, meret.mennyiseg - tetel.mennyiseg);
      termek.markModified("meretek");

      await termek.save();
    }

    for (const k of felhasznalo.kuponok) {
      if (k.kupon === kupon) {
        if (k.lejaratiDatum < Date.now()) {
          return res.json({ siker: false, uzenet: "A kupon lejárt!" });
        }
        const index = felhasznalo.kuponok.findIndex((k) => k.kupon === kupon);
        if (index !== -1) felhasznalo.kuponok.splice(index, 1);
        felhasznalo.markModified("kuponok");
        break;
      }
    }

    felhasznalo.kosarAdatok = {};
    await felhasznalo.save();

    const emailUzenetTartalom = {
      to: felhasznalo.email,
      subject: "Rendelés megerősítés - Sneaky Shoes",
      text: `Rendelés szám: ${ujRendeles._id}. Az összeg: ${osszeg} Ft. Köszönjük a vásárlást!`,
      html: RENDELES_HTML(ujRendeles._id, felhasznalo.nev, tetelek, osszeg),
    };
    await kuldEmail.sendMail(emailUzenetTartalom);

    res.json({ siker: true, uzenet: "Rendelés leadva!" });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const rendelesStripe = async (req, res) => {
  try {
    const { felhasznaloId, tetelek, osszeg, cim, kupon, kuponKedvezmeny } =
      req.body;
    const { origin } = req.headers;

    const rendelesAdat = {
      felhasznaloId,
      tetelek,
      cim,
      osszeg,
      fizetesiMod: "Stripe",
      fizetve: false,
      datum: new Date(Date.now()),
    };

    const ujRendeles = new RendelesModel(rendelesAdat);
    await ujRendeles.save();

    const sorTetelek = tetelek.map((tetel) => ({
      price_data: {
        currency: penznem,
        product_data: { name: tetel.nev },
        unit_amount: tetel.ar * 100,
      },
      quantity: tetel.mennyiseg,
    }));

    sorTetelek.push({
      price_data: {
        currency: penznem,
        product_data: { name: "Szállítási költség" },
        unit_amount: szallitasiDij * 100,
      },
      quantity: 1,
    });

    const session = await stripe.checkout.sessions.create({
      success_url: `${origin}/hitelesites?siker=true&rendelesId=${ujRendeles._id}&kupon=${kupon}`,
      cancel_url: `${origin}/hitelesites?siker=false&rendelesId=${ujRendeles._id}&kupon=${kupon}`,
      line_items: sorTetelek,
      mode: "payment",
    });

    res.json({ siker: true, session_url: session.url });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const stripeEllenorzes = async (req, res) => {
  const { rendelesId, siker, felhasznaloId, kupon } = req.body;
  try {
    if (siker === "true") {
      await RendelesModel.findByIdAndUpdate(rendelesId, { fizetve: true });
      await FelhasznaloModel.findByIdAndUpdate(felhasznaloId, {
        kosarAdatok: {},
      });

      const rendelesAdat = await RendelesModel.findById(rendelesId);

      for (const tetel of rendelesAdat.tetelek) {
        await TermekModel.updateOne(
          {
            _id: tetel._id,
            "meretek.meret": tetel.meret,
          },
          {
            $inc: {
              "meretek.$.mennyiseg": -tetel.mennyiseg,
            },
          }
        );
      }

      const felhasznalo = await FelhasznaloModel.findById(felhasznaloId);
      for (const k of felhasznalo.kuponok) {
        if (k.kupon === kupon) {
          if (k.lejaratiDatum < Date.now()) {
            await RendelesModel.findByIdAndDelete(rendelesId);
            return res.json({ siker: false, uzenet: "A kupon lejárt!" });
          }
          const index = felhasznalo.kuponok.findIndex((k) => k.kupon === kupon);
          if (index !== -1) felhasznalo.kuponok.splice(index, 1);
          felhasznalo.markModified("kuponok");
          break;
        }
      }

      felhasznalo.kosarAdatok = {};
      await felhasznalo.save();

      const emailUzenetTartalom = {
        to: felhasznalo.email,
        subject: "Rendelés megerősítés - Sneaky Shoes",
        text: `Rendelés szám: ${rendelesId}. Az összeg: ${rendelesAdat.osszeg} Ft. Köszönjük a vásárlást!`,
        html: RENDELES_HTML(
          rendelesId,
          felhasznalo.nev,
          rendelesAdat.tetelek,
          rendelesAdat.osszeg
        ),
      };
      await kuldEmail.sendMail(emailUzenetTartalom);

      res.json({ siker: true });
    } else {
      await RendelesModel.findByIdAndDelete(rendelesId);
      res.json({ siker: false, uzenet: "A fizetés nem sikerült!" });
    }
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const osszesRendeles = async (req, res) => {
  try {
    const rendelesek = await RendelesModel.find({});
    res.json({ siker: true, rendelesek });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const felhasznaloRendelesek = async (req, res) => {
  try {
    const { felhasznaloId } = req.body;
    if (!felhasznaloId) {
      return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
    }
    const rendelesek = await RendelesModel.find({ felhasznaloId });
    res.json({ siker: true, rendelesek });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const rendelesStatuszFrissites = async (req, res) => {
  try {
    const { rendelesId, allapot } = req.body;
    const rendeles = await RendelesModel.findByIdAndUpdate(rendelesId, {
      allapot,
    });

    const felhasznalo = await FelhasznaloModel.findById(rendeles.felhasznaloId);

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Felhasználó nem található!" });
    }

    let emailUzenetTartalom = null;

    if (allapot === "Csomag elküldve") {
      emailUzenetTartalom = {
        to: felhasznalo.email,
        subject: "Csomag elküldve - Sneaky Shoes",
        text: `A rendelésed (#${rendelesId}) elküldésre került!`,
        html: SZALLITAS_KULDES_HTML(rendelesId, felhasznalo.nev),
      };
    } else if (allapot === "Kiszállítás alatt") {
      emailUzenetTartalom = {
        to: felhasznalo.email,
        subject: "Csomagod kiszállítás alatt van - Sneaky Shoes",
        text: `A rendelésed (#${rendelesId}) kiszállítás alatt van!`,
        html: SZALLITAS_FOLYAMAT_HTML(rendelesId, felhasznalo.nev),
      };
    } else if (allapot === "Kiszállítva") {
      emailUzenetTartalom = {
        to: felhasznalo.email,
        subject: "Csomag kézbesítve - Sneaky Shoes",
        text: `A rendelésed (#${rendelesId}) kézbesítve lett!`,
        html: SZALLITAS_KESZULT_HTML(rendelesId, felhasznalo.nev),
      };
    }

    if (emailUzenetTartalom) {
      await kuldEmail.sendMail(emailUzenetTartalom);
    }

    res.json({ siker: true, uzenet: "Státusz módosítva!" });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const rendelesTorles = async (req, res) => {
  try {
    const { rendelesId } = req.body;
    await RendelesModel.findByIdAndDelete(rendelesId);
    res.json({ siker: true, uzenet: "Rendelés törölve!" });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const fizetesFrissites = async (req, res) => {
  try {
    const { rendelesId, fizetve } = req.body;
    await RendelesModel.findByIdAndUpdate(rendelesId, { fizetve });
    res.json({ siker: true, uzenet: "Fizetés állapota frissítve!" });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const egyRendelesElemei = async (req, res) => {
  try {
    const { rendelesId } = req.body;
    const rendeles = await RendelesModel.findById(rendelesId);
    res.json({ siker: true, rendeles });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

export {
  rendelesKeszpenz,
  rendelesStripe,
  stripeEllenorzes,
  osszesRendeles,
  felhasznaloRendelesek,
  rendelesStatuszFrissites,
  rendelesTorles,
  fizetesFrissites,
  egyRendelesElemei,
};
