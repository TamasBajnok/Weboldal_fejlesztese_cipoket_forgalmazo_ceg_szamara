import passport from "passport";
import felhasznaloModel from "../models/felhasznaloModel.js";
import jwt from "jsonwebtoken";
import kuldEmail from "./nodemailer.js";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: false,
    },
    
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        let felhasznalo = await felhasznaloModel.findOne({ email });

        if (!felhasznalo) {
          felhasznalo = await felhasznaloModel.create({
            nev: profile.displayName,
            email,
            jelszo: "12345678",
            google: true
          });
           const emailUzenetTartalom = {
                to: email,
                subject: "Üdvözöljük a weboldalon",
                text: `Üdvözöljük a Sneaky Shoes oldalán, a regisztrációja sikeres volt!`,
              };
          
            await kuldEmail.sendMail(emailUzenetTartalom);
        }
        return done(null, felhasznalo);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
