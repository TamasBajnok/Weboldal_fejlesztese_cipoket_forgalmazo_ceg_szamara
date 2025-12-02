import mongoose from "mongoose";

const rendelesSchema = new mongoose.Schema({
  felhasznaloId: { type: String, required: true },
  tetelek: { type: Array, required: true },
  osszeg: { type: Number, required: true },
  cim: { type: Object, required: true },
  allapot: { type: String, required: true, default: "Megrendelve" },
  fizetesiMod: { type: String, required: true },
  fizetve: { type: Boolean, required: true, default: false },
  datum: { type: Date, required: true },
});

const rendelesModel =
  mongoose.models.rendeles || mongoose.model("rendelesek", rendelesSchema);

export default rendelesModel;
