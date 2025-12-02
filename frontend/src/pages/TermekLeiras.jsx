import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import { assets } from "../assets/assets";
import HasonloTermekek from "../components/HasonloTermekek";
import axios from "axios";
import { toast } from "react-toastify";

const TermekLeiras = () => {
  const [egyKepMegjelenit, setEgyKepMegjelenit] = useState(false);
  const [egyKep, setEgyKep] = useState(null);
  const { termekId } = useParams();
  const {
    termekek,
    penznem,
    kosarhozAdas,
    felhasznaloAdat,
    termekekLekerdez,
    backendUrl,
  } = useContext(GlobalContext);
  const [termekAdat, setTermekAdat] = useState(null);
  const [meret, setMeret] = useState("");
  const [aktivFül, setAktivFül] = useState("leiras");
  const [velemenySzoveg, setVelemenySzoveg] = useState("");
  const [ertekeles, setErtekeles] = useState(0);

  const [velemenyModositas, setVelemenyModositas] = useState(false);

  const velemenySzerkesztesIndit = (velemeny) => {
    setVelemenyModositas(true);
    setVelemenySzoveg(velemeny.velemeny);
    setErtekeles(velemeny.ertekeles);
  };

  const velemenyTorles = async () => {
    try {
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(
        `${backendUrl}/api/termek/velemeny-torles`,
        { termekId: termekAdat._id }
      );
      if (valasz.data.siker) {
        window.location.reload();
        toast.success(valasz.data.uzenet);
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const termekAdatLekerdez = () => {
    const talalat = termekek.find((p) => p._id === termekId);
    if (talalat) {
      setTermekAdat(talalat);
      setMeret("");
    }
  };

  const velemenyKuld = async (e) => {
    e.preventDefault();
    if (ertekeles <= 0) {
      return toast.error("Kérjük értékelj!");
    }

    try {
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(
        `${backendUrl}/api/termek/velemeny-hozzaadas`,
        {
          ertekeles: ertekeles,
          velemeny: velemenySzoveg,
          termekId: termekAdat._id,
        }
      );

      if (valasz.data.siker) {
        setVelemenySzoveg("");
        setErtekeles(0);
        termekAdatLekerdez();
        window.location.reload();
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    termekAdatLekerdez();
  }, [termekId, termekek]);

  useEffect(() => {
    termekekLekerdez();
    window.scrollTo(0, 0);
  }, []);
  if (!termekAdat) return <div className="opacity-0"></div>;

  const marErtekelt = termekAdat.velemenyek?.some(
    (velemeny) => velemeny.felhasznaloId === felhasznaloAdat?._id
  );

  return (
    <div className="min-h-screen bg-gray-900 pt-10">
      {egyKepMegjelenit && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
          onClick={() => setEgyKepMegjelenit(false)}
        >
          <img
            src={egyKep}
            alt="Nagyított termékkép"
            className="max-w-3xl max-h-[80vh] rounded-lg shadow-2xl border-4 border-white"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            className="absolute top-8 right-8 text-white text-3xl font-bold bg-black bg-opacity-60 rounded-full px-4 py-2 hover:bg-opacity-80"
            onClick={() => setEgyKepMegjelenit(false)}
          >
            ✕
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row gap-12">
        <div
          className={`grid gap-3 self-start content-start ${
            termekAdat.kepek.length === 1
              ? "grid-cols-1"
              : "grid-cols-1 sm:grid-cols-2"
          }`}
        >
          {termekAdat.kepek.map((item, idx) => (
            <img
              key={idx}
              src={item}
              className={`w-full h-auto cursor-zoom-in hover:scale-105 transition-transform duration-200 mx-auto ${
                termekAdat.kepek.length === 1
                  ? " max-w-[800px]"
                  : " max-w-[400px]"
              }`}
              alt=""
              onClick={() => {
                setEgyKepMegjelenit(true);
                setEgyKep(item);
              }}
            />
          ))}
        </div>

        <div className="flex-1 text-white">
          <h1 className="font-medium text-2xl mt-2">{termekAdat.nev}</h1>

          <div className="flex items-center gap-1 mt-2">
            {termekAdat.velemenyek.length !== 0 ? (
              <>
                <p className="mt-5 text-3xl font-medium">Értékelés: </p>
                <p className="mt-5 text-3xl font-medium">
                  {(
                    termekAdat.velemenyek.reduce(
                      (sum, velemenyek) => sum + velemenyek.ertekeles,
                      0
                    ) / termekAdat.velemenyek.length
                  ).toFixed(2)}
                </p>
              </>
            ) : (
              <>
                <p className="mt-5 text-3xl font-medium">Értékelés: </p>
                <p className="mt-5 text-3xl font-medium">-</p>
              </>
            )}
            <img src={assets.star_icon} alt="star" className="mt-4" />
          </div>

          {termekAdat.akcios &&
          new Date(termekAdat.akcioVege.slice(0, 10)) > Date.now() &&
          new Date(termekAdat.akcioKezdet.slice(0, 10)) < Date.now() ? (
            <p className="mt-1 text-red-500 font-semibold text-3xl font-medium">
              <span className="line-through text-gray-400 mt-5 mr-4">
                {termekAdat.ar.toLocaleString("hu-HU")} {penznem}
              </span>
              {termekAdat.akciosAr.toLocaleString("hu-HU")} {penznem}
            </p>
          ) : (
            <p className="mt-5 text-3xl font-medium">
              {termekAdat.ar.toLocaleString("hu-HU")} {penznem}
            </p>
          )}

          <div className="flex flex-col gap-4 my-8">
            <p className="text-gray-200">Válasszon méretet!</p>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {termekAdat.meretek.map((item, idx) => {
                const kifogyott = item.mennyiseg === 0;
                const aktiv = String(item.meret) === String(meret);

                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (!kifogyott) setMeret(item.meret);
                    }}
                    disabled={kifogyott}
                    aria-disabled={kifogyott}
                    title={
                      kifogyott
                        ? "Ez a méret elfogyott"
                        : `Válassza a ${item.meret} méretet`
                    }
                    className={`w-full border py-2 px-4 bg-gray-700 text-center ${
                      aktiv ? "border-blue-400" : ""
                    } ${
                      kifogyott
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:border-blue-300"
                    }`}
                  >
                    {item.meret}
                  </button>
                );
              })}
            </div>

            {(() => {
              const kivalasztott = termekAdat.meretek.find(
                (s) => String(s.meret) === String(meret)
              );
              if (!kivalasztott) return null;
              if (kivalasztott.mennyiseg < 4) {
                return (
                  <p className="text-sm text-yellow-300 mt-2">
                    <strong>{kivalasztott.mennyiseg}</strong> darab van ebből a
                    méretből!
                  </p>
                );
              }
              return null;
            })()}
          </div>

          <button
            onClick={() => {
              if (!meret) {
                toast.error("Kérjük, válasszon méretet!");
                return;
              }
              kosarhozAdas(termekAdat._id, meret);
            }}
            className="bg-blue-500 text-white px-8 py-3 text-sm hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            KOSÁRBA
          </button>
          <hr className="mt-8 sm:w-4/5 border-gray-700" />
          <div className="mt-5">
            <div className="max-w-2xl mx-auto">
              <div className="flex gap-4">
                <button
                  onClick={() => setAktivFül("leiras")}
                  className={`px-4 py-2 text-sm ${
                    aktivFül === "leiras"
                      ? "border-b-2 border-white text-white"
                      : "text-gray-400"
                  }`}
                >
                  Leírás
                </button>
                <button
                  onClick={() => setAktivFül("velemenyek")}
                  className={`px-4 py-2 text-sm ${
                    aktivFül === "velemenyek"
                      ? "border-b-2 border-white text-white"
                      : "text-gray-400"
                  }`}
                >
                  Vélemények ({termekAdat.velemenyek?.length || 0})
                </button>
              </div>

              {aktivFül === "leiras" && (
                <div className="mt-4 border px-4 py-4 text-sm text-gray-400 rounded">
                  <p className="leading-6 text-justify">{termekAdat.leiras}</p>
                </div>
              )}

              {aktivFül === "velemenyek" && (
                <div className="mt-4 text-gray-200">
                  {felhasznaloAdat && (
                    <div className="mb-6">
                      {!marErtekelt ? (
                        <div className="mt-6 border p-3 rounded-lg bg-gray-800">
                          <p className="font-semibold mb-2 text-sm">
                            Írd meg a véleményed:
                          </p>
                          <textarea
                            value={velemenySzoveg}
                            onChange={(e) => setVelemenySzoveg(e.target.value)}
                            className="w-full h-20 p-2 rounded bg-gray-900 text-gray-100 focus:outline-none text-sm"
                            placeholder="Írd ide a véleményed..."
                          />
                          <div className="flex items-center gap-2 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <img
                                key={i}
                                onClick={() => setErtekeles(i + 1)}
                                src={
                                  i < ertekeles
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                                }
                                alt="star"
                                className="w-5 cursor-pointer"
                              />
                            ))}
                          </div>
                          <button
                            type="button"
                            onClick={velemenyKuld}
                            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                          >
                            Küldés
                          </button>
                        </div>
                      ) : (
                        !velemenyModositas && (
                          <p className="mt-6 text-gray-400 text-sm">
                            Köszönjük, hogy már értékelted a terméket!
                          </p>
                        )
                      )}

                      {velemenyModositas && (
                        <div className="mt-6 border p-3 rounded-lg bg-gray-800">
                          <p className="font-semibold mb-2 text-sm">
                            Írd meg a véleményed:
                          </p>
                          <textarea
                            value={velemenySzoveg}
                            onChange={(e) => setVelemenySzoveg(e.target.value)}
                            className="w-full h-20 p-2 rounded bg-gray-900 text-gray-100 focus:outline-none text-sm"
                            placeholder="Írd ide a véleményed..."
                          />
                          <div className="flex items-center gap-2 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <img
                                key={i}
                                onClick={() => setErtekeles(i + 1)}
                                src={
                                  i < ertekeles
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                                }
                                alt="star"
                                className="w-5 cursor-pointer"
                              />
                            ))}
                          </div>
                          <div className="mt-3 flex items-center gap-3">
                            <button
                              type="button"
                              onClick={velemenyKuld}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm"
                            >
                              Módosítás
                            </button>
                            <button
                              type="button"
                              onClick={() => setVelemenyModositas(false)}
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded text-sm"
                            >
                              Mégse
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {termekAdat.velemenyek.length !== 0 ? (
                    <div className="flex flex-col gap-6 mb-6">
                      {velemenyModositas
                        ? null
                        : (() => {
                            const sajatId = felhasznaloAdat?._id;
                            const sajatVelemeny = termekAdat.velemenyek.find(
                              (v) => v.felhasznaloId === sajatId
                            );
                            const tobbiVelemeny = termekAdat.velemenyek
                              .filter((v) => v.felhasznaloId !== sajatId)
                              .sort(
                                (a, b) => new Date(b.datum) - new Date(a.datum)
                              );
                            const rendezettVelemenyek = sajatVelemeny
                              ? [sajatVelemeny, ...tobbiVelemeny]
                              : tobbiVelemeny;
                            return rendezettVelemenyek.map((velemeny) => (
                              <div
                                key={velemeny._id}
                                className="border-b pb-4 pl-4"
                              >
                                <div className="flex items-center gap-3">
                                  <p className="font-semibold text-sm">
                                    {velemeny.nev}
                                  </p>
                                  {[...Array(5)].map((_, i) => (
                                    <img
                                      key={i}
                                      src={
                                        i < velemeny.ertekeles
                                          ? assets.star_icon
                                          : assets.star_dull_icon
                                      }
                                      className="w-4"
                                      alt="star"
                                    />
                                  ))}
                                </div>

                                <p className="mt-2 text-gray-200 text-sm">
                                  {velemeny.velemeny}
                                </p>

                                <div className="mt-3 flex items-center justify-between">
                                  <p className="text-xs text-gray-400">
                                    {new Date(velemeny.datum).toLocaleString()}
                                  </p>

                                  {velemeny.felhasznaloId ===
                                    felhasznaloAdat._id && (
                                    <div className="flex items-center gap-3">
                                      <button
                                        onClick={() =>
                                          velemenySzerkesztesIndit(velemeny)
                                        }
                                        className="text-sm text-blue-400 hover:underline"
                                      >
                                        Módosítás
                                      </button>
                                      <button
                                        onClick={() =>
                                          velemenyTorles(velemeny._id)
                                        }
                                        className="text-sm text-red-500 hover:underline"
                                      >
                                        Törlés
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            ));
                          })()}
                    </div>
                  ) : (
                    <div className="flex flex-col gap-6 mb-6">
                      <p className="text-white">
                        Még nincs értékelés ehhez a termékhez.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <HasonloTermekek
        kategoria={termekAdat.kategoria}
        tipus={termekAdat.tipus}
        id={termekAdat._id}
      />
    </div>
  );
};

export default TermekLeiras;
