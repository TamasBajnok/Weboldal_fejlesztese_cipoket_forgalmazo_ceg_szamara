import mongoose from "mongoose";

const feliratkozoSchema = new mongoose.Schema({
  felhasznaloId: { type: String, required: true },
  email: { type: String, required: true },
  letrehozva: { type: Date, required: true },
});

const feliratkozoModel = mongoose.models.feliratkozo || mongoose.model("feliratkozok", feliratkozoSchema);

export default feliratkozoModel;
