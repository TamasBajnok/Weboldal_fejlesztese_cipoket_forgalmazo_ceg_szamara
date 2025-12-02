import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Bejelentkezes({ beallitasBejelentkezve }) {
  const [emailCim, setEmailCim] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [betolt, setBetolt] = useState(false);
  const navigal = useNavigate();

  const onKuldHandler = async (e) => {
    e.preventDefault();
    setBetolt(true);
    try {
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(
        backendUrl + "/api/felhasznalo/admin-belepes",
        {
          email: emailCim,
          jelszo: jelszo,
        }
      );

      if (valasz.data.siker === true) {
        beallitasBejelentkezve && beallitasBejelentkezve(true);
        navigal("/");
      } else {
        toast.error(valasz.data.uzenet || "Hiba a bejelentkezés során");
      }
    } catch (hiba) {
      console.error(hiba);
      toast.error(hiba.message || "Hálózati hiba");
    } finally {
      setBetolt(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-md overflow-hidden grid grid-cols-1 md:grid-cols-2">
        <div className="hidden md:flex flex-col items-start justify-center gap-6 p-10 bg-gradient-to-br from-indigo-600 to-violet-600 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-white/20 flex items-center justify-center text-lg font-bold">
              ADM
            </div>
            <div>
              <h3 className="text-2xl font-semibold">Admin felület</h3>
              <p className="text-sm opacity-90">
                Termékek, rendelések és kuponok kezelése
              </p>
            </div>
          </div>

          <p className="text-sm opacity-95">
            Az admin felülethez kizárólag jogosultsággal rendelkező fiókok
            férhetnek hozzá. Biztonságos bejelentkezés szükséges.
          </p>
        </div>
        <div className="p-8 md:p-10">
          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">
            Bejelentkezés
          </h1>
          <p className="text-sm text-gray-600 mb-6">
            Add meg az admin fiók adatait
          </p>

          <form onSubmit={onKuldHandler} className="space-y-4">
            <label className="block">
              <span className="text-xs text-gray-600 mb-1">Email cím</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="email"
                  value={emailCim}
                  onChange={(e) => setEmailCim(e.target.value)}
                  className="block w-full px-3 py-2 rounded-md border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400"
                  placeholder="admin@pelda.hu"
                  required
                />
              </div>
            </label>

            <label className="block">
              <span className="text-xs text-gray-600 mb-1">Jelszó</span>
              <div className="mt-1 relative rounded-md shadow-sm">
                <input
                  type="password"
                  value={jelszo}
                  onChange={(e) => setJelszo(e.target.value)}
                  className="block w-full px-3 py-2 rounded-md border border-gray-200 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 pr-10"
                  placeholder="Írd be a jelszót"
                  required
                />
              </div>
            </label>

            <button
              type="submit"
              disabled={betolt}
              className="w-full mt-2 py-2 px-4 rounded-md bg-indigo-600 text-white font-semibold hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {betolt ? "Bejelentkezés..." : "BEJELENTKEZÉS"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
