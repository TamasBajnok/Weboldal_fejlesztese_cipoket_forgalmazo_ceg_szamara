import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { backendUrl, penznem } from "../App";
import { toast } from "react-toastify";

export default function EgyRendelesReszletek() {
  const { rendelesId } = useParams();
  const navigal = useNavigate();
  const [rendeles, setRendeles] = useState(null);
  const [betoltes, setBetoltes] = useState(true);

  useEffect(() => {
    const rendelesBetoltese = async () => {
      try {
        setBetoltes(true);
        axios.defaults.withCredentials = true;
        const response = await axios.post(backendUrl + "/api/rendeles/rendeles-tetelei", {
          rendelesId,
        });
        if (response.data.siker) {
          setRendeles(response.data.rendeles);
        } else {
          toast.error(response.data.uzenet);
        }
      } catch (error) {
        toast.error(error.message);
      } finally {
        setBetoltes(false);
      }
    };
    if (rendelesId) rendelesBetoltese();
  }, [rendelesId]);

  const statuszValtoztatas = async (e) => {
    try {
      axios.defaults.withCredentials = true;
      const ujStatus = e.target.value;
      const response = await axios.post(backendUrl + "/api/rendeles/statusz", {
        rendelesId,
        allapot: ujStatus,
      });
      if (response.data.siker) {
  toast.success(response.data.uzenet);
  setRendeles((elozo) => ({ ...elozo, allapot: ujStatus }));
} else {
  toast.error(response.data.uzenet);
}
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (betoltes) return <div className="p-8 text-lg">Betöltés...</div>;
  if (!rendeles) return <div className="p-8">Nincs ilyen rendelés.</div>;

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg mt-8">
      <button
        className="mb-6 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-gray-800"
        onClick={() => navigal(-1)}
      >
        Vissza
      </button>

      <h2 className="text-4xl font-bold mb-4">Rendelés részletek:</h2>

      <div className="mb-4 text-gray-700 grid grid-cols-1 sm:grid-cols-[1fr] lg:grid-cols-[1.5fr_1fr_1.5fr] gap-3">
        <div className="text-xl">
          Rendelés azonosító:{" "}
          <span className="font-semibold">{rendeles._id}</span>
        </div>
        <div className="text-xl">
          Vásárló:{" "}
          <span className="font-semibold">{rendeles.cim.nev}</span>
        </div>
        <div className="text-xl">
          Rendelés dátum:{" "}
          <span className="font-semibold">
            {new Date(rendeles.datum).toLocaleString()}
          </span>
        </div>
        <div className="text-xl">
          Szállítási cím:{" "}
          <span className="font-medium">
            {rendeles.cim.iranyitoszam}, {rendeles.cim.varos}{" "}
            {rendeles.cim.utca}
          </span>
        </div>
        <div className="text-xl">
          Végösszeg:{" "}
          <span className="font-medium">
            {rendeles.osszeg.toLocaleString("hu-HU")} {penznem}
          </span>
        </div>

        <select
          onChange={statuszValtoztatas}
          value={rendeles.allapot}
          className="p-2 font-semibold bg-gray-800 rounded text-sm text-white"
        >
          <option value="Megrendelve">Megrendelve</option>
          <option value="Csomag összekészítése">Csomag összekészítése</option>
          <option value="Csomag elküldve">Csomag elküldve</option>
          <option value="Kiszállítás alatt">Kiszállítás alatt</option>
          <option value="Kiszállítva">Kiszállítva</option>
        </select>
      </div>

      <h1 className="text-4xl font-bold mb-4">Terméklista:</h1>
      <ul className="divide-y divide-gray-200">
        {rendeles.tetelek.map((termek, idx) => (
          <li key={idx} className="py-6 flex items-center gap-10">
            {termek.kepek?.[0] && (
              <img
                src={termek.kepek[0]}
                alt={termek.nev}
                className="w-60 h-40 object-cover rounded-lg border shadow-lg"
              />
            )}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 items-center">
              <div className="text-xl mb-2">
                Azonosító: <span className="font-bold">{termek._id}</span>
              </div>
              <div className="text-xl mb-2">
                Név: <span className="font-bold">{termek.nev}</span>
              </div>
              <div className="text-xl mb-2">
                Méret: <span className="font-bold">{termek.meret}</span>
              </div>
              <div className="text-xl mb-2">
                Mennyiség:{" "}
                <span className="font-bold">{termek.mennyiseg} db</span>
              </div>
              <div className="text-xl">
                Egységár:{" "}
                <span className="font-bold">
                  {termek.ar.toLocaleString("hu-HU")} {penznem}
                </span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
