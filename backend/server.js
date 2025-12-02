import express from "express";
import cors from "cors";
import "dotenv/config";
import mongodbCsatlakozás from "./config/mongodb.js";
import cloudinaryCsatlakozas from "./config/cloudniary.js";
import felhasznaloRouter from "./routes/felhasznaloRoute.js";
import kosarRouter from "./routes/kosarRoute.js";
import termekRouter from "./routes/termekRoute.js";
import rendelesRouter from "./routes/rendelesRoute.js";
import feliratkozoRouter from "./routes/feliratkozoRoute.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import "./config/passport.js";


const app = express();
const port = 4000;
mongodbCsatlakozás();
cloudinaryCsatlakozas();



app.use(express.json());

const szabadCimek = ["http://localhost:5173", "http://localhost:5174"];
app.use(cookieParser());
app.use(cors({ origin: szabadCimek, credentials: true })); 

app.use(passport.initialize());



app.use("/api/felhasznalo", felhasznaloRouter);
app.use("/api/termek", termekRouter);
app.use("/api/kocsi", kosarRouter);
app.use("/api/rendeles", rendelesRouter);
app.use("/api/feliratkozo", feliratkozoRouter);

app.listen(port);
