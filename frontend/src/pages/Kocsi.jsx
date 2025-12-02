import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { assets } from "../assets/assets";
import { toast } from "react-toastify";
import axios from "axios";

const Kocsi = () => {
  const {
    termekek,
    penznem,
    kosarElemek,
    mennyisegFrissit,
    navigacio,
    kosarOsszeg,
    szallitasiDij,
    felhasznaloAdat,
    termekekLekerdez,
    kosarSzinkronizal
  } = useContext(GlobalContext);

  const [kosarAdat, setKosarAdat] = useState([]);

  useEffect(() => {
    if (termekek.length > 0) {
      const ideiglenesAdat = [];
      for (const elemId in kosarElemek) {
        for (const meret in kosarElemek[elemId]) {
          if (kosarElemek[elemId][meret] > 0) {
            ideiglenesAdat.push({
              _id: elemId,
              meret: meret,
              mennyiseg: kosarElemek[elemId][meret],
            });
          }
        }
      }
      setKosarAdat(ideiglenesAdat);
    }
  }, [kosarElemek, termekek]);

  useEffect(() => {
    window.scrollTo(0, 0);
    kosarSzinkronizal()
  }, []);

  const mennyisegValtoztat = (id, meret, ujMennyiseg) => {
    if (ujMennyiseg < 1) return;
    mennyisegFrissit(id, meret, ujMennyiseg);
  };

  const keszletEllenorzes = async () => {
    const frissTermekek = await termekekLekerdez();
    if (!frissTermekek || frissTermekek.length === 0) {
      toast.error("Hiba: termékadatok nem érhetők el. Kérlek próbáld újra.");
      return false;
    }

    const ideiglenesAdat = [];
    for (const elemId in kosarElemek) {
      for (const meret in kosarElemek[elemId]) {
        if (kosarElemek[elemId][meret] > 0) {
          ideiglenesAdat.push({
            _id: elemId,
            meret: meret,
            mennyiseg: kosarElemek[elemId][meret],
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

      const meretAdat = termek.meretek.find((m) => m.meret === k.meret);
      if (!meretAdat) {
        toast.error(
          `${termek.nev}: a kiválasztott méret (${k.meret}) már nem elérhető.`
        );
        return false;
      }

      const elerheto = meretAdat.mennyiseg;
      if (elerheto < k.mennyiseg) {
        toast.error(
          `${termek.nev}, Méret: (${k.meret}) esetében nincs raktáron ennyi darab!`
        );
        return false;
      }
    }

    return true;
  };

  const tovabbARendeleshez = async () => {
    if (!felhasznaloAdat) {
      toast.error("Bejelentkezés szükséges!");
      return;
    }
    if (kosarAdat.length === 0) {
      toast.error("A kosarad üres!");
      return;
    }

    const ok = await keszletEllenorzes();
    if (!ok) return;

    navigacio("/rendeles");
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-2xl mb-6">
        <div className='inline-flex gap-2 items-center mb-3'>
        <p className='text-gray-400'>BEVÁSÁRLÓKOCSI <span className='text-white font-semibold'>TARTALMA</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500'></p>
        </div>
        </div>

        <div className="space-y-6">
          {kosarAdat.map((elem, index) => {
            const termekAdat = termekek.find((t) => t._id === elem._id);
            if (!termekAdat) return null;

            return (
              <div
                key={index}
                className="py-4 border-t border-b bg-[#333A5C] text-gray-100 grid grid-cols-[4fr_1fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
              >
                <div className="flex items-start gap-6">
                  <img
                    className="w-16 sm:w-20"
                    src={termekAdat.kepek[0]}
                    alt={termekAdat.nev}
                  />
                  <div>
                    <p className="text-xs sm:text-lg font-medium">
                      {termekAdat.nev}
                    </p>
                    <div className="flex items-center gap-5 mt-2">
                      {termekAdat.akcios &&
                      new Date(termekAdat.akcioVege.slice(0, 10)) >
                        Date.now() &&
                      new Date(termekAdat.akcioKezdet.slice(0, 10)) <
                        Date.now() ? (
                        <p className="mt-1 text-red-500 font-semibold text-xs sm:text-lg font-medium">
                          <span className="line-through text-gray-400 mt-5 mr-4">
                            {termekAdat.ar.toLocaleString("hu-HU")} {penznem}
                          </span>
                          {termekAdat.akciosAr.toLocaleString("hu-HU")}{" "}
                          {penznem}
                        </p>
                      ) : (
                        <p className="mt-5 text-xs sm:text-lg font-medium">
                          {termekAdat.ar.toLocaleString("hu-HU")} {penznem}
                        </p>
                      )}
                      <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 text-gray-700">
                        {elem.meret}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => {
                      const ujMennyiseg = elem.mennyiseg - 1;
                      mennyisegValtoztat(elem._id, elem.meret, ujMennyiseg);
                    }}
                    className="px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
                    aria-label={`Csökkent ${termekAdat.nev} mennyiségét`}
                  >
                    −
                  </button>

                  <input
                    readOnly
                    value={elem.mennyiseg}
                    className="w-12 text-center border px-1 py-1 bg-[#333A5C] text-white rounded-md"
                    type="text"
                    aria-label="Mennyiség"
                  />

                  <button
                    onClick={() =>
                      mennyisegValtoztat(
                        elem._id,
                        elem.meret,
                        elem.mennyiseg + 1
                      )
                    }
                    className="px-2 py-1 rounded-md bg-gray-700 hover:bg-gray-600"
                    aria-label={`Növel ${termekAdat.nev} mennyiségét`}
                  >
                    +
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => mennyisegFrissit(elem._id, elem.meret, 0)}
                    className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-700"
                    aria-label={`Törli ${termekAdat.nev} tételt a kosárból`}
                  >
                    <span className="hidden sm:inline text-sm">Törlés</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex justify-end mt-10">
          <div className="w-full sm:w-[450px]">
            <div className="bg-gray-800 p-4 rounded-md text-gray-100">
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
                  if (
                    termek.akcios &&
                    new Date(termek.akcioVege.slice(0, 10)) > Date.now() &&
                    new Date(termek.akcioKezdet.slice(0, 10)) < Date.now()
                  ) {
                    sorOsszeg = termek.akciosAr * elem.mennyiseg;
                  } else {
                    sorOsszeg = termek.ar * elem.mennyiseg;
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

        let termekOsszeg = 0;
        if (
          termek.akcios &&
          new Date(termek.akcioKezdet.slice(0, 10)) < Date.now() &&
          new Date(termek.akcioVege.slice(0, 10)) > Date.now()
        ) {
          termekOsszeg = termek.akciosAr * elem.mennyiseg;
        } else {
          termekOsszeg = termek.ar * elem.mennyiseg;
        }

        osszeg += termekOsszeg;
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
              <div className="flex justify-between text-lg font-bold pt-2">
  <span>Végösszeg</span>
  <span>
    {(() => {
      let osszeg = 0;
      kosarAdat.forEach((elem) => {
        const termek = termekek.find((t) => t._id === elem._id);
        if (!termek) return;

        let termekOsszeg = 0;

        // Ellenőrzés, hogy van-e aktív akció
        if (
          termek.akcios &&
          new Date(termek.akcioKezdet.slice(0, 10)) < Date.now() &&
          new Date(termek.akcioVege.slice(0, 10)) > Date.now()
        ) {
          termekOsszeg = termek.akciosAr * elem.mennyiseg;
        } else {
          termekOsszeg = termek.ar * elem.mennyiseg;
        }


        osszeg += termekOsszeg;
      });
      if (kosarAdat.length > 0) {
        osszeg += szallitasiDij;
      }

      return osszeg.toLocaleString("hu-HU");
    })()}{" "}
    {penznem}
  </span>
</div>

              </div>
            </div>

            <div className="w-full text-end">
              <button
                onClick={tovabbARendeleshez}
                className="bg-gradient-to-r from-indigo-500 to-indigo-900 text-white text-sm my-8 px-8 py-3 rounded-full"
              >
                Tovább a fizetésre
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kocsi;
