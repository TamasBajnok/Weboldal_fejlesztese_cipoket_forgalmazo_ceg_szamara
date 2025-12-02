import mongoose from "mongoose";

const felhasznaloSchema = new mongoose.Schema(
  {
    nev: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    jelszo: { type: String, required: true },
    kosarAdatok: { type: Object, default: {} },
    ellenorzoOtp: { type: String, default: "" },
    ellenorzoOtpLejar: { type: Date, default: 0 },
    fiokEllenorizve: { type: Boolean, default: false },
    jelszoVisszaallitasOtp: { type: String, default: "" },
    jelszoVisszaallitasOtpLejar: { type: Date, default: 0 },
    telefon: { type: String, default: "" },
    cim: { type: Array, default: [] },
    kuponok: { type: Array, default: [] },
    ketlepcsosHitelesites: { type: Boolean, default: false },
    google: {type: Boolean, default: false}
  },
  { minimize: false }
);

const felhasznaloModel = mongoose.models.felhasznalo || mongoose.model("felhasznalok", felhasznaloSchema);

export default felhasznaloModel;
