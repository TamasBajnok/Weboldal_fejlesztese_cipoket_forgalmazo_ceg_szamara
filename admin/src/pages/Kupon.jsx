import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Kupon = () => {
  const [kuponKod, setKuponKod] = useState("");
  const [lejarat, setLejarat] = useState("");
  const [uzenet, setUzenet] = useState("");
  const [kedvezmeny, setKedvezmeny] = useState("");
  const [kuldes, setKuldes] = useState(false);
  const [mutatElfogadJo, setMutatElfogadJo] = useState(false);
  const [celcsoport, setCelcsoport] = useState(null);

  const ellenoriz = () => {
    if (!kuponKod || kuponKod.trim() === "") {
      toast.error("Adj meg egy kuponkódot!");
      return false;
    }
    if (!lejarat || lejarat.trim() === "") {
      toast.error("Állítsd be a lejárati dátumot!");
      return false;
    }
    const datum = new Date(lejarat);
    if (isNaN(datum.getTime())) {
      toast.error("Érvénytelen dátum!");
      return false;
    }
    return true;
  };

  const kuldesIndit = (target) => {
    if (!ellenoriz()) return;
    if (kuldes) return;
    setCelcsoport(target);
    setMutatElfogadJo(true);
  };

  const kuldesMegerosit = async () => {
    if (!celcsoport) return;
    setKuldes(true);
    setMutatElfogadJo(false);
    try {
      axios.defaults.withCredentials = true;
      let lejaratiDatum;
      try {
        lejaratiDatum = new Date(lejarat).toISOString();
      } catch (error) {
        toast.error(error.message);
        return;
      }

      

      const response = await axios.post(
        backendUrl + "/api/felhasznalo/kupon-kuldes",
        {kuponKod: kuponKod.trim(), lejarat: lejaratiDatum, uzenet: uzenet, kedvezmeny: kedvezmeny, celcsoport: celcsoport}
      );

      if (response.data.siker) {
        toast.success(response.data.uzenet);
      } else {
        toast.error(response.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setKuldes(false);
      setCelcsoport(null);
    }
  };

  const kodGeneralas = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let kod = "";
    for (let i = 0; i < 6; i++) {
      kod += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setKuponKod(kod);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white text-gray-900 rounded-2xl shadow-lg">
      <h1 className="text-2xl font-semibold mb-4">Kuponküldés</h1>

      <div className="grid grid-cols-1 gap-4">
        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">Kuponkód</span>
          <div className="flex gap-2">
            <input
              value={kuponKod}
              onChange={(e) => setKuponKod(e.target.value)}
              className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
            <button
              type="button"
              onClick={kodGeneralas}
              className="px-3 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-900"
            >
              Generál
            </button>
          </div>
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">Kedvezmény (%)</span>
          <input
            type="number"
            min="1"
            max="100"
            value={kedvezmeny}
            onChange={(e) => setKedvezmeny(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
            placeholder="Pl. 10"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">
            Lejárat (év-hónap-nap)
          </span>
          <input
            type="date"
            value={lejarat}
            onChange={(e) => setLejarat(e.target.value)}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-200"
          />
        </label>

        <label className="flex flex-col">
          <span className="text-sm text-gray-700 mb-1">
            Küldendő email üzenet
          </span>
          <textarea
            value={uzenet}
            onChange={(e) => setUzenet(e.target.value)}
            rows={6}
            className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-md focus:outline-none resize-none"
          />
        </label>

        <div className="flex gap-3 mt-2">
          <button
            type="button"
            onClick={() => kuldesIndit("feliratkozok")}
            disabled={kuldes}
            className={`px-4 py-2 rounded-md font-medium ${
              kuldes
                ? "opacity-50 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700"
            }`}
          >
            {kuldes ? "Küldés..." : "Kiküldés feliratkozóknak"}
          </button>

          <button
            type="button"
            onClick={() => kuldesIndit("mindenki")}
            disabled={kuldes}
            className={`px-4 py-2 rounded-md font-medium ${
              kuldes
                ? "opacity-50 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {kuldes ? "Küldés..." : "Kiküldés mindenkinek"}
          </button>
        </div>

        {mutatElfogadJo && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            role="dialog"
            aria-modal="true"
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setMutatElfogadJo(false)}
            />
            <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
              <h3 className="text-lg font-semibold mb-2">
                Biztosan elküldöd a kupont?
              </h3>
              <p className="text-sm text-gray-700 mb-4">
                Kuponkód: <span className="font-semibold">{kuponKod}</span>
                <br />
                Kedvezmény: <span className="font-semibold">{kedvezmeny}%</span>
                <br />
                Lejárat: <span className="font-semibold">{lejarat}</span>
                <br />
                Célcsoport:{" "}
                <span className="font-semibold">
                  {celcsoport === "feliratkozok" ? "Feliratkozók" : "Mindenki"}
                </span>
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setMutatElfogadJo(false);
                    setCelcsoport(null);
                  }}
                  className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Mégse
                </button>
                <button
                  onClick={kuldesMegerosit}
                  className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 font-semibold"
                  disabled={kuldes}
                >
                  {kuldes ? "Küldés..." : "Küldés"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Kupon;
