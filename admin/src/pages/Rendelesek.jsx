import React, { useEffect, useState } from "react";
import axios from "axios";
import { backendUrl, penznem } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";

const Rendelesek = ({ loggedIn } = {}) => {
  const [rendelesek, setRendelesek] = useState([]);
  const [szurtRendelesek, setSzurtRendelesek] = useState([]);

  const [honapNezet, setHonapNezet] = useState(() => {
    const most = new Date();
    return { ev: most.getFullYear(), honap: most.getMonth() };
  });

  const [mutatTorlesModal, setMutatTorlesModal] = useState(false);
  const [torlendoRendeles, setTorlendoRendeles] = useState(null);
  const [torlesFolyamatban, setTorlesFolyamatban] = useState(false);
  const navigal = useNavigate();

  const [kivalasztottDatum, setKivalasztottDatum] = useState(() => {
    const mentett = localStorage.getItem("rendelesSzurok");
    return mentett ? JSON.parse(mentett).kivalasztottNap : null;
  });

  const [statusSzuro, setStatusSzuro] = useState(() => {
    const mentett = localStorage.getItem("rendelesSzurok");
    return mentett ? JSON.parse(mentett).statuszSzuro : "Összes";
  });

  const formatLocalDate = (d) => {
    const date = new Date(d);
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const dd = String(date.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const napokSzama = (ev, honap) => new Date(ev, honap + 1, 0).getDate();

  const honapTabla = (ev, honap) => {
    const jsElsoNap = new Date(ev, honap, 1).getDay();
    const elsoHetNapja = (jsElsoNap + 6) % 7;
    const totalDays = napokSzama(ev, honap);
    const hetek = [];
    let nap = 1;
    while (nap <= totalDays) {
      const het = new Array(7).fill(null);
      for (let i = 0; i < 7 && nap <= totalDays; i++) {
        if (hetek.length === 0 && i < elsoHetNapja) {
          het[i] = null;
        } else {
          het[i] = new Date(ev, honap, nap);
          nap++;
        }
      }
      hetek.push(het);
    }
    while (hetek.length < 6) hetek.push(new Array(7).fill(null));
    return hetek;
  };

  const rendelesDatumSet = new Set(
    rendelesek.map((r) => formatLocalDate(r.datum))
  );

  const szuroAlkalmazas = (rendelesekToFilter = rendelesek) => {
    let eredmeny = rendelesekToFilter;
    if (kivalasztottDatum) {
      eredmeny = eredmeny.filter(
        (r) => formatLocalDate(r.datum) === kivalasztottDatum
      );
    }
    if (statusSzuro !== "Összes") {
      eredmeny = eredmeny.filter((r) => r.allapot === statusSzuro);
    }
    setSzurtRendelesek(eredmeny);
    return eredmeny;
  };

  const lekerMindent = async () => {
    if (loggedIn === false) return null;
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendUrl + "/api/rendeles/osszes", {});
      if (response.data.siker) {
        
        setRendelesek(response.data.rendelesek);
      } else {

        toast.error(response.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statuszValtoztatas = async (e, rendelesId) => {
    try {
      axios.defaults.withCredentials = true;
      const ujStatus = e.target.value;
      const response = await axios.post(backendUrl + "/api/rendeles/statusz", {
        rendelesId: rendelesId,
        allapot: ujStatus,
      });
      if (response.data.siker) {
        setRendelesek((elozo) => {
          const ujRendelesek = elozo.map((r) =>
            r._id === rendelesId ? { ...r, allapot: ujStatus } : r
          );
          szuroAlkalmazas(ujRendelesek);
          return ujRendelesek;
        });
        toast.success(response.data.uzenet);
      } else {
        toast.error(response.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const megnyitTorlesAblak = (rendeles) => {
    setTorlendoRendeles(rendeles._id);
    setMutatTorlesModal(true);
  };

  const bezarTorlesAblak = () => {
    setTorlendoRendeles(null);
    setMutatTorlesModal(false);
  };

  const fizetesiValtoztatas = async (e, id) => {
    const ujErtek = e.target.value === "Fizetve";
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(
        backendUrl + "/api/rendeles/fizetes",
        {
          rendelesId: id,
          fizetve: ujErtek,
        }
      );
      if (response.data.siker) {
        setRendelesek((elozo) => {
          const ujRendelesek = elozo.map((r) =>
            r._id === id ? { ...r, fizetve: ujErtek } : r
          );
          szuroAlkalmazas(ujRendelesek);
          return ujRendelesek;
        });
        toast.success("Fizetési státusz frissítve!");
      } else {
        toast.error(response.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const torlesRakerdez = async () => {
    if (!torlendoRendeles) return;
    setTorlesFolyamatban(true);
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(backendUrl + "/api/rendeles/torles", {
        rendelesId: torlendoRendeles,
      });
      if (response.data.siker) {
        setRendelesek((elozo) => {
          const ujRendelesek = elozo.filter((r) => r._id !== torlendoRendeles);
          szuroAlkalmazas(ujRendelesek);
          return ujRendelesek;
        });
        toast.success(response.data.uzenet);
        bezarTorlesAblak();
      } else {
        toast.error(response.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTorlesFolyamatban(false);
    }
  };

  useEffect(() => {
    lekerMindent();
  }, [loggedIn]);

  useEffect(() => {
    szuroAlkalmazas();
  }, [rendelesek, kivalasztottDatum, statusSzuro]);

  const elozoHonap = () => {
    setHonapNezet((elozo) => {
      const m = elozo.honap - 1;
      if (m < 0) return { ev: elozo.ev - 1, honap: 11 };
      return { ...elozo, honap: m };
    });
  };
  const kovetkezoHonap = () => {
    setHonapNezet((elozo) => {
      const m = elozo.honap + 1;
      if (m > 11) return { ev: elozo.ev + 1, honap: 0 };
      return { ...elozo, honap: m };
    });
  };

  useEffect(() => {
    localStorage.setItem(
      "rendelesSzurok",
      JSON.stringify({
        kivalasztottNap: kivalasztottDatum,
        statuszSzuro: statusSzuro,
      })
    );
  }, [kivalasztottDatum, statusSzuro]);

  return (
    <div className="p-4">
      <h3 className="text-xl font-semibold mb-4">Leadott rendelések</h3>
 
      <div className="grid grid-cols-1 md:grid-cols-[260px_1fr] gap-6">

        <div>
          <div className="bg-gray-800 p-3 rounded text-white">
            <div className="flex items-center justify-between mb-2">
              <button
                onClick={elozoHonap}
                className="px-2 py-1 bg-gray-700 rounded"
              >
                ◀
              </button>
              <div className="font-medium">
                {new Date(honapNezet.ev, honapNezet.honap).toLocaleString(
                  undefined,
                  { month: "long", year: "numeric" }
                )}
              </div>
              <button
                onClick={kovetkezoHonap}
                className="px-2 py-1 bg-gray-700 rounded"
              >
                ▶
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-xs text-center">
              {["Hé", "Ke", "Sze", "Cs", "Pé", "Szo", "Vas"].map((nap) => (
                <div key={nap} className="text-gray-400">
                  {nap}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1 mt-2">
              {honapTabla(honapNezet.ev, honapNezet.honap).map((het, hi) =>
                het.map((cella, ci) => {
                  if (!cella)
                    return <div key={`${hi}-${ci}`} className="h-10"></div>;
                  const napStr = formatLocalDate(cella);
                  const vanRendeles = rendelesDatumSet.has(napStr);
                  const kiválasztott = kivalasztottDatum === napStr;
                  return (
                    <button
                      key={`${hi}-${ci}`}
                      onClick={() => setKivalasztottDatum(napStr)}
                      className={`h-10 flex flex-col items-center justify-center rounded ${
                        kiválasztott
                          ? "bg-blue-600 text-white"
                          : "bg-gray-900 text-gray-200"
                      } hover:bg-blue-500`}
                    >
                      <span className="text-sm">{cella.getDate()}</span>
                      {vanRendeles && (
                        <span className="mt-1 w-2 h-2 rounded-full bg-yellow-400" />
                      )}
                    </button>
                  );
                })
              )}
            </div>

            <div className="mt-3 flex gap-2">
              <button
                onClick={() => setKivalasztottDatum(null)}
                className="flex-1 bg-gray-700 px-2 py-1 rounded text-sm"
              >
                Összes nap megjelenítése
              </button>
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center mb-4">
            <p className="text-xl text-black mr-4">Szűrés:</p>
            <select
              value={statusSzuro}
              onChange={(e) => setStatusSzuro(e.target.value)}
              className="bg-gray-800 px-2 py-1 rounded text-sm text-white"
            >
              <option value="Összes">Összes</option>
              <option value="Megrendelve">Megrendelve</option>
              <option value="Csomag összekészítése">
                Csomag összekészítése
              </option>
              <option value="Csomag elküldve">Csomag elküldve</option>
              <option value="Kiszállítás alatt">Kiszállítás alatt</option>
              <option value="Kiszállítva">Kiszállítva</option>
            </select>
          </div>

          <div className="space-y-3 text-black">
            {szurtRendelesek.length === 0 ? (
              <div className="p-4 bg-gray-200 rounded text-gray-600">
                Nincs rendelés
              </div>
            ) : (
              szurtRendelesek
                .slice()
                .reverse()
                .map((rendeles, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] lg:grid-cols-[1.5fr_1.5fr_1fr] gap-3 items-start border-2 border-gray-300 p-4 rounded bg-white"
                  >

                    <div>
                      <div className="mb-2">
                        <span>Rendelés azonosító:</span>
                        <span className="font-medium"> {rendeles._id}</span>
                      </div>
                      <p className="mt-2 mb-2">
                        Megrendelő neve:{" "}
                        <span className="font-medium">
                          {rendeles.cim.nev}
                        </span>
                      </p>
                      <p className="mt-2 mb-2">
                        Szállítási cím:{" "}
                        <span className="font-medium">
                          {rendeles.cim.iranyitoszam}, {rendeles.cim.varos}{" "}
                          {rendeles.cim.utca}
                        </span>
                      </p>
                      <p className="mt-2 mb-2">
                        Telefonszám:{" "}
                        <span className="font-medium">
                          {rendeles.cim.telefon}
                        </span>
                      </p>
                      <p className="mt-2">
                        Email cím:{" "}
                        <span className="font-medium">
                          {rendeles.cim.email}
                        </span>
                      </p>
                    </div>

                    <div>
                      <p className="mb-2">
                        Termékek darabszáma:{" "}
                        <span className="font-medium">
                          {rendeles.tetelek.reduce(
                            (sum, elem) => sum + elem.mennyiseg,
                            0
                          )}{" "}
                          db
                        </span>
                      </p>
                      <p className="mt-2 mb-2">
                        Fizetési mód:{" "}
                        <span className="font-medium">
                          {rendeles.fizetesiMod === "Stripe"
                            ? "Bankkártya"
                            : rendeles.fizetesiMod}
                        </span>
                      </p>

                      {rendeles.fizetesiMod === "Készpénz" ? (
                        <div className="mt-2 mb-2">
                          <span>Státusz: </span>
                          <select
                            className="text-sm rounded bg-gray-200 font-medium"
                            value={
                              rendeles.fizetve ? "Fizetve" : "Fizetésre vár"
                            }
                            onChange={(e) =>
                              fizetesiValtoztatas(e, rendeles._id)
                            }
                          >
                            <option value="Fizetésre vár">Fizetésre vár</option>
                            <option value="Fizetve">Fizetve</option>
                          </select>
                        </div>
                      ) : (
                        <div className="mt-2 mb-2">
                          <span>Státusz: </span>
                          <span className="font-medium">
                            {rendeles.fizetve ? "Fizetve" : "Fizetésre vár"}
                          </span>
                        </div>
                      )}

                      <p className="mt-2 mb-2">
                        Rendelés dátuma:{" "}
                        <span className="font-medium">
                          {new Date(rendeles.datum).toLocaleString()}
                        </span>
                      </p>
                      <p className="mt-2">
                        Végösszeg:{" "}
                        <span className="font-medium">
                          {rendeles.osszeg.toLocaleString("hu-HU")} {penznem}
                        </span>
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        onChange={(e) => statuszValtoztatas(e, rendeles._id)}
                        value={rendeles.allapot}
                        className="p-2 font-semibold bg-gray-800 rounded text-sm text-white"
                      >
                        <option value="Megrendelve">Megrendelve</option>
                        <option value="Csomag összekészítése">
                          Csomag összekészítése
                        </option>
                        <option value="Csomag elküldve">Csomag elküldve</option>
                        <option value="Kiszállítás alatt">
                          Kiszállítás alatt
                        </option>
                        <option value="Kiszállítva">Kiszállítva</option>
                      </select>
                      <button
                        onClick={() => megnyitTorlesAblak(rendeles)}
                        className="mt-2 px-3 py-1 rounded bg-red-600 text-white text-sm font-semibold hover:bg-red-700"
                      >
                        Törlés
                      </button>
                      <button
                        onClick={() => navigal(`/rendelesek/${rendeles._id}`)}
                        className="mt-2 bg-gray-800 text-white px-4 py-2 text-sm font-medium rounded hover:bg-gray-900 transition"
                      >
                        Részletek
                      </button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>

      {mutatTorlesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={bezarTorlesAblak}
          />

          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Biztos törlöd?</h3>
            <p className="text-sm text-gray-700 mb-4">
              {torlendoRendeles ? (
                <>
                  Biztos törölni szeretnéd ezt a rendelést? Ez a művelet nem
                  visszavonható!
                </>
              ) : (
                "Biztosan törölni szeretnéd a kiválasztott rendelést?"
              )}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={bezarTorlesAblak}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Mégse
              </button>
              <button
                onClick={torlesRakerdez}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold"
              >
                {torlesFolyamatban ? "Törlés..." : "Törlés"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rendelesek;
