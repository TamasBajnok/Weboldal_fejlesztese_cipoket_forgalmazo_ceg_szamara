import FelhasznaloModel from "../models/felhasznaloModel.js";
import TermekModel from "../models/termekModel.js";

const kosarhozAdas = async (req, res) => {
  try {
    const { felhasznaloId, termekId, meret } = req.body;

    const felhasznaloAdat = await FelhasznaloModel.findById(felhasznaloId);
    let kosarAdatok = felhasznaloAdat.kosarAdatok;
    if (typeof kosarAdatok === "string") {
      try {
        kosarAdatok = JSON.parse(kosarAdatok);
      } catch (err) {
        kosarAdatok = {}; 
      }
    }

    if (typeof kosarAdatok !== "object" || kosarAdatok === null) {
      kosarAdatok = {};
    }

    if (kosarAdatok[termekId]) {
      if (kosarAdatok[termekId][meret]) {
        kosarAdatok[termekId][meret] += 1;
      } else {
        kosarAdatok[termekId][meret] = 1;
      }
    } else {
      kosarAdatok[termekId] = {};
      kosarAdatok[termekId][meret] = 1;
    }

    await FelhasznaloModel.findByIdAndUpdate(felhasznaloId, { kosarAdatok });

    res.json({ siker: true, uzenet: "Kosárhoz hozzáadva!" });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const kosarFrissites = async (req, res) => {
  try {
    const { felhasznaloId, termekId, meret, mennyiseg } = req.body;

    const felhasznaloAdat = await FelhasznaloModel.findById(felhasznaloId);
    let kosarAdatok = felhasznaloAdat.kosarAdatok;

    kosarAdatok[termekId][meret] = mennyiseg;

    await FelhasznaloModel.findByIdAndUpdate(felhasznaloId, { kosarAdatok });

    res.json({ siker: true, uzenet: "Kosár módosítva!" });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const kosarLekeres = async (req, res) => {
  try {
    const { felhasznaloId } = req.body;

    const felhasznaloAdat = await FelhasznaloModel.findById(felhasznaloId);
    let kosarAdatok = felhasznaloAdat.kosarAdatok;

    res.json({ siker: true, kosarAdatok });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, message: error.message });
  }
};

const kosarTorles = async (req, res) => {
  try {
    const { felhasznaloId, termekIdLista } = req.body;
    const felhasznaloAdat = await FelhasznaloModel.findById(felhasznaloId);
    let kosarAdatok = felhasznaloAdat.kosarAdatok;
    let toroltTermekek = [];
    for (const termekId of termekIdLista) {
      const termekLetezik = await TermekModel.findById(termekId);
      if (!termekLetezik) {
        delete kosarAdatok[termekId];
        toroltTermekek.push(termekId);
      }
    }
    await FelhasznaloModel.findByIdAndUpdate(felhasznaloId, { kosarAdatok });
    res.json({
      siker: true,
      kosarAdatok,
      uzenet:
        toroltTermekek.length > 0
          ? "Néhány termék már nem elérhető, ezért töröltük a kosárból."
          : undefined,
    });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

const kocsiAtvitele = async (req, res) => {
  try {
    const { felhasznaloId, opcio, kosarElemek } = req.body;
    const felhasznaloAdat = await FelhasznaloModel.findById(felhasznaloId);
    if (!felhasznaloAdat) {
      return res.json({ siker: false, uzenet: "A felhasználó emm létezik." });
    }
    let kosarAdatok = felhasznaloAdat.kosarAdatok;
    if (opcio === "felulir") {
      kosarAdatok = kosarElemek;
    } else if (opcio === "kiegeszit") {
      for (const termekId in kosarElemek) {
        if (!kosarAdatok[termekId]) {
          kosarAdatok[termekId] = kosarElemek[termekId];
        } else {
          for (const meret in kosarElemek[termekId]) {
            if (kosarAdatok[termekId][meret]) {
              kosarAdatok[termekId][meret] += kosarElemek[termekId][meret];
            } else {
              kosarAdatok[termekId][meret] = kosarElemek[termekId][meret];
            }
          }
        }
      }
    } else if (opcio === "elvet") {
    } else {
      return res.json({ siker: false, uzenet: "Nincs iylen opció." });
    }
    await FelhasznaloModel.findByIdAndUpdate(felhasznaloId, { kosarAdatok });
    res.json({
      siker: true,
      uzenet: "A kosár sikeresen frissítve lett.",
    });
  } catch (error) {
    console.error(error);
    res.json({ siker: false, uzenet: error.message });
  }
};

export {
  kosarhozAdas,
  kosarFrissites,
  kosarLekeres,
  kosarTorles,
  kocsiAtvitele,
};
