import React, { useContext, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { Link } from "react-router-dom";
import { assets } from "../assets/assets";

const TermekKinalo = ({
  termekId,
  kepek,
  nev,
  ar,
  akcios,
  akciosAr,
  akcioKezdet,
  akcioVege,
  marka,
  velemenyek,
  ertekeles,
}) => {
  const { penznem } = useContext(GlobalContext);
  const [felette, setFelette] = useState(false);

  return (
    <Link
      to={`/termek/${termekId}`}
      className="sm:mx-0 group block bg-gray-800 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200 border border-blue-400 border-4 rounded-m"
    >
      <div className="relative overflow-hidden h-48">
        <img
          onMouseEnter={() => setFelette(true)}
          onMouseLeave={() => setFelette(false)}
          src={felette && kepek.length > 1 ? kepek[1] : kepek[0]}
          alt={nev}
          className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
        />

        {akcios &&
          new Date(akcioVege.slice(0, 10)) > Date.now() &&
          new Date(akcioKezdet.slice(0, 10)) < Date.now() && (
            <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg z-10">
              -{Math.round(100 - (akciosAr / ar) * 100)}%
            </div>
          )}
      </div>

      <div className="p-4 bg-gray-900">
        <div className="flex items-center justify-between mb-2">
          <p className="text-blue-400 text-xl font-bold">{marka}</p>
          <p className="text-gray-300 font-semibold">
            Vélemények: {velemenyek} db
          </p>
        </div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-gray-100 font-medium truncate">{nev}</h3>
          {ertekeles === "NaN" ? (
            <p className="text-white font-semibold">Értékelés: Nincs</p>
          ) : (
            <div className="flex">
              <p className="text-white font-semibold">Értékelés: {ertekeles}</p>{" "}
              <img src={assets.star_icon} className="h-5" alt="star" />
            </div>
          )}
        </div>
        {akcios &&
        new Date(akcioVege.slice(0, 10)) > Date.now() &&
        new Date(akcioKezdet.slice(0, 10)) < Date.now() ? (
          <p className="mt-1 text-red-500 font-semibold">
            <span className="line-through text-gray-400 mr-3">
              {ar.toLocaleString("hu-HU")} {penznem}
            </span>
            {akciosAr.toLocaleString("hu-HU")} {penznem}
          </p>
        ) : (
          <p className="mt-1 text-gray-300">
            {ar.toLocaleString("hu-HU")} {penznem}
          </p>
        )}
      </div>
    </Link>
  );
};

export default TermekKinalo;
