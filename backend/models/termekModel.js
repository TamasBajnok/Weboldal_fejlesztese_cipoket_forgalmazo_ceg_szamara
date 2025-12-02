import mongoose from "mongoose";

const termekSchema = new mongoose.Schema(
  {
    nev: { type: String, required: true },
    leiras: { type: String, required: true },
    ar: { type: Number, required: true },
    kepek: { type: Array, required: true },
    kategoria: { type: String, required: true },
    marka: { type: String, required: true },
    tipus: { type: String, required: true },
    szin: { type: String, required: true },
    meretek: { type: Array, required: true },
    datum: { type: Date, required: true },
    velemenyekSzama: { type: Number, default: 0 },
    velemenyek: { type: Array, default: [] },
    akcios: { type: Boolean, default: false },
    akciosAr: { type: Number, default: 0 },
    akcioKezdet: { type: Date, default: null },
    akcioVege: { type: Date, default: null },
    pozicio: { type: Number, required: true },
  },
  { minimize: false }
);

const termekModel =
  mongoose.models.termek || mongoose.model("termekek", termekSchema);

export default termekModel;
