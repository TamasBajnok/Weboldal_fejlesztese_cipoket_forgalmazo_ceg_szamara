import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { assets } from "../assets/assets";
import TermekKinalo from "../components/TermekKinalo";

const Kinalat = () => {
  const { termekek, kereses, keresesMegjelenites } = useContext(GlobalContext);

  const [szuroLathato, setSzuroLathato] = useState(false);
  const [szurtTermekek, setSzurtTermekek] = useState([]);

  const [minAr, setMinAr] = useState("");
  const [maxAr, setMaxAr] = useState("");
  const [arTartomany, setArTartomany] = useState(null);

  const [kategoria, setKategoria] = useState([]);
  const [tipus, setTipus] = useState([]);
  const [szinek, setSzinek] = useState([]);
  const [markak, setMarkak] = useState([]);

  const [rendezesTipus, setRendezesTipus] = useState("relevans");

  const valtasKategoria = (e) => {
    setKategoria((elozo) =>
      elozo.includes(e.target.value)
        ? elozo.filter((elem) => elem !== e.target.value)
        : [...elozo, e.target.value]
    );
  };

  const valtasSzin = (e) => {
    setSzinek((elozo) =>
      elozo.includes(e.target.value)
        ? elozo.filter((elem) => elem !== e.target.value)
        : [...elozo, e.target.value]
    );
  };

  const valtasMarka = (marka) => {
    setMarkak((elozo) =>
      elozo.includes(marka)
        ? elozo.filter((elem) => elem !== marka)
        : [...elozo, marka]
    );
  };

  const valtasTipus = (egyTipus) => {
    setTipus((elozo) =>
      elozo.includes(egyTipus)
        ? elozo.filter((elem) => elem !== egyTipus)
        : [...elozo, egyTipus]
    );
  };

  const alkalmazSzuro = () => {
    let termekMasolat = [...termekek];
    if (keresesMegjelenites && kereses) {
      const keresesSzavak = kereses.toLowerCase().split(/\s+/).filter(Boolean);
      termekMasolat = termekMasolat.filter((elem) => {
        return keresesSzavak.every((szo) =>
          [elem.nev, elem.marka, elem.kategoria, elem.tipus, elem.szin]
            .map((ertek) => ertek.toLowerCase())
            .some((mezo) => mezo.includes(szo))
        );
      });
    }

    if (kategoria.length) {
      termekMasolat = termekMasolat.filter((elem) =>
        kategoria.includes(elem.kategoria)
      );
    }

    if (tipus.length) {
      termekMasolat = termekMasolat.filter((elem) =>
        tipus.includes(elem.tipus)
      );
    }

    if (szinek.length) {
      termekMasolat = termekMasolat.filter((elem) =>
        szinek.includes(elem.szin)
      );
    }

    if (markak.length) {
      termekMasolat = termekMasolat.filter((elem) =>
        markak.includes(elem.marka)
      );
    }

    if (arTartomany) {
      termekMasolat = termekMasolat.filter(
        (elem) => elem.ar >= arTartomany.min && elem.ar <= arTartomany.max
      );
    }

    let rendezett = [...termekMasolat].sort((a, b) => b.pozicio - a.pozicio);
    if (rendezesTipus === "alacsony-magas") {
      rendezett.sort((a, b) => a.ar - b.ar);
    } else if (rendezesTipus === "magas-alacsony") {
      rendezett.sort((a, b) => b.ar - a.ar);
    } else if (rendezesTipus === "a-z") {
      rendezett.sort((a, b) => a.nev.localeCompare(b.nev));
    } else if (rendezesTipus === "z-a") {
      rendezett.sort((a, b) => b.nev.localeCompare(a.nev));
    }

    setSzurtTermekek(rendezett);
  };

  useEffect(() => {
    alkalmazSzuro();
  }, [
    kategoria,
    tipus,
    szinek,
    markak,
    rendezesTipus,
    kereses,
    keresesMegjelenites,
    termekek,
    arTartomany,
  ]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-9xl mx-auto px-4 flex flex-col md:flex-row gap-8">
        <aside
          className={`w-full md:w-72 bg-gray-800 rounded-2xl shadow-lg p-6 transition-all duration-300 ${
            szuroLathato ? "h-auto" : "h-[100px]"
          }`}
        >
          <button
            onClick={() => setSzuroLathato((elozo) => !elozo)}
            className="w-full flex justify-between items-center mb-6 text-lg font-semibold text-gray-100"
          >
            <span className="text-blue-400">Szűrők</span>
            <img
              src={assets.dropdown_icon}
              alt="Szűrők lenyíló"
              className={`h-5 transform transition-transform duration-200 ${
                szuroLathato ? "rotate-90" : ""
              }`}
            />
          </button>

          <div className={`${szuroLathato ? "block" : "hidden"} space-y-6`}>
            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">
                Kategóriák
              </h4>
              <ul className="space-y-2">
                {["Férfi", "Női", "Gyerek"].map((kat) => (
                  <li key={kat} className="flex items-center">
                    <input
                      id={kat}
                      type="checkbox"
                      value={kat}
                      onChange={valtasKategoria}
                      className="h-4 w-4 text-blue-400 border-gray-600 rounded focus:ring-blue-500"
                    />
                    <label
                      htmlFor={kat}
                      className="ml-2 text-gray-200 font-light"
                    >
                      {kat}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">
                Típus
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Utcai",
                  "Sportos",
                  "Csizma",
                  "Magas sarkú",
                  "Sneakrs",
                  "Szandál",
                  "Papucs",
                  "Túra",
                ].map((tip) => (
                  <button
                    key={tip}
                    onClick={() => valtasTipus(tip)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      tipus.includes(tip)
                        ? "bg-blue-500 text-white border-blue-400"
                        : "bg-gray-700 text-gray-200 border-gray-600"
                    }`}
                  >
                    {tip}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">
                Színek
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  { nev: "Piros", hex: "#FF0000" },
                  { nev: "Fekete", hex: "#000000" },
                  { nev: "Fehér", hex: "#FFFFFF" },
                  { nev: "Zold", hex: "#008000" },
                  { nev: "Sarga", hex: "#FFFF00" },
                  { nev: "Lila", hex: "#800080" },
                  { nev: "Rozsaszin", hex: "#FFC0CB" },
                ].map((szin) => (
                  <button
                    key={szin.nev}
                    onClick={() => valtasSzin({ target: { value: szin.nev } })}
                    className={`w-6 h-6 rounded-md border-2 transition-all ${
                      szinek.includes(szin.nev)
                        ? "border-blue-400 scale-110"
                        : "border-gray-600"
                    }`}
                    style={{ backgroundColor: szin.hex }}
                    title={szin.nev}
                  />
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">
                Márkák
              </h4>
              <div className="flex flex-wrap gap-2">
                {[
                  "Puma",
                  "Nike",
                  "Adidas",
                  "Converse",
                  "Jordan",
                  "Bugatti",
                  "Skechers",
                ].map((marka) => (
                  <button
                    key={marka}
                    onClick={() => valtasMarka(marka)}
                    className={`px-3 py-1 rounded-lg border text-sm ${
                      markak.includes(marka)
                        ? "bg-blue-500 text-white border-blue-400"
                        : "bg-gray-700 text-gray-200 border-gray-600"
                    }`}
                  >
                    {marka}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-400 uppercase mb-3">
                Ár (Ft)
              </h4>
              <div className="flex items-center gap-2 mb-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minAr}
                  onChange={(e) => setMinAr(e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-gray-700 text-gray-200 border border-gray-600 text-sm"
                />
                <span className="text-gray-400">-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxAr}
                  onChange={(e) => setMaxAr(e.target.value)}
                  className="w-20 px-2 py-1 rounded bg-gray-700 text-gray-200 border border-gray-600 text-sm"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() =>
                    setArTartomany({
                      min: Number(minAr) || 0,
                      max: Number(maxAr) || Infinity,
                    })
                  }
                  className="px-4 py-1 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition"
                >
                  Alkalmaz
                </button>
                <button
                  onClick={() => {
                    setMinAr("");
                    setMaxAr("");
                    setArTartomany(null);
                  }}
                  className="px-4 py-1 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition"
                >
                  Mégse
                </button>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 bg-gray-800 rounded-2xl shadow-inner p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
            <div className='inline-flex gap-2 items-center mb-3'>
            <p className='text-gray-400'>TELJES <span className='text-white font-semibold'>KÍNÁLAT</span></p>
            <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500'></p>
            </div>
            <select
              onChange={(e) => setRendezesTipus(e.target.value)}
              className="mt-4 sm:mt-0 inline-block px-4 py-2 border border-gray-600 rounded-lg text-sm font-medium bg-gray-900 hover:shadow-md transition-shadow focus:ring-2 focus:ring-blue-500 text-gray-100"
            >
              <option value="relevans">Rendezés: Összes</option>
              <option value="alacsony-magas">Ár szerint növekvő</option>
              <option value="magas-alacsony">Ár szerint csökkenő</option>
              <option value="a-z">Név szerint A-Z</option>
              <option value="z-a">Név szerint Z-A</option>
            </select>
          </div>
                  
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {szurtTermekek.map((elem, index) => (
              
              <TermekKinalo
                key={index}
                termekId={elem._id}
                nev={elem.nev}
                ar={elem.ar}
                kepek={elem.kepek}
                akcios={elem.akcios}
                akciosAr={elem.akciosAr}
                akcioKezdet={elem.akcioKezdet}
                akcioVege={elem.akcioVege}
                marka={elem.marka}
                velemenyek={elem.velemenyek?.length || 0}
                ertekeles={(
                    elem.velemenyek.reduce(
                      (sum, velemenyek) => sum + velemenyek.ertekeles,
                      0
                    ) / elem.velemenyek.length
                  ).toFixed(2)}
              />
              
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Kinalat;
