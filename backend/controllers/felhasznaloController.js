import felhasznaloModel from "../models/felhasznaloModel.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import kuldEmail from "../config/nodemailer.js";
import { WELCOME_HTML, OTP_HTML, KUPON_HTML } from "../config/emailMintak.js";
import feliratkozoModel from "../models/feliratkozoModel.js";
import passport from "passport";

const adminBelepes = async (req, res) => {
  try {
    const { email, jelszo } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      jelszo === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + jelszo, process.env.JWT_SECRET);

      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      res.json({ siker: true });
    } else {
      res.json({ siker: false, uzenet: "Rossz adatok!" });
    }
  } catch (hiba) {
    console.log(hiba);
    res.json({ siker: false, uzenet: hiba });
  }
};

const adminHitelesitve = async (req, res) => {
  try {
    return res.json({ siker: true });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const felhasznaloAdatok = async (req, res) => {
  try {
    const { felhasznaloId } = req.body;

    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
    }

    res.json({
      siker: true,
      felhasznaloAdat: {
        _id: felhasznalo._id,
        nev: felhasznalo.nev,
        email: felhasznalo.email,
        fiokEllenorizve: felhasznalo.fiokEllenorizve,
        cim: felhasznalo.cim,
        ketlepcsosHitelesites: felhasznalo.ketlepcsosHitelesites,
        kosarAdatok: felhasznalo.kosarAdatok,
      },
    });
  } catch (hiba) {
    res.json({ siker: false, uzenet: hiba.message });
  }
};

const adminKilepes = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ siker: true, uzenet: "Kijelentkezve" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const profilFrissites = async (req, res) => {
  const {
    felhasznaloId,
    nev,
    email,
    regiJelszo,
    ujJelszo,
    cim,
    ketlepcsosHitelesites,
  } = req.body;

  if (!felhasznaloId) {
    return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
  }
  const emailEllenorzes = await felhasznaloModel.findOne({ email });
  const felhasznalo = await felhasznaloModel.findById(felhasznaloId);

  if (!emailEllenorzes || felhasznalo._id.equals(emailEllenorzes._id)) {
    try {
      if (felhasznalo) {
        if (email) {
          if (!validator.isEmail(email)) {
            return res.json({
              siker: false,
              uzenet: "Érvénytelen email cím!",
            });
          }
        }
        felhasznalo.nev = nev || felhasznalo.nev;
        if (felhasznalo.email === email || !email) {
          felhasznalo.email = felhasznalo.email;
          felhasznalo.ketlepcsosHitelesites = ketlepcsosHitelesites;
        } else {
          felhasznalo.email = email;
          felhasznalo.ketlepcsosHitelesites = false;
          felhasznalo.fiokEllenorizve = false;
        }

        if (regiJelszo !== "" && ujJelszo !== "" && ujJelszo.length >= 8) {
          const egyezik = await bcrypt.compare(regiJelszo, felhasznalo.jelszo);

          if (egyezik) {
            felhasznalo.jelszo = await bcrypt.hash(ujJelszo, 10);
          } else {
            return res.json({
              siker: false,
              uzenet: "Hibásan megadott régi jelszó!",
            });
          }
        }

        if (cim) {
          felhasznalo.cim.push(cim);
        }
      }
      await felhasznalo.save();
      return res.json({
        siker: true,
        uzenet: "Az adatok sikeresen frissültek!",
      });
    } catch (hiba) {
      return res.json({ siker: false, uzenet: hiba.message });
    }
  } else {
    return res.json({
      siker: false,
      uzenet: "A megadott email cím már használatban van!",
    });
  }
};

const cimTorles = async (req, res) => {
  const { felhasznaloId, index } = req.body;

  if (!felhasznaloId) {
    return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
  }

  try {
    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Felhasználó nem található!" });
    }

    if (index < 0 || index >= felhasznalo.cim.length) {
      return res.json({ siker: false, uzenet: "Rossz cím adatok!" });
    }

    felhasznalo.cim.splice(index, 1);
    await felhasznalo.save();

    return res.json({ siker: true, uzenet: "A cím sikeresen törölve!" });
  } catch (hiba) {
    console.error(hiba);
    return res.json({ siker: false, uzenet: hiba.message });
  }
};
const regisztracio = async (req, res) => {
  const { nev, email, jelszo } = req.body;

  if (!nev) {
    return res.json({ siker: false, uzenet: "Hiányzik a név!" });
  }
  if (!email) {
    return res.json({ siker: false, uzenet: "Hiányzik az email cím!" });
  }
  if (!jelszo) {
    return res.json({ siker: false, uzenet: "Hiányzik a jelszó!" });
  }
  if (jelszo.length < 8) {
    return res.json({
      siker: false,
      uzenet: "A jelszónak legalább 8 karakteresnek kell lennie!",
    });
  }

  try {
    const letezoFelhasznalo = await felhasznaloModel.findOne({ email });

    if (letezoFelhasznalo) {
      return res.json({ siker: false, uzenet: "A felhasználó már létezik!" });
    }

    const titkositottJelszo = await bcrypt.hash(jelszo, 10);

    const ujFelhasznalo = new felhasznaloModel({
      nev,
      email,
      jelszo: titkositottJelszo,
    });

    await ujFelhasznalo.save();

    const token = jwt.sign({ id: ujFelhasznalo._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    const emailUzenetTartalom = {
      to: email,
      subject: "Üdvözöljük a weboldalon!",
      html: WELCOME_HTML(nev),
    };

    await kuldEmail.sendMail(emailUzenetTartalom);

    return res.json({ siker: true });
  } catch (hiba) {
    res.json({ siker: false, uzenet: hiba.message });
  }
};

const belepes = async (req, res) => {
  const { email, jelszo } = req.body;

  if (!email) {
    return res.json({ siker: false, uzenet: "Hiányzik az email cím!" });
  }
  if (!jelszo) {
    return res.json({ siker: false, uzenet: "Hiányzik a jelszó!" });
  }
  if (jelszo.length < 8) {
      return res.json({ siker: false, uzenet: "Legalább 8 karakterhosszúságú jelszó szükséges!" });
    }

  try {
    const felhasznalo = await felhasznaloModel.findOne({ email });

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Helytelen email cím!" });
    }
    if (felhasznalo.google) {
      return res.json({ siker: false, uzenet: "Helytelen email cím!" });
    }

    const egyezik = await bcrypt.compare(jelszo, felhasznalo.jelszo);

    if (!egyezik) {
      return res.json({ siker: false, uzenet: "Helytelen jelszó!" });
    }

    if (felhasznalo.ketlepcsosHitelesites) {
      const otp = String(Math.floor(100000 + Math.random() * 900000));

      felhasznalo.ellenorzoOtp = otp;
      felhasznalo.ellenorzoOtpLejar = Date.now() + 15 * 60 * 1000;

      await felhasznalo.save();

      const emailUzenetTartalom = {
        to: felhasznalo.email,
        subject: "Kétlépcsős hitelesítés",
        html: OTP_HTML(otp, "Kétlépcsős hitelesítés"),
      };

      await kuldEmail.sendMail(emailUzenetTartalom);

      return res.json({
        siker: true,
        ketlepcsos: true,
        felhasznaloId: felhasznalo._id,
        kocsi: felhasznalo.kosarAdatok,
      });
    }

    const token = jwt.sign({ id: felhasznalo._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      siker: true,
      felhasznaloId: felhasznalo._id,
      ketlepcsos: felhasznalo.ketlepcsosHitelesites,
      kocsi: felhasznalo.kosarAdatok,
    });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const kilepes = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });

    return res.json({ siker: true, uzenet: "Kijelentkezve!" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const ellenorzoOtpKuldes = async (req, res) => {
  try {
    const { felhasznaloId } = req.body;

    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);

    if (felhasznalo.fiokEllenorizve) {
      return res.json({ siker: false, uzenet: "A fiók már hitelesítve van!" });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    felhasznalo.ellenorzoOtp = otp;
    felhasznalo.ellenorzoOtpLejar = Date.now() + 15 * 60 * 1000;

    await felhasznalo.save();

    const emailUzenetTartalom = {
      to: felhasznalo.email,
      subject: "Fiók hitelesítése",
      html: OTP_HTML(otp, "Fiók hitelesítése"),
    };

    await kuldEmail.sendMail(emailUzenetTartalom);

    res.json({ siker: true, uzenet: "Hitelesítő email elküldve!" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const emailEllenorzes = async (req, res) => {
  const { felhasznaloId, otp } = req.body;

  if (!felhasznaloId) {
    return res.json({ siker: false, uzenet: "A felhasználó nem létezik!" });
  }
  if (!otp) {
    return res.json({ siker: false, uzenet: "Nincs hitelesítő kód!" });
  }

  try {
    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "A felhasználó nem létezik!" });
    }
    if (felhasznalo.ellenorzoOtp === "" || felhasznalo.ellenorzoOtp !== otp) {
      return res.json({ siker: false, uzenet: "Helytelen hitelesítő kód!" });
    }
    if (felhasznalo.ellenorzoOtpLejar < Date.now()) {
      return res.json({ siker: false, uzenet: "A hitelesítő kód lejárt!" });
    }

    felhasznalo.fiokEllenorizve = true;
    felhasznalo.ellenorzoOtp = "";
    felhasznalo.ellenorzoOtpLejar = 0;

    await felhasznalo.save();

    return res.json({ siker: true, uzenet: "Sikeres hitelesítés!" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const hitelesitve = async (req, res) => {
  try {
    return res.json({ siker: true });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};
const jelszoVisszaallitasOtpKuldes = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.json({
        siker: false,
        uzenet: "Kérjük, adja meg az email címet!",
      });
    }

    const felhasznalo = await felhasznaloModel.findOne({ email });

    if (!felhasznalo) {
      return res.json({
        siker: false,
        uzenet: "Nem található felhasználó ezzel az email címmel!",
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    felhasznalo.jelszoVisszaallitasOtp = otp;
    felhasznalo.jelszoVisszaallitasOtpLejar = Date.now() + 15 * 60 * 1000;

    await felhasznalo.save();

    const emailUzenetTartalom = {
      to: email,
      subject: "Jelszó visszaállítás",
      html: OTP_HTML(otp, "Jelszó visszaállítás"),
    };

    await kuldEmail.sendMail(emailUzenetTartalom);

    return res.json({
      siker: true,
      uzenet: "Visszaállító kód elküldve az email címre!",
    });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const otpEllenorzes = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const felhasznalo = await felhasznaloModel.findOne({ email });

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "A felhasználó nem található!" });
    }

    if (
      felhasznalo.jelszoVisszaallitasOtp === otp &&
      felhasznalo.jelszoVisszaallitasOtpLejar > Date.now()
    ) {
      return res.json({ siker: true, uzenet: "Érvényes kód!" });
    }

    return res.json({ siker: false, uzenet: "Hibás vagy lejárt kód!" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const jelszoVisszaallitas = async (req, res) => {
  try {
    const { email, ujJelszo } = req.body;

    if (!email || !ujJelszo) {
      return res.json({ siker: false, uzenet: "Hiányzó adatok!" });
    }
    if (ujJelszo.length < 8) {
      return res.json({ siker: false, uzenet: "Legalább 8 karakterhosszúságú jelszó kell!" });
    }

    const felhasznalo = await felhasznaloModel.findOne({ email });

    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Felhasználó nem található!" });
    }

    const titkositottJelszo = await bcrypt.hash(ujJelszo, 10);

    felhasznalo.jelszo = titkositottJelszo;
    felhasznalo.jelszoVisszaallitasOtp = "";
    felhasznalo.jelszoVisszaallitasOtpLejar = 0;

    await felhasznalo.save();

    return res.json({ siker: true, uzenet: "A jelszó sikeresen frissítve!" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const kuponEllenorzes = async (req, res) => {
  try {
    const { felhasznaloId, kuponKod } = req.body;

    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);
    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Felhasználó nem található!" });
    }

    const talaltKupon = (felhasznalo.kuponok || []).find(
      (k) => String(k.kupon).trim() === String(kuponKod).trim()
    );

    if (talaltKupon) {
      const lejarTimestamp = talaltKupon.lejarat
        ? new Date(talaltKupon.lejarat).getTime()
        : talaltKupon.lejaratiDatum
        ? new Date(talaltKupon.lejaratiDatum).getTime()
        : 0;

      if (lejarTimestamp > Date.now()) {
        return res.json({ siker: true, kedvezmeny: talaltKupon.kedvezmeny });
      }

      return res.json({ siker: false, uzenet: "A kupon lejárt" });
    }

    return res.json({ siker: false, uzenet: "Kupon nem található!" });
  } catch (hiba) {
    return res.json({ siker: false, uzenet: hiba.message });
  }
};

const kuponKuldes = async (req, res) => {
  const { kuponKod, lejarat, uzenet, celcsoport, kedvezmeny } = req.body;
  if (!kuponKod) {
    return res.json({ siker: false, uzenet: "Nincs ilyen kupon!" });
  }
  if (!lejarat) {
    return res.json({ siker: false, uzenet: "A kupon lejárt!" });
  }
  if (!uzenet) {
    return res.json({ siker: false, uzenet: "Nincs küldendő üzenet!" });
  }
  if (!celcsoport) {
    return res.json({ siker: false, uzenet: "Nincs megadva célszemélye" });
  }
  try {
    let felhasznalok = [];
    if (celcsoport === "feliratkozok") {
      const feliratkozoFelhasznalok = await feliratkozoModel.find();
      const felhasznoloIdk = [
        ...new Set(
          feliratkozoFelhasznalok.map((feliratkozo) =>
            String(feliratkozo.felhasznaloId)
          )
        ),
      ];
      felhasznalok = await felhasznaloModel.find({
        _id: { $in: felhasznoloIdk },
      });
    } else if (celcsoport === "mindenki") {
      felhasznalok = await felhasznaloModel.find();
    } else {
      return res.json({ siker: false, uzenet: "Érvénytelen cészemélyek!" });
    }

    const lejaratiDatum = new Date(lejarat);
    if (isNaN(lejaratiDatum.getTime())) {
      return res.json({
        siker: false,
        uzenet: "Érvénytelen lejárati dátum!",
      });
    }

    for (const felhasznalo of felhasznalok) {
      const alreadyHasCoupon = felhasznalo.kuponok.some(
        (c) => c.kupon === kuponKod
      );
      if (alreadyHasCoupon) {
        return res.json({
          siker: false,
          uzenet: "Már létezik ilyen nevű kupon!",
        });
      }
    }
    for (const felhasznalo of felhasznalok) {
      felhasznalo.kuponok.push({
        kupon: kuponKod,
        kedvezmeny: kedvezmeny,
        lejarat: new Date(lejaratiDatum),
      });
      felhasznalo.markModified("kuponok");
      await felhasznalo.save();

      const emailElkuldes = {
        to: felhasznalo.email,
        subject: "Új kupon érhető el!",
        html: KUPON_HTML(uzenet, kuponKod, lejaratiDatum.toLocaleDateString()),
      };
      await kuldEmail.sendMail(emailElkuldes);
    }

    return res.json({ siker: true, uzenet: "Kuponok sikeresen elküldve!" });
  } catch (error) {
    console.error(error);
    return res.json({ siker: false, uzenet: error.message });
  }
};

const otpEllenorzesKetlepcsos = async (req, res) => {
  try {
    const { otp, felhasznaloId } = req.body;

    if (!felhasznaloId) {
      return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
    }
    if (!otp) {
      return res.json({ siker: false, uzenet: "Hiányzó hitelesítő kód!" });
    }

    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);
    if (!felhasznalo) {
      return res.json({
        siker: false,
        uzenet: "Felhasználó nem található!",
      });
    }

    if (!felhasznalo.ellenorzoOtp || felhasznalo.ellenorzoOtp !== otp) {
      return res.json({ siker: false, uzenet: "Helytelen hitelesítő kód!" });
    }

    const lejar = felhasznalo.ellenorzoOtpLejar
      ? new Date(felhasznalo.ellenorzoOtpLejar).getTime()
      : 0;
    if (lejar < Date.now()) {
      return res.json({ siker: false, uzenet: "Lejárt a hitelesítő kód!" });
    }

    const token = jwt.sign({ id: felhasznalo._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      siker: true,
      uzenet: "Sikeres bejelentkezés",
      felhasznaloId: felhasznalo._id,
      kocsi: felhasznalo.kosarAdatok,
    });
  } catch (error) {
    return res.json({ siker: false, uzenet: error.message });
  }
};

const googleBelepes = passport.authenticate("google", {
  scope: ["profile", "email"],
  prompt: "select_account",
  session: false,
});

const googleCallback = async (req, res, next) => {
  passport.authenticate(
    "google",
    { session: false },
    async (err, felhasznalo) => {
      if (err || !felhasznalo) {
        console.error("Google bejelentkezés hiba:", err);
        return res.redirect(
          `${process.env.FRONTEND_URL}/bejelentkezes?hiba=google`
        );
      }

      try {
        const token = jwt.sign(
          { id: felhasznalo._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "7d",
          }
        );

        res.cookie("token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        if (felhasznalo.ketlepcsosHitelesites) {
          const otp = String(Math.floor(100000 + Math.random() * 900000));

          felhasznalo.ellenorzoOtp = otp;
          felhasznalo.ellenorzoOtpLejar = Date.now() + 15 * 60 * 1000;

          await felhasznalo.save();

          const emailUzenetTartalom = {
            to: felhasznalo.email,
            subject: "Kétlépcsős hitelesítés",
            text: `Az Ön kódja: ${otp}`,
            html: OTP_HTML(otp, "Kétlépcsős hitelesítés"),
          };

          await kuldEmail.sendMail(emailUzenetTartalom);
        }

        return res.redirect(
          `${process.env.FRONTEND_URL}/bejelentkezes?google_siker=true`
        );
      } catch (hiba) {
        console.error("Google callback hiba:", hiba);
        return res.redirect(
          `${process.env.FRONTEND_URL}/bejelentkezes?hiba=szerver`
        );
      }
    }
  )(req, res, next);
};

export {
  adminBelepes,
  adminHitelesitve,
  felhasznaloAdatok,
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
  googleCallback,
  googleBelepes,
};
