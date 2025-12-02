import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";

const EgyRendelesTermekei = () => {
  const { backendUrl, felhasznaloAdat, penznem } = useContext(GlobalContext);
  const { rendelesId } = useParams();
  const navigacio = useNavigate();

  const [tetelLista, setTetelLista] = useState([]);

  const rendelesAdatBetoltes = async () => {
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        `${backendUrl}/api/rendeles/felhasznalo`
      );

      if (!response?.data?.siker) {
        setTetelLista([]);
        return;
      } else console.log("hiba");

      const talaltTetelek = [];
      response.data.rendelesek.forEach((rendeles) => {
        if (String(rendeles._id) === String(rendelesId)) {
          rendeles.tetelek.forEach((t) => {
            talaltTetelek.push({
              ...t,
              _rendelesId: rendeles._id,
              datum: rendeles.datum,
              osszeg: rendeles.osszeg,
            });
          });
        }
      });

      setTetelLista(talaltTetelek);
    } catch (err) {
      console.error(err);
      setTetelLista([]);
    }
  };

  useEffect(() => {
    if (felhasznaloAdat) rendelesAdatBetoltes();
  }, [felhasznaloAdat, rendelesId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const datumFormazas = (d) => {
    try {
      return new Date(d).toLocaleString("hu-HU");
    } catch {
      return d;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 pt-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-400">
              RENDELÉS{" "}
              <span className="text-white font-semibold">RÉSZLETEI</span>
            </p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500"></p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigacio(-1)}
              className="inline-flex items-center gap-2 px-3 py-2 bg-white/5 text-white text-sm rounded hover:bg-white/10 transition"
            >
              Vissza
            </button>

            <div className="text-sm text-gray-300">
              Rendelés azonosító:{" "}
              <span className="font-medium text-white ml-2">{rendelesId}</span>
            </div>
          </div>

          <div className="text-sm text-gray-400">
            Dátum:{" "}
            <span className="font-medium text-white ml-2">
              {tetelLista[0]?.datum ? datumFormazas(tetelLista[0].datum) : "-"}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          <div className="bg-white/5 p-4 rounded-lg border border-white/6">
            <h4 className="text-sm text-gray-300 mb-3">Rendelés tételek</h4>

            <div className="space-y-4">
              {tetelLista.map((tetel, i) => (
                <article
                  key={i}
                  className="flex gap-6 items-center bg-white/6 p-4 rounded-lg border border-white/6 hover:shadow-lg transition"
                >
                  <div className="w-48 h-32 flex-shrink-0 rounded overflow-hidden bg-white/5 flex items-center justify-center">
                    {tetel.kepek?.[0] ? (
                      <img
                        src={tetel.kepek[0]}
                        alt={tetel.nev}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-xs text-gray-400">Nincs kép</div>
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="text-white text-s max-w-xs ">{tetel.nev}</p>
                    <div className="text-s text-gray-300 mt-1 flex flex-wrap gap-3">
                      <span>
                        Ár: {tetel.ar.toLocaleString("hu-HU")} {penznem}
                      </span>
                      <span>Darab: {tetel.mennyiseg}</span>
                      <span>Méret: {tetel.meret}</span>
                      <span>Márka: {tetel.marka}</span>
                      <span>Szín: {tetel.szin}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-s font-semibold text-white">
                      Részösszeg:
                    </div>
                    <div className="text-s font-semibold text-white">
                      {(tetel.ar * tetel.mennyiseg).toLocaleString("hu-HU")}{" "}
                      {penznem}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EgyRendelesTermekei;
