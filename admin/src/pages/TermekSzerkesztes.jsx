import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";
import { Trash, UploadCloud } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";

const TermekSzerkesztes = () => {
  const { termekId } = useParams();
  const navigal = useNavigate();

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
  const [betoltes, setBetoltes] = useState(false);

  const [akcios, setLeertekelt] = useState(false);
  const [akciosAr, setAkciosAr] = useState("");
  const [akcioKezdet, setAkcioKezdete] = useState("");
  const [akcioVege, setAkcioVege] = useState("");

  const [kezdoMeretek, setKezdoMeretek] = useState({});

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

  const valtasMeret = (meret) => {
    setMeretek((korabbi) => {
      if (korabbi[meret] !== undefined) {
        const uj = { ...korabbi };
        delete uj[meret];
        return uj;
      }
      return { ...korabbi, [meret]: 0 };
    });
  };

  const frissitDarabszam = (meret, db) => {
    const uj = db === "" ? "" : parseInt(db || 0, 10);
    setMeretek((korabbi) => ({ ...korabbi, [meret]: uj }));
  };
  const torolKep = (index) => {
    if (index === 1) setKep1(null);
    if (index === 2) setKep2(null);
    if (index === 3) setKep3(null);
    if (index === 4) setKep4(null);
    if (index === 5) setKep5(null);
    if (index === 6) setKep6(null);
    if (index === 7) setKep7(null);
    if (index === 8) setKep8(null);
  };
  useEffect(() => {
    const betoltTermek = async () => {
      if (!termekId) return;
      setBetoltes(true);
      try {
        axios.defaults.withCredentials = true;
        const res = await axios.post(`${backendUrl}/api/termek/lekerdez`, {
          termekId,
        });
        const termek = res.data.termek;

        if (!termek) {
          toast.error("A termék nem található");
          setBetoltes(false);
          return;
        }

        setNev(termek.nev);
        setLeiras(termek.leiras);
        setAr(termek.ar);
        setKategoria(termek.kategoria);
        setMarka(termek.marka);
        setSzin(termek.szin);
        setTipus(termek.tipus);

        if (termek.akcioVege < Date.now()) {
          setLeertekelt(false);
          setAkciosAr("");
          setAkcioKezdete(null);
          setAkcioVege(null);
        } else {
          setLeertekelt(termek.akcios);
          if (!termek.akcios) {
            setAkciosAr("");
            setAkcioKezdete(null);
            setAkcioVege(null);
          } else {
            setAkciosAr(termek.akciosAr);
            setAkcioKezdete(
              termek.akcioKezdet ? termek.akcioKezdet.slice(0, 10) : ""
            );
            setAkcioVege(termek.akcioVege ? termek.akcioVege.slice(0, 10) : "");
          }
        }
  
        if (!termek.meretek) setMeretek({});
        else if (Array.isArray(termek.meretek)) {
          const kezdo = {};
          termek.meretek.forEach((elem) => {
            if (typeof elem === "object")
              kezdo[String(elem.meret)] = elem.mennyiseg;
          });
          setKezdoMeretek(kezdo);

          const ujMeretek = {};
          termek.meretek.forEach((elem) => {
            if (typeof elem === "object") ujMeretek[String(elem.meret)] = 0;
          });
          setMeretek(ujMeretek);
        } else setMeretek({});

        const kepek = [];
        if (termek.kepek && Array.isArray(termek.kepek))
          kepek.push(...termek.kepek);
        else {
          if (termek.kep1) kepek.push(termek.kep1);
          if (termek.kep2) kepek.push(termek.kep2);
          if (termek.kep3) kepek.push(termek.kep3);
          if (termek.kep4) kepek.push(termek.kep4);
          if (termek.kep5) kepek.push(termek.kep5);
          if (termek.kep6) kepek.push(termek.kep6);
          if (termek.kep7) kepek.push(termek.kep7);
          if (termek.kep8) kepek.push(termek.kep8);
        }
        setKep1(kepek[0] || null);
        setKep2(kepek[1] || null);
        setKep3(kepek[2] || null);
        setKep4(kepek[3] || null);
        setKep5(kepek[4] || null);
        setKep6(kepek[5] || null);
        setKep7(kepek[6] || null);
        setKep8(kepek[7] || null);

        toast.info("Termék betöltve szerkesztésre");
      } catch (err) {
        console.error(err);
        toast.error(
          err?.response?.data?.message || "Hiba a termék betöltése közben"
        );
      } finally {
        setBetoltes(false);
      }
    };
    betoltTermek();
  }, [termekId]);
  const renderKepPreview = (kep) => {
    if (!kep) return null;
    if (kep instanceof File) return URL.createObjectURL(kep);
    if (typeof kep === "string") return kep;
    return null;
  };

  const feltoltes = async (e) => {
    e.preventDefault();
    try {
      axios.defaults.withCredentials = true;
      const ujTermek = new FormData();
      ujTermek.append("termekId", termekId);
      ujTermek.append("nev", nev);
      ujTermek.append("leiras", leiras);
      ujTermek.append("ar", ar);
      ujTermek.append("kategoria", kategoria);
      ujTermek.append("marka", marka);
      ujTermek.append("szin", szin);
      ujTermek.append("tipus", tipus);
      ujTermek.append("meretek", JSON.stringify(meretek));
      ujTermek.append("akcios", akcios);
      ujTermek.append("akciosAr", akciosAr);
      ujTermek.append("akcioKezdet", akcioKezdet);
      ujTermek.append("akcioVege", akcioVege);

      const letezoKepek = [];
      const appendHaFile = (kep, nev) => {
        if (!kep) return;
        if (kep instanceof File) ujTermek.append(nev, kep);
        else if (typeof kep === "string") letezoKepek.push(kep);
      };
      appendHaFile(kep1, "kep1");
      appendHaFile(kep2, "kep2");
      appendHaFile(kep3, "kep3");
      appendHaFile(kep4, "kep4");
      appendHaFile(kep5, "kep5");
      appendHaFile(kep6, "kep6");
      appendHaFile(kep7, "kep7");
      appendHaFile(kep8, "kep8");

      ujTermek.append("meglevoKepek", JSON.stringify(letezoKepek));

      if (
        !kep1 &&
        !kep2 &&
        !kep3 &&
        !kep4 &&
        !kep5 &&
        !kep6 &&
        !kep7 &&
        !kep8 &&
        letezoKepek.length === 0
      ) {
        toast.error("Legalább egy kép szükséges a termékhez");
        return;
      }

      if (!nev || !leiras || !ar || !kategoria || !marka || !szin || !tipus) {
        toast.error("Kérlek töltsd ki a kötelező mezőket");
        return;
      }

      if (akcios && (!akciosAr || !akcioKezdet || !akcioVege)) {
        toast.error("Kérlek töltsd ki az akciós mezőket");
        return;
      }

      ujTermek.append("termekId", termekId);

      const res = await axios.post(
        `${backendUrl}/api/termek/modosit`,
        ujTermek
      );

      if (res.data.siker) {
        window.location.reload();
      } else {
        toast.error(res.data.uzenet);
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message);
    }
  };

  return (
    <div className="mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">Termék szerkesztése</h2>

      {betoltes && (
        <div className="mb-4 text-sm text-slate-600">Betöltés...</div>
      )}

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
                        src={renderKepPreview(kep)}
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
                        type="file"
                        accept="image/*"
                        className="hidden"
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
                <option value="Sneakrs">Sneakrs</option>
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
                style={{ backgroundColor: szin ? SZINEK[szin] : "transparent" }}
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
                      szin: SZINEK[c] === "black" ? "white" : "black",
                    }}
                  >
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium">Méretek és darabszámok</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-2">
              Ide csak a{" "}
              <span className="font-semibold">
                pluszban érkezett darabszámot
              </span>{" "}
              írd be, nem az összes készletet!
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
              {MERET_LISTA.map((m) => {
                const akt = meretek[m] !== undefined;
                return (
                  <div
                    key={m}
                    className={`flex flex-col items-center p-3 rounded-xl border transition ${
                      akt
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => valtasMeret(m)}
                      className={`w-full rounded-md py-2 text-sm font-medium transition ${
                        akt
                          ? "bg-blue-500 text-white shadow-md"
                          : "bg-blue-200 text-gray-700"
                      } hover:opacity-90`}
                    >
                      {m}
                    </button>

                    {akt && (
                      <div className="mt-2 w-full text-center">
                        <p className="text-xs text-gray-600 mb-1">
                          Raktáron:{" "}
                          <span className="font-semibold">
                            {kezdoMeretek[m]} db
                          </span>
                        </p>
                        <input
                          type="number"
                          placeholder="db"
                          onChange={(e) => frissitDarabszam(m, e.target.value)}
                          className="w-full text-center rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400 px-2 py-1 text-sm shadow-sm"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col gap-6 mt-6">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={akcios}
                  onChange={() => setLeertekelt(!akcios)}
                />
                <span className="text-sm">Leértékelt termék</span>
              </label>
            </div>

            {akcios && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Akciós ár (HUF)
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    value={akciosAr}
                    onChange={(e) => setAkciosAr(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Pl. 6000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Akció kezdete
                  </label>
                  <input
                    required
                    type="date"
                    value={akcioKezdet}
                    onChange={(e) => setAkcioKezdete(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Akció vége
                  </label>
                  <input
                    required
                    type="date"
                    value={akcioVege}
                    onChange={(e) => setAkcioVege(e.target.value)}
                    className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigal("/termek-lista")}
              className="inline-flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-xl shadow hover:brightness-110"
            >
              VISSZA
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl shadow hover:brightness-110"
            >
              MENTÉS
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TermekSzerkesztes;
