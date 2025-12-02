import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { toast } from "react-toastify";

const RendelésElküldés = () => {
  const [fizetesiMod, setFizetesiMod] = useState("");
  const [torlesMegerositIndex, setTorlesMegerositIndex] = useState(null);
  const [cimTorlesIndex, setCimTorlesIndex] = useState(null);
  const [kivalasztottCimIndex, setKivalasztottCimIndex] = useState(null);
  const [cimFormMegjelenit, setCimFormMegjelenit] = useState(false);
  const [kosarAdat, setKosarAdat] = useState(() => {
    const tarolt = localStorage.getItem("kosarAdat");
    return tarolt ? JSON.parse(tarolt) : [];
  });

  useEffect(() => {
    localStorage.setItem("kosarAdat", JSON.stringify(kosarAdat));
  }, [kosarAdat]);

  const [kuponKod, setKuponKod] = useState(
    () => localStorage.getItem("aktivKuponKod") || ""
  );
  const [kuponKedvezmeny, setKuponKedvezmeny] = useState(
    () => Number(localStorage.getItem("aktivKuponKedvezmeny")) || 0
  );
  const [kuponUzenet, setKuponUzenet] = useState("");

  const kerekit5re = (osszeg) => {
    if (typeof osszeg !== "number" || !isFinite(osszeg)) return 0;
    return Math.floor(osszeg / 5) * 5;
  };

  const kuponEllenorzes = async () => {
    if (!kuponKod.trim()) {
      setKuponUzenet("Írj be egy kuponkódot!");
      return;
    }
    try {
      axios.defaults.withCredentials = true;
      console.log(kuponKod);
      const valasz = await axios.post(
        `${backendUrl}/api/felhasznalo/kupon-ellenorzes`,
        { kuponKod: kuponKod }
      );
      console.log(valasz.data.kedvezmeny);
      if (valasz.data.siker && valasz.data.kedvezmeny) {
        setKuponKedvezmeny(valasz.data.kedvezmeny);
        setKuponUzenet("");
        localStorage.setItem("aktivKuponKod", kuponKod);
        localStorage.setItem("aktivKuponKedvezmeny", valasz.data.kedvezmeny);
      } else {
        setKuponKedvezmeny(0);
        setKuponUzenet(valasz.data.uzenet || "Nincs ilyen kuponkód!");
        localStorage.removeItem("aktivKuponKod");
        localStorage.removeItem("aktivKuponKedvezmeny");
      }
    } catch (error) {
      setKuponKedvezmeny(0);
      setKuponUzenet("Hiba történt a kupon ellenőrzésekor.");
      localStorage.removeItem("aktivKuponKod");
      localStorage.removeItem("aktivKuponKedvezmeny");
    }
  };

  const kuponTorles = () => {
    setKuponKedvezmeny(0);
    setKuponKod("");
    setKuponUzenet("");
    localStorage.removeItem("aktivKuponKod");
    localStorage.removeItem("aktivKuponKedvezmeny");
  };

  const {
    navigacio,
    backendUrl,
    kosarElemek,
    setKosarElemek,
    kosarOsszeg,
    szallitasiDij,
    termekek,
    felhasznaloAdat,
    felhasznaloAdatLekerdez,
    termekekLekerdez,
    penznem,
    kosarSzinkronizal,
  } = useContext(GlobalContext);

  const [urlapAdat, setUrlapAdat] = useState({
    nev: "",
    utca: "",
    varos: "",
    iranyitoszam: "",
    telefon: "",
  });

  const keszletEllenorzes = async () => {
    const frissTermekek = await termekekLekerdez();
    if (!frissTermekek || frissTermekek.length === 0) {
      toast.error("Hiba: termékadatok nem érhetők el. Kérlek próbáld újra.");
      return false;
    }

    const ideiglenesAdat = [];
    for (const termekId in kosarElemek) {
      for (const meret in kosarElemek[termekId]) {
        if (kosarElemek[termekId][meret] > 0) {
          ideiglenesAdat.push({
            _id: termekId,
            meret: meret,
            mennyiseg: kosarElemek[termekId][meret],
          });
        }
      }
    }

    for (const k of ideiglenesAdat) {
      const termek = frissTermekek.find((t) => String(t._id) === String(k._id));
      if (!termek) {
        toast.error(`A kosárban lévő termék (${k._id}) már nem elérhető.`);
        return false;
      }

      const meretAdat = termek.meretek.find((s) => s.meret === k.meret);
      if (!meretAdat) {
        toast.error(
          `${termek.name}: a kiválasztott méret (${k.meret}) már nem elérhető.`
        );
        return false;
      }

      if (meretAdat.quantity < k.mennyiseg) {
        toast.error(
          `${termek.name}, Méret: (${k.meret}) esetében nincs ennyi darab készleten!`
        );
        return false;
      }
    }
    return true;
  };

  const urlapValtozas = (e) => {
    const nev = e.target.name;
    let ertek = e.target.value;

    if (nev === "iranyitoszam" || nev === "telefon") {
      ertek = ertek.replace(/\D/g, "");
    }

    setUrlapAdat((adat) => ({ ...adat, [nev]: ertek }));
  };

  const cimKivalasztas = (cim, index) => {
    setKivalasztottCimIndex(index);
    setCimFormMegjelenit(false);
    setUrlapAdat({
      nev: cim.nev,
      email: felhasznaloAdat.email,
      varos: cim.varos,
      iranyitoszam: cim.iranyitoszam,
      utca: cim.utca,
      telefon: cim.telefon,
    });
  };

  const cimTorles = async (index) => {
    try {
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(
        `${backendUrl}/api/felhasznalo/cim-torles`,
        {
          index: index,
        }
      );
      if (valasz.data.siker) {
        await felhasznaloAdatLekerdez();
        setTorlesMegerositIndex(null);
        toast.success(valasz.data.uzenet);
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const urlapBekuldes = async (e) => {
    e.preventDefault();
    try {
      if (!fizetesiMod) {
        toast.error("Válassz fizetési módot!");
        return;
      }

      const uresMezo = Object.values(urlapAdat).some(
        (ertek) => !ertek || ertek.trim() === ""
      );
      if (uresMezo) {
        toast.error("Hiányzó adat!");
        return;
      }

      const ok = await keszletEllenorzes();
      if (!ok) return;

      let rendelesiTetelek = [];

      for (const termekId in kosarElemek) {
        for (const meret in kosarElemek[termekId]) {
          if (kosarElemek[termekId][meret] > 0) {
            const termekAdat = structuredClone(
              termekek.find((t) => t._id === termekId)
            );
            if (termekAdat) {
              termekAdat.meret = meret;
              termekAdat.mennyiseg = kosarElemek[termekId][meret];
              rendelesiTetelek.push(termekAdat);
            }
          }
        }
      }

      let vegosszeg = vegosszegKiszamol();

      let rendelésiAdat = {
        cim: urlapAdat,
        tetelek: rendelesiTetelek,
        osszeg: vegosszeg,
        kupon: kuponKod,
        kuponKedvezmeny: kuponKedvezmeny,
      };
      rendelésiAdat.tetelek.forEach((elem) => {
        elem.ar =
          elem.akcios &&
          new Date(elem.akcioVege.slice(0, 10)) > Date.now() &&
          new Date(elem.akcioKezdet.slice(0, 10)) < Date.now()
            ? kuponKod
              ? Math.floor(elem.akciosAr * (1 - kuponKedvezmeny / 100))
              : elem.akciosAr
            : kuponKod
            ? Math.floor(elem.ar * (1 - kuponKedvezmeny / 100))
            : elem.ar;
      });

      switch (fizetesiMod) {
        case "Készpénz": {
          axios.defaults.withCredentials = true;
          const valasz = await axios.post(
            `${backendUrl}/api/rendeles/keszpenz`,

            {
              tetelek: rendelésiAdat.tetelek,
              cim: urlapAdat,
              osszeg: kerekit5re(vegosszeg),
              kupon: kuponKod,
              kuponKedvezmeny: kuponKedvezmeny,
            }
          );
          if (valasz.data.siker) {
            kuponTorles();
            setKosarElemek({});
            navigacio("/korabbi-rendelesek");
            localStorage.removeItem("aktivKuponKod");
            localStorage.removeItem("aktivKuponKedvezmeny");
          } else {
            toast.error(valasz.data.uzenet);
          }
          break;
        }
        case "stripe": {
          const stripeValasz = await axios.post(
            `${backendUrl}/api/rendeles/stripe`,
            {
              tetelek: rendelésiAdat.tetelek,
              cim: urlapAdat,
              osszeg: vegosszeg,
              kupon: kuponKod,
              kuponKedvezmeny: kuponKedvezmeny,
            }
          );
          if (stripeValasz.data.siker) {
            const { session_url } = stripeValasz.data;
            kuponTorles();
            window.location.replace(session_url);
            localStorage.removeItem("aktivKuponKod");
            localStorage.removeItem("aktivKuponKedvezmeny");
          } else {
            toast.error(stripeValasz.data.uzenet);
          }
          break;
        }
        default:
          break;
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    kosarSzinkronizal();
    if (termekek.length > 0) {
      const ideiglenesAdat = [];
      for (const termekId in kosarElemek) {
        for (const meret in kosarElemek[termekId]) {
          if (kosarElemek[termekId][meret] > 0) {
            ideiglenesAdat.push({
              _id: termekId,
              meret: meret,
              mennyiseg: kosarElemek[termekId][meret],
            });
          }
        }
      }
      setKosarAdat(ideiglenesAdat);
      window.scrollTo(0, 0);
    }
    window.scrollTo(0, 0);
  }, []);
  const vegosszegKiszamol = () => {
    let osszeg = 0;

    kosarAdat.forEach((elem) => {
      const termek = termekek.find((t) => t._id === elem._id);
      if (!termek) return;
      const akcioAktiv =
        termek.akcios &&
        termek.akcioKezdet &&
        termek.akcioVege &&
        new Date(termek.akcioKezdet.slice(0, 10)).getTime() < Date.now() &&
        new Date(termek.akcioVege.slice(0, 10)).getTime() > Date.now();

      const unitPrice = akcioAktiv ? termek.akciosAr : termek.ar;
      const lineTotal = unitPrice * elem.mennyiseg;

      if (kuponKedvezmeny > 0) {
        osszeg += Math.floor(lineTotal * (1 - kuponKedvezmeny / 100));
      } else {
        osszeg += lineTotal;
      }
    });

    const shipping = kosarAdat.length > 0 ? szallitasiDij : 0;
    return osszeg + shipping;
  };

  return (
    <form
      onSubmit={urlapBekuldes}
      className="min-h-screen bg-gray-900 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8 grid md:grid-cols-2 gap-10">
        <div>
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-400">
              Rendelés <span className="text-white font-semibold">Leadása</span>
            </p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500"></p>
          </div>
          <p className="text-gray-400 mt-2">Szállítási adatok</p>
          {felhasznaloAdat.cim && felhasznaloAdat.cim.length > 0 && (
            <div className="space-y-4 mt-4 text-white">
              {felhasznaloAdat.cim.map((cim, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-xl flex justify-between items-center ${
                    kivalasztottCimIndex === index
                      ? "bg-green-700"
                      : "bg-gray-700"
                  }`}
                >
                  <div>
                    <p className="font-bold">{cim.nev}</p>
                    <p>
                      {cim.iranyitoszam}, {cim.varos} {cim.utca}
                    </p>
                    <p>{cim.telefon}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => cimKivalasztas(cim, index)}
                      className="px-3 py-1 bg-blue-600 rounded-lg text-white"
                    >
                      Kiválaszt
                    </button>
                    <button
                      type="button"
                      onClick={() => setCimTorlesIndex(index)}
                      className="px-3 py-1 bg-red-600 rounded-lg text-white"
                    >
                      Törlés
                    </button>
                    {cimTorlesIndex !== null && (
                      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                        <div className="bg-white text-black rounded-2xl p-6 w-[90%] max-w-md text-center">
                          <p className="text-xl font-semibold mb-4">
                            Biztosan törlöd ezt a szállítási címet?
                          </p>
                          <div className="flex justify-center gap-6 mt-6">
                            <button
                              type="button"
                              onClick={() => {
                                cimTorles(cimTorlesIndex);
                                setCimTorlesIndex(null);
                              }}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full"
                            >
                              Igen
                            </button>
                            <button
                              type="button"
                              onClick={() => setCimTorlesIndex(null)}
                              className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-6 py-2 rounded-full"
                            >
                              Nem
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
          {cimFormMegjelenit ? (
            <div className="mt-6 space-y-3">
              <input
                type="text"
                name="nev"
                value={urlapAdat.nev}
                onChange={urlapValtozas}
                placeholder="Név"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                name="utca"
                value={urlapAdat.utca}
                onChange={urlapValtozas}
                placeholder="Utca, házszám"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                name="varos"
                value={urlapAdat.varos}
                onChange={urlapValtozas}
                placeholder="Város"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                name="iranyitoszam"
                value={urlapAdat.iranyitoszam}
                onChange={urlapValtozas}
                placeholder="Irányítószám"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <input
                type="text"
                name="telefon"
                value={urlapAdat.telefon}
                onChange={urlapValtozas}
                placeholder="Telefon"
                className="w-full p-2 rounded-lg bg-gray-700 text-white"
              />
              <button
                type="button"
                onClick={() => {
                  setCimFormMegjelenit(false);
                  setKivalasztottCimIndex(null);
                  setUrlapAdat({
                    nev: "",
                    utca: "",
                    varos: "",
                    iranyitoszam: "",
                    telefon: "",
                  });
                }}
                className="w-full mt-2 py-2 bg-red-600 rounded-lg text-white"
              >
                Mégse
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setCimFormMegjelenit(true);
                setKivalasztottCimIndex(null);
                setUrlapAdat({
                  nev: "",
                  utca: "",
                  varos: "",
                  iranyitoszam: "",
                  telefon: "",
                });
              }}
              className="mt-6 px-4 py-2 bg-gray-600 rounded-lg text-white"
            >
              Új cím megadása
            </button>
          )}
        </div>
        <div>
          <div className="inline-flex gap-2 items-center mb-3">
            <p className="text-gray-400">ÖSSZEG</p>
            <p className="w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500"></p>
          </div>
          <div className="bg-gray-800 p-4 rounded-md text-gray-100 mt-4">
            <h3 className="text-lg font-semibold mb-3">
              Rendelés összefoglaló
            </h3>

            <ul className="space-y-3">
              {kosarAdat.length === 0 && (
                <li className="text-sm text-gray-300">A kosarad üres.</li>
              )}
              {kosarAdat.map((elem, idx) => {
                const termek = termekek.find((t) => t._id === elem._id);
                if (!termek) return null;

                let sorOsszeg;
                let eredetiOsszeg;
                if (
                  termek.akcios &&
                  new Date(termek.akcioVege.slice(0, 10)) > Date.now() &&
                  new Date(termek.akcioKezdet.slice(0, 10)) < Date.now()
                ) {
                  eredetiOsszeg = termek.akciosAr * elem.mennyiseg;
                } else {
                  eredetiOsszeg = termek.ar * elem.mennyiseg;
                }
                if (kuponKedvezmeny > 0) {
                  sorOsszeg = Math.floor(
                    eredetiOsszeg * (1 - kuponKedvezmeny / 100)
                  );
                } else {
                  sorOsszeg = eredetiOsszeg;
                }
                return (
                  <li key={idx} className="flex justify-between items-start">
                    <div className="flex-1 pr-4">
                      <div className="font-medium text-sm break-words">
                        {termek.nev}
                      </div>
                      <div className="text-xs text-gray-300 mt-1">
                        Méret:{" "}
                        <span className="inline-block px-2 py-0.5 bg-gray-700 rounded">
                          {elem.meret}
                        </span>{" "}
                        &nbsp;•&nbsp; Darab: {elem.mennyiseg}
                      </div>
                    </div>

                    <div className="ml-4 flex-shrink-0 text-right">
                      <div className="text-sm font-semibold whitespace-nowrap">
                        {sorOsszeg.toLocaleString("hu-HU")} {penznem}
                        {kuponKedvezmeny > 0 && (
                          <span className="block text-xs text-red-400 line-through">
                            {eredetiOsszeg.toLocaleString("hu-HU")} {penznem}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 border-t border-gray-700 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-300">Tételek összege</span>
                <span className="font-medium">
                  {(() => {
                    let osszeg = 0;
                    kosarAdat.forEach((elem) => {
                      const termek = termekek.find((t) => t._id === elem._id);
                      if (!termek) return;
                      let eredetiOsszeg;
                      if (
                        termek.akcios &&
                        new Date(termek.akcioVege.slice(0, 10)) > Date.now() &&
                        new Date(termek.akcioKezdet.slice(0, 10)) < Date.now()
                      ) {
                        eredetiOsszeg = termek.akciosAr * elem.mennyiseg;
                      } else {
                        eredetiOsszeg = termek.ar * elem.mennyiseg;
                      }
                      if (kuponKedvezmeny > 0) {
                        osszeg += Math.floor(
                          eredetiOsszeg * (1 - kuponKedvezmeny / 100)
                        );
                      } else {
                        osszeg += eredetiOsszeg;
                      }
                    });
                    return osszeg.toLocaleString("hu-HU");
                  })()}{" "}
                  {penznem}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Szállítás</span>
                {kosarAdat.length > 0 ? (
                  <span className="font-medium">
                    {szallitasiDij.toLocaleString("hu-HU")} {penznem}
                  </span>
                ) : (
                  <span className="font-medium">0 {penznem}</span>
                )}
              </div>
              {kuponKedvezmeny > 0 && (
                <div className="flex justify-between text-sm text-green-400 font-semibold">
                  <span>Kuponkedvezmény ({kuponKedvezmeny}%)</span>
                  <span>
                    -
                    {(() => {
                      let kedvezmeny = 0;
                      kosarAdat.forEach((elem) => {
                        const termek = termekek.find((t) => t._id === elem._id);
                        if (!termek) return;
                        let eredetiOsszeg;
                        if (
                          termek.akcios &&
                          new Date(termek.akcioVege.slice(0, 10)) >
                            Date.now() &&
                          new Date(termek.akcioKezdet.slice(0, 10)) < Date.now()
                        ) {
                          eredetiOsszeg = termek.akciosAr * elem.mennyiseg;
                        } else {
                          eredetiOsszeg = termek.ar * elem.mennyiseg;
                        }
                        kedvezmeny += Math.floor(
                          eredetiOsszeg * (kuponKedvezmeny / 100)
                        );
                      });
                      return kedvezmeny.toLocaleString("hu-HU");
                    })()}{" "}
                    {penznem}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold pt-2">
                <span>Végösszeg</span>
                <span>
                  {(() => {
                    let osszeg = 0;
                    kosarAdat.forEach((elem) => {
                      const termek = termekek.find((t) => t._id === elem._id);
                      if (!termek) return;
                      let eredetiOsszeg;
                      if (
                        termek.akcios &&
                        new Date(termek.akcioVege.slice(0, 10)) > Date.now() &&
                        new Date(termek.akcioKezdet.slice(0, 10)) < Date.now()
                      ) {
                        eredetiOsszeg = termek.akciosAr * elem.mennyiseg;
                      } else {
                        eredetiOsszeg = termek.ar * elem.mennyiseg;
                      }
                      if (kuponKedvezmeny > 0) {
                        osszeg += Math.floor(
                          eredetiOsszeg * (1 - kuponKedvezmeny / 100)
                        );
                      } else {
                        osszeg += eredetiOsszeg;
                      }
                    });
                    return (
                      osszeg + (kosarAdat.length > 0 ? szallitasiDij : 0)
                    ).toLocaleString("hu-HU");
                  })()}{" "}
                  {penznem}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              value={kuponKod}
              onChange={(e) => setKuponKod(e.target.value)}
              placeholder="Kuponkód"
              className="flex-1 p-2 rounded-lg bg-gray-700 text-white"
            />
            {!kuponKedvezmeny && (
              <button
                type="button"
                onClick={kuponEllenorzes}
                className="px-4 py-2 bg-green-600 rounded-lg text-white"
              >
                Alkalmaz
              </button>
            )}
            {kuponKedvezmeny > 0 && (
              <button
                type="button"
                onClick={kuponTorles}
                className="px-4 py-2 bg-red-600 rounded-lg text-white"
              >
                Törlés
              </button>
            )}
          </div>
          {kuponUzenet && (
            <p className="text-sm text-red-400 mt-2">{kuponUzenet}</p>
          )}
          <div className="mt-6">
            <p className="text-gray-400">Fizetési mód:</p>
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setFizetesiMod("Készpénz")}
                className={`px-4 py-2 rounded-lg ${
                  fizetesiMod === "Készpénz"
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-200"
                }`}
              >
                Készpénz
              </button>
              <button
                type="button"
                onClick={() => setFizetesiMod("stripe")}
                className={`px-4 py-2 rounded-lg ${
                  fizetesiMod === "stripe"
                    ? "bg-green-600 text-white"
                    : "bg-gray-600 text-gray-200"
                }`}
              >
                Bankkártya (Stripe)
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="w-full mt-8 py-3 bg-blue-600 rounded-xl text-white text-lg font-semibold"
          >
            Rendelés leadása
          </button>
        </div>
      </div>
    </form>
  );
};

export default RendelésElküldés;
