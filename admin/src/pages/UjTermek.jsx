import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Trash, UploadCloud } from "lucide-react";

const UjTermek = () => {
  const [kep1, setKep1] = useState(null);
  const [kep2, setKep2] = useState(null);
  const [kep3, setKep3] = useState(null);
  const [kep4, setKep4] = useState(null);
  const [kep5, setKep5] = useState(null);
  const [kep6, setKep6] = useState(null);
  const [kep7, setKep7] = useState(null);
  const [kep8, setKep8] = useState(null);

  const [nev, setNev] = useState("");
  const [leiras, setLeiras] = useState("");
  const [ar, setAr] = useState("");
  const [kategoria, setKategoria] = useState("");
  const [marka, setMarka] = useState("");
  const [szin, setSzin] = useState("");
  const [tipus, setTipus] = useState("");
  const [meretek, setMeretek] = useState({});

  const MERET_LISTA = [
    "28",
    "29",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
  ];

  const SZINEK = {
    Piros: "red",
    Fekete: "black",
    Feher: "white",
    Zold: "green",
    Sarja: "yellow",
    Lila: "purple",
    Rozsaszin: "pink",
  };

  const kapcsolMeret = (meret) => {
    setMeretek((elozo) => {
      if (elozo[meret] !== undefined) {
        const ujMeretek = { ...elozo };
        delete ujMeretek[meret];
        return ujMeretek;
      }
      return { ...elozo, [meret]: 0 };
    });
  };

  const frissitMennyiseg = (meret, mennyiseg) => {
    const tisztitott =
      mennyiseg === "" ? "" : Math.max(0, parseInt(mennyiseg || 0, 10));
    setMeretek((elozo) => ({ ...elozo, [meret]: tisztitott }));
  };

  const torolKep = (hanyadik) => {
    if (hanyadik === 1) setKep1(null);
    if (hanyadik === 2) setKep2(null);
    if (hanyadik === 3) setKep3(null);
    if (hanyadik === 4) setKep4(null);
    if (hanyadik === 5) setKep5(null);
    if (hanyadik === 6) setKep6(null);
    if (hanyadik === 7) setKep7(null);
    if (hanyadik === 8) setKep8(null);
  };

  const feltoltes = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const ujTermek = new FormData();

      ujTermek.append("nev", nev);
      ujTermek.append("leiras", leiras);
      ujTermek.append("ar", ar);
      ujTermek.append("kategoria", kategoria);
      ujTermek.append("marka", marka);
      ujTermek.append("szin", szin);
      ujTermek.append("tipus", tipus);
      ujTermek.append("meretek", JSON.stringify(meretek));

      kep1 && ujTermek.append("kep1", kep1);
      kep2 && ujTermek.append("kep2", kep2);
      kep3 && ujTermek.append("kep3", kep3);
      kep4 && ujTermek.append("kep4", kep4);
      kep5 && ujTermek.append("kep5", kep5);
      kep6 && ujTermek.append("kep6", kep6);
      kep7 && ujTermek.append("kep7", kep7);
      kep8 && ujTermek.append("kep8", kep8);

      const valasz = await axios.post(
        backendUrl + "/api/termek/hozzaad",
        ujTermek
      );

      if (valasz.data.siker) {
        toast.success(valasz.data.uzenet);
        setNev("");
        setLeiras("");
        setKep1(null);
        setKep2(null);
        setKep3(null);
        setKep4(null);
        setKep5(null);
        setKep6(null);
        setKep7(null);
        setKep8(null);
        setAr("");
        setMarka("");
        setSzin("");
        setMeretek({});
        setKategoria("");
        setTipus("");
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (hiba) {
      console.error(hiba);
      toast.error(hiba.message || "Hiba történt");
    }
  };

  useEffect(() => {}, [meretek]);

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Új termék hozzáadása</h2>

      <form
        onSubmit={feltoltes}
        className="grid grid-cols-1 lg:grid-cols-3 gap-6"
      >
     
        <div className="col-span-1 bg-white rounded-2xl shadow-sm p-4">
          <p className="font-medium mb-3">Képek</p>
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const kep =
                i === 1
                  ? kep1
                  : i === 2
                  ? kep2
                  : i === 3
                  ? kep3
                  : i === 4
                  ? kep4
                  : i === 5
                  ? kep5
                  : i === 6
                  ? kep6
                  : i === 7
                  ? kep7
                  : kep8;

              return (
                <div
                  key={i}
                  className="relative border rounded-lg overflow-hidden h-36 flex items-center justify-center bg-slate-50"
                >
                  {kep ? (
                    <>
                      <img
                        className="object-cover w-full h-full"
                        src={URL.createObjectURL(kep)}
                        alt={`preview-${i}`}
                      />
                      <button
                        type="button"
                        onClick={() => torolKep(i)}
                        className="absolute top-2 right-2 bg-white/80 p-1 rounded-full shadow"
                      >
                        <Trash size={16} />
                      </button>
                    </>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 cursor-pointer w-full h-full text-sm text-slate-500">
                      <UploadCloud size={20} />
                      <span>Feltöltés</span>
                      <input
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (!file) return;
                          if (i === 1) setKep1(file);
                          if (i === 2) setKep2(file);
                          if (i === 3) setKep3(file);
                          if (i === 4) setKep4(file);
                          if (i === 5) setKep5(file);
                          if (i === 6) setKep6(file);
                          if (i === 7) setKep7(file);
                          if (i === 8) setKep8(file);
                        }}
                        type="file"
                        accept="image/*"
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Termék neve
              </label>
              <input
                required
                value={nev}
                onChange={(e) => setNev(e.target.value)}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Név"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ár (HUF)</label>
              <input
                required
                value={ar}
                onChange={(e) => setAr(e.target.value)}
                type="number"
                min="0"
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="8000"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Leírás</label>
              <textarea
                required
                value={leiras}
                onChange={(e) => setLeiras(e.target.value)}
                rows={4}
                className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Termék leírása..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Kategória
              </label>
              <select
                value={kategoria}
                onChange={(e) => setKategoria(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="" hidden>
                  Válassz kategóriát...
                </option>
                <option value="Férfi">Férfi</option>
                <option value="Női">Női</option>
                <option value="Gyerek">Gyerek</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Típus</label>
              <select
                value={tipus}
                onChange={(e) => setTipus(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="" hidden>
                  Válassz típust...
                </option>
                <option value="Utcai">Utcai</option>
                <option value="Sportos">Sportos</option>
                <option value="Csizma">Csizma</option>
                <option value="Magas sarkú">Magas sarkú</option>
                <option value="Sneakers">Sneakers</option>
                <option value="Szandál">Szandál</option>
                <option value="Papucs">Papucs</option>
                <option value="Túra">Túra</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Márka</label>
              <select
                value={marka}
                onChange={(e) => setMarka(e.target.value)}
                className="w-full border rounded-md px-3 py-2"
              >
                <option value="" hidden>
                  Válassz márkát...
                </option>
                <option value="Puma">Puma</option>
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Converse">Converse</option>
                <option value="Jordan">Jordan</option>
                <option value="Bugatti">Bugatti</option>
                <option value="Skechers">Skechers</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Szín</label>
              <select
                value={szin}
                onChange={(e) => setSzin(e.target.value)}
                className="w-full h-10 border rounded-md cursor-pointer"
                style={{
                  backgroundColor: szin ? SZINEK[szin] : "transparent",
                }}
              >
                <option value="" hidden>
                  Válassz színt...
                </option>
                {Object.keys(SZINEK).map((c) => (
                  <option
                    key={c}
                    value={c}
                    style={{
                      backgroundColor: SZINEK[c],
                      color: SZINEK[c] === "black" ? "white" : "black",
                    }}
                  ></option>
                ))}
              </select>
            </div>
          </div>

          <hr className="my-6" />

          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Méretek és darabszámok</h3>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {MERET_LISTA.map((m) => {
                const aktivalt = meretek[m] !== undefined;
                return (
                  <div key={m} className="flex flex-col items-center">
                    <button
                      type="button"
                      onClick={() => kapcsolMeret(m)}
                      className={`w-full rounded-md py-2 text-sm font-medium ${
                        aktivalt
                          ? "bg-blue-400 border border-black"
                          : "bg-blue-200 border border-transparent"
                      } hover:opacity-90`}
                    >
                      {m}
                    </button>
                    {aktivalt && (
                      <input
                        type="number"
                        min={0}
                        value={meretek[m] === "" ? "" : meretek[m]}
                        onChange={(e) => frissitMennyiseg(m, e.target.value)}
                        className="mt-2 w-full text-center rounded-md border px-2 py-1"
                        placeholder="db"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between mt-6">
            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow hover:brightness-110"
            >
              HOZZÁADÁS
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UjTermek;
