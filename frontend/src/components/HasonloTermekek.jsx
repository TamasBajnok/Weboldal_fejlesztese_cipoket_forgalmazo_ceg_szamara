import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import TermekKinalo from "./TermekKinalo";

const HasonloTermekek = ({ kategoria, tipus, id }) => {
  const { termekek } = useContext(GlobalContext);
  const [hasonlo, setHasonlo] = useState([]);

  useEffect(() => {
    if (termekek.length > 0) {
      let termekekMasolat = termekek.slice();
      termekekMasolat = termekekMasolat.filter(
        (termek) => kategoria === termek.kategoria
      );
      termekekMasolat = termekekMasolat.filter(
        (termek) => tipus === termek.tipus
      );
      termekekMasolat = termekekMasolat.filter((termek) => termek._id !== id);
      setHasonlo(termekekMasolat.slice(0, 5));
    }
  }, [termekek, kategoria, tipus, id]);

  return (
    <>
      {hasonlo.length > 0 && (
        <div className="mt-24 bg-[#0e0e11] text-white py-10 rounded-xl">
          <div className="text-center text-3xl py-2">
            <div className='inline-flex gap-2 items-center mb-3'>
          <p className='text-gray-400'>HASONLÓ <span className='text-white font-semibold'>TERMÉKEK</span></p>
          <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500'></p>
          </div>

          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6 px-4">
            {hasonlo.map((termek, index) => (
              <TermekKinalo
                key={index}
                termekId={termek._id}
                nev={termek.nev}
                ar={termek.ar}
                kepek={termek.kepek}
                akcios={termek.akcios}
                akciosAr={termek.akciosAr}
                akcioKezdet={termek.akcioKezdet}
                akcioVege={termek.akcioVege}
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
        </div>
      )}
    </>
  );
};

export default HasonloTermekek;
