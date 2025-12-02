import { v2 as cloudinary } from "cloudinary";
import termekModel from "../models/termekModel.js";
import felhasznaloModel from "../models/felhasznaloModel.js";

const termekHozzaadas = async (req, res) => {
  try {
    const nev = req.body.nev;
    const leiras = req.body.leiras;
    const ar = req.body.ar;
    const kategoria = req.body.kategoria;
    const tipus = req.body.tipus;
    const meretek = req.body.meretek;
    const marka = req.body.marka;
    const szin = req.body.szin;

    const kep1 = req.files?.kep1?.[0] || null;
    const kep2 = req.files?.kep2?.[0] || null;
    const kep3 = req.files?.kep3?.[0] || null;
    const kep4 = req.files?.kep4?.[0] || null;
    const kep5 = req.files?.kep5?.[0] || null;
    const kep6 = req.files?.kep6?.[0] || null;
    const kep7 = req.files?.kep7?.[0] || null;
    const kep8 = req.files?.kep8?.[0] || null;

    const kepekFajlok = [kep1, kep2, kep3, kep4, kep5, kep6, kep7, kep8].filter(
      (elem) => elem !== null && elem !== undefined
    );

    let kepekUrl = [];
    if (kepekFajlok.length > 0) {
      kepekUrl = await Promise.all(
        kepekFajlok.map(async (elem) => {
          const result = await cloudinary.uploader.upload(elem.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
    }
    
    const elemez = meretek ? JSON.parse(meretek) : {};
    const meretLista = Object.entries(elemez).map(([meret, mennyiseg]) => ({
      meret,
      mennyiseg: Number(mennyiseg),
    }));

    const termekDarabszam = await termekModel.countDocuments({});
    const termekAdat = {
      nev,
      leiras,
      ar: Number(ar),
      kepek: kepekUrl,
      kategoria,
      marka,
      szin,
      tipus,
      meretek: meretLista,
      datum: new Date(Date.now()),
      pozicio: termekDarabszam + 1,
    };

    const termek = new termekModel(termekAdat);
    await termek.save();

    res.json({ siker: true, uzenet: "Termék hozzáadva!" });
  } catch (error) {
    console.log(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const termekLista = async (req, res) => {
  try {
    const termekek = await termekModel.find({});
    res.json({ siker: true, termekek });
  } catch (error) {
    console.log(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const termekTorles = async (req, res) => {
  try {
    const { termekId } = req.body;
    await termekModel.findByIdAndDelete(termekId);
    res.json({ siker: true, uzenet: "Termék törölve!" });
  } catch (error) {
    console.log(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const egyTermek = async (req, res) => {
  try {
    const termekId = req.body.termekId;
    const termek = await termekModel.findById(termekId);
    res.json({ siker: true, termek });
  } catch (error) {
    console.log(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const velemenyHozzaadas = async (req, res) => {
  try {
    const felhasznaloId = req.body.felhasznaloId;
    const ertekeles = req.body.ertekeles;
    const velemeny = req.body.velemeny;
    const termekId = req.body.termekId;

    if (!felhasznaloId) {
      return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
    }

    const felhasznalo = await felhasznaloModel.findById(felhasznaloId);
    if (!felhasznalo) {
      return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
    }

    const termek = await termekModel.findById(termekId);
    if (!termek) {
      return res.json({ siker: false, uzenet: "Ismeretlen termék!" });
    }

    const existingIndex = termek.velemenyek.findIndex((v) =>
      v.felhasznaloId && v.felhasznaloId.equals
        ? v.felhasznaloId.equals(felhasznalo._id)
        : String(v.felhasznaloId) === String(felhasznalo._id)
    );

    if (existingIndex !== -1) {
      termek.velemenyek[existingIndex].ertekeles = Number(ertekeles);
      termek.velemenyek[existingIndex].velemeny = velemeny;
      termek.velemenyek[existingIndex].nev = felhasznalo.nev;
      termek.velemenyek[existingIndex].datum = new Date(Date.now());
      termek.markModified("velemenyek");
    } else {
      termek.velemenyek.push({
        felhasznaloId: felhasznalo._id,
        nev: felhasznalo.nev,
        ertekeles: Number(ertekeles),
        velemeny,
        datum: new Date(Date.now()),
      });
    }

    termek.velemenyekSzama = termek.velemenyek.length;

    await termek.save();

    return res.json({ siker: true, uzenet: "Vélemény sikeresen mentve!" });
  } catch (err) {
    console.error(err);
    return res.json({ siker: false, uzenet: err.message });
  }
};

const velemenyTorles = async (req, res) => {
  try {
    const felhasznaloId = req.body.felhasznaloId;
    const termekId = req.body.termekId;

    if (!felhasznaloId) {
      return res.json({ siker: false, uzenet: "Nincs ilyen felhasználó!" });
    }

    const termek = await termekModel.findById(termekId);
    if (!termek) {
      return res.json({ siker: false, uzenet: "Ismeretlen termék!" });
    }

    const existingIndex = termek.velemenyek.findIndex((v) =>
      v.felhasznaloId && v.felhasznaloId.equals
        ? v.felhasznaloId.equals(felhasznaloId)
        : String(v.felhasznaloId) === String(felhasznaloId)
    );

    if (existingIndex === -1) {
      return res.json({ siker: false, uzenet: "Nincs törlendő komment!" });
    } else {
      termek.velemenyek.splice(existingIndex, 1);
      termek.markModified("velemenyek");
    }

    termek.velemenyekSzama = termek.velemenyek.length;

    await termek.save();

    return res.json({ siker: true, uzenet: "Vélemény sikeresen törölve!" });
  } catch (err) {
    console.error(err);
    return res.json({ siker: false, uzenet: err.message });
  }
};

const termekLekerdez = async (req, res) => {
  try {
    const termekId = req.body.termekId;
    if (!termekId) {
      return res.json({ siker: false, uzenet: "Nincs ilyen termék!" });
    }
    const termek = await termekModel.findById(termekId);

    return res.json({ siker: true, termek });
  } catch (err) {
    console.error(err);
    return res.json({ siker: false, uzenet: err.message });
  }
};

const termekModosit = async (req, res) => {
  try {
    const termekId = req.body.termekId;
    const nev = req.body.nev;
    const leiras = req.body.leiras;
    const ar = req.body.ar;
    const kategoria = req.body.kategoria;
    const tipus = req.body.tipus;
    const meretek = req.body.meretek;
    const marka = req.body.marka;
    const szin = req.body.szin;

    const meglevoKepek = req.body.meglevoKepek;

    const kep1 = req.files?.kep1?.[0] || null;
    const kep2 = req.files?.kep2?.[0] || null;
    const kep3 = req.files?.kep3?.[0] || null;
    const kep4 = req.files?.kep4?.[0] || null;
    const kep5 = req.files?.kep5?.[0] || null;
    const kep6 = req.files?.kep6?.[0] || null;
    const kep7 = req.files?.kep7?.[0] || null;
    const kep8 = req.files?.kep8?.[0] || null;

    let elemezMeglevo = [];
    if (meglevoKepek) {
      try {
        const tmp = JSON.parse(meglevoKepek);
        if (Array.isArray(tmp)) elemezMeglevo = tmp.slice();
      } catch (e) {
        elemezMeglevo = [];
      }
    }

    const kepek = [];
    const feltoltKepek = async (file) => {
      if (!file) return null;
      const result = await cloudinary.uploader.upload(file.path, {
        resource_type: "image",
      });
      return result.secure_url || null;
    };

    for (const file of [kep1, kep2, kep3, kep4, kep5, kep6, kep7, kep8]) {
      if (file) {
        const url = await feltoltKepek(file);
        if (url) kepek.push(url);
      } else if (elemezMeglevo.length > 0) {
        kepek.push(elemezMeglevo.shift());
      }
    }

    const elemez = meretek ? JSON.parse(meretek) : {}; 
    const termek = await termekModel.findById(termekId);
    if (!termek) {
      return res.json({ siker: false, uzenet: "Nincs ilyen termék!" });
    }

    termek.meretek = termek.meretek.filter((m) =>
      Object.prototype.hasOwnProperty.call(elemez, m.meret)
    );

    for (const [meret, mennyiseg] of Object.entries(elemez)) {
      const idx = termek.meretek.findIndex((m) => m.meret === meret);
      if (idx !== -1) {
        termek.meretek[idx].mennyiseg += Number(mennyiseg);
      } else {
        termek.meretek.push({ meret, mennyiseg: Number(mennyiseg) });
      }
    }

    termek.meretek.sort((a, b) => a.meret.localeCompare(b.meret));
    termek.markModified("meretek");

    termek.nev = nev;
    termek.leiras = leiras;
    termek.ar = Number(ar);
    termek.kepek = kepek;
    termek.kategoria = kategoria;
    termek.marka = marka;
    termek.szin = szin;
    termek.tipus = tipus;

    termek.datum = new Date(Date.now());

    const akcios =
      req.body.akcios !== undefined ? req.body.akcios : req.body.isDiscounted;
    const akciosAr =
      req.body.akciosAr !== undefined
        ? req.body.akciosAr
        : req.body.discountPrice;
    const akcioKezdet =
      req.body.akcioKezdet !== undefined
        ? req.body.akcioKezdet
        : req.body.discountStart;
    const akcioVege =
      req.body.akcioVege !== undefined
        ? req.body.akcioVege
        : req.body.discountEnd;

    termek.akcios = akcios === "true" || akcios === true;
    termek.akciosAr = akciosAr ? Number(akciosAr) : 0;
    termek.akcioKezdet =
      akcioKezdet === "null" || akcioKezdet === null ? null : akcioKezdet;
    termek.akcioVege =
      akcioVege === "null" || akcioVege === null ? null : akcioVege;

    await termek.save();

    res.json({ siker: true, uzenet: "Termék módosítva" });
  } catch (error) {
    console.log(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const termekSorrendFrissit = async (req, res) => {
  try {
    const poziciok = req.body.poziciok;
    if (!Array.isArray(poziciok)) {
      return res.json({
        siker: false,
        uzenet: "Hiba: helytelen adatformátum!",
      });
    }

    for (const { _id, pozicio } of poziciok) {
      await termekModel.findByIdAndUpdate(_id, { pozicio });
    }

    res.json({ siker: true, uzenet: "Sorrend frissítve!" });
  } catch (error) {
    console.log(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

export {
  termekHozzaadas,
  termekLista,
  termekTorles,
  egyTermek,
  velemenyHozzaadas,
  velemenyTorles,
  termekLekerdez,
  termekModosit,
  termekSorrendFrissit,
};
