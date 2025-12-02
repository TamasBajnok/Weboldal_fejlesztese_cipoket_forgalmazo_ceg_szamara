import React, { useContext, useEffect, useMemo, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LeadottRendelesek = () => {
  const { backendUrl, felhasznaloAdat, termekek, penznem } =
    useContext(GlobalContext);
  const navigacio = useNavigate();

  const [rendelesek, setRendelesek] = useState([]);

  const oldalMeret = 5;
  const [aktualisOldal, setAktualisOldal] = useState(1);
  const rendelesAdatokBetoltes = async () => {
    try {
      axios.defaults.withCredentials = true;
      if (!felhasznaloAdat) return;

      const url = backendUrl;

      const response = await axios.post(
        `${backendUrl}/api/rendeles/felhasznalo`
      );

      if (response?.data.siker) {
        setRendelesek(response.data.rendelesek.slice().reverse());
      } else {
        console.log(response.data.uzenet);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [aktualisOldal]);

  useEffect(() => {
    rendelesAdatokBetoltes();
  }, [felhasznaloAdat]);

  useEffect(() => {
    setAktualisOldal(1);
  }, [rendelesek]);
  const osszesOldal = useMemo(
    () => Math.max(1, Math.ceil(rendelesek.length / oldalMeret)),
    [rendelesek.length]
  );

  useEffect(() => {
    setAktualisOldal((o) => Math.min(Math.max(1, o), osszesOldal));
  }, [osszesOldal]);

  const lapozottRendelesek = useMemo(() => {
    const start = (aktualisOldal - 1) * oldalMeret;
    return rendelesek.slice(start, start + oldalMeret);
  }, [rendelesek, aktualisOldal]);

  const szoritsdKozze = (ertek, min, max) =>
    Math.max(min, Math.min(max, ertek));
  const oldalraUgras = (oldal) => {
    const o = szoritsdKozze(oldal, 1, osszesOldal);
    setAktualisOldal(o);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const oldalSzamok = useMemo(() => {
    const maxKezdo = Math.max(1, osszesOldal - 4);
    const kezdo = Math.min(Math.max(1, aktualisOldal - 1), maxKezdo);
    const veg = Math.min(kezdo + 4, osszesOldal);
    const oldalak = [];
    for (let o = kezdo; o <= veg; o++) oldalak.push(o);
    return oldalak;
  }, [osszesOldal, aktualisOldal]);
  return (
    <div className="min-h-screen bg-gray-900 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-2xl text-white mb-6 flex justify-between">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-400">
              KORÁBBI{" "}
              <span className="text-white font-semibold">RENDELÉSEIM</span>
            </p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500"></p>
          </div>
          <button
            onClick={rendelesAdatokBetoltes}
            className="bg-blue-500 text-white px-4 py-2 text-sm font-medium rounded-sm hover:bg-blue-600 transition duration-200"
          >
            Szállítás nyomon követése
          </button>
        </div>

        {rendelesek.length === 0 && (
          <div className="bg-white p-6 rounded shadow">
            <p className="text-gray-700">Még nincs korábbi rendelésed.</p>
          </div>
        )}

        <div className="space-y-4">
          {lapozottRendelesek.map((rendeles) => (
            <div
              key={rendeles._id}
              className="grid grid-cols-1 gap-4 p-4 rounded bg-white border border-gray-200 md:grid-cols-[1fr_2fr_1fr] items-start"
            >
              <div>
                <p className="text-sm text-gray-500">Rendelés szám:</p>
                <p className="font-medium text-gray-800 break-words">
                  {rendeles._id}
                </p>

                <p className="mt-3 text-sm text-gray-500">Dátum</p>
                <p className="text-gray-700">
                  {new Date(rendeles.datum).toLocaleString("hu-HU")}
                </p>

                <p className="mt-3 text-sm text-gray-500">Címzett</p>
                <p className="text-gray-700">{rendeles.cim?.nev}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500">Tételek</p>
                <div className="mt-2 flex flex-wrap gap-3">
                  {rendeles.tetelek.map((tetel, i) => (
                    <div key={i} className="flex items-start gap-4 truncate">
                      {tetel.kepek?.[0] && (
                        <img
                          src={tetel.kepek[0]}
                          alt={tetel.nev}
                          className="w-24 h-16 object-cover rounded"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    Fizetési mód:{" "}
                    <span className="text-gray-800">
                      {rendeles.fizetesiMod}
                    </span>
                  </p>
                  <p>
                    Fizetés státusza:{" "}
                    <span className="text-gray-800">
                      {rendeles.fizetve ? "Fizetve" : "Fizetésre vár"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end gap-3">
                <div className="text-sm font-semibold text-gray-800">
                  {rendeles.osszeg.toLocaleString("hu-HU")} {penznem}
                </div>

                <div className="flex items-center gap-2">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      rendeles.allapot === "Kiszállítás alatt"
                        ? "bg-green-500"
                        : rendeles.allapot === "Kézbesítve"
                        ? "bg-yellow-500"
                        : "bg-gray-400"
                    }`}
                  ></span>
                  <span className="text-sm text-gray-700 capitalize">
                    {rendeles.allapot}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigacio(`/korabbi-rendelesek/${rendeles._id}`)
                  }
                  className="mt-2 bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded hover:bg-gray-900 transition"
                >
                  Részletek
                </button>
              </div>
            </div>
          ))}
        </div>
        {osszesOldal > 1 && (
          <div className="mt-6 flex items-center justify-center space-x-3 text-white">
            <button
              onClick={() => oldalraUgras(1)}
              disabled={aktualisOldal === 1}
              className={`px-3 py-1 rounded-md border ${
                aktualisOldal === 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-500"
              }`}
            >
              Első oldal
            </button>
            <button
              onClick={() => oldalraUgras(aktualisOldal - 1)}
              disabled={aktualisOldal === 1}
              className={`px-3 py-1 rounded-md border ${
                aktualisOldal === 1
                  ? "opacity-30 cursor-not-allowed"
                  : "hover:bg-gray-500"
              }`}
            >
              Előző
            </button>

            <div className="inline-flex items-center space-x-1">
              {oldalSzamok.map((oldal) => (
                <button
                  key={oldal}
                  onClick={() => oldalraUgras(oldal)}
                  className={`px-3 py-1 rounded-md border ${
                    oldal === aktualisOldal
                      ? "bg-blue-800 text-white"
                      : "hover:bg-gray-500"
                  }`}
                >
                  {oldal}
                </button>
              ))}
            </div>

            <button
              onClick={() => oldalraUgras(aktualisOldal + 1)}
              disabled={aktualisOldal === osszesOldal}
              className={`px-3 py-1 rounded-md border ${
                aktualisOldal === osszesOldal
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-500"
              }`}
            >
              Következő
            </button>
            <button
              onClick={() => oldalraUgras(osszesOldal)}
              disabled={aktualisOldal === osszesOldal}
              className={`px-3 py-1 rounded-md border ${
                aktualisOldal === osszesOldal
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:bg-gray-500"
              }`}
            >
              Utolsó oldal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadottRendelesek;
