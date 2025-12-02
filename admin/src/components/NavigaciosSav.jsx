import React, { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { User } from "lucide-react";
import { backendUrl } from "../App";

const NavigaciosSav = ({ setBejelentkezve }) => {
  const [mobilMenuNyitva, setMobilMenuNyitva] = useState(false);
  const [felhasznaloMenuNyitva, setFelhasznaloMenuNyitva] = useState(false);
  const felhasznaloMenuRef = useRef(null);

  const kijelentkezes = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/admin-kilepes`
      );
      if (data.siker) setBejelentkezve(false);
    } catch (hiba) {
      toast.error(hiba.message);
    }
  };

  useEffect(() => {
    function kezelesKivulKattintasra(e) {
      if (
        felhasznaloMenuRef.current &&
        !felhasznaloMenuRef.current.contains(e.target)
      ) {
        setFelhasznaloMenuNyitva(false);
      }
    }
    if (felhasznaloMenuNyitva) {
      document.addEventListener("mousedown", kezelesKivulKattintasra);
    }
    return () => {
      document.removeEventListener("mousedown", kezelesKivulKattintasra);
    };
  }, [felhasznaloMenuNyitva]);

  return (
    <div className="flex items-center py-2 px-[4%] justify-between bg-gray-800 border-b border-gray-700 shadow-md relative">
      <div className="flex items-center gap-6 flex-1">
        <Link to="/">
          <img
            className="w-[100px] cursor-pointer"
            src={assets.logo}
            alt="Logo"
          />
        </Link>
        <div className="hidden md:flex gap-3 text-sm">
          <NavLink
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition"
            to="/uj-termek"
          >
            <p>Termék hozzáadása</p>
          </NavLink>
          <NavLink
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition"
            to="/termek-lista"
          >
            <p>Terméklista</p>
          </NavLink>
          <NavLink
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition"
            to="/rendelesek"
          >
            <p>Rendelések</p>
          </NavLink>
          <NavLink
            className="flex items-center gap-2 px-4 py-2 rounded-md text-white hover:bg-gray-700 transition"
            to="/kupon"
          >
            <p>Kuponok</p>
          </NavLink>
        </div>
      </div>

      <div className="flex items-center relative">
        <div ref={felhasznaloMenuRef} className="relative">
          <button
            onClick={() => setFelhasznaloMenuNyitva((nyitva) => !nyitva)}
            className="ml-2 flex items-center justify-center w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 text-white focus:outline-none"
          >
            <User size={24} />
          </button>
          {felhasznaloMenuNyitva && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded shadow-lg z-50 py-2">
              <button
                onClick={kijelentkezes}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 font-semibold"
              >
                Kijelentkezés
              </button>
            </div>
          )}
        </div>
        <button
          className="md:hidden ml-2 text-white focus:outline-none"
          onClick={() => setMobilMenuNyitva(!mobilMenuNyitva)}
        >
          <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
            <path
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {mobilMenuNyitva && (
        <div className="absolute top-full right-0 w-full bg-gray-800 z-50 flex flex-col items-start p-4 gap-2 md:hidden shadow-lg">
          <NavLink
            className="text-white py-2 px-4 w-full rounded hover:bg-gray-700"
            to="/uj-termek"
            onClick={() => setMobilMenuNyitva(false)}
          >
            Termék hozzáadása
          </NavLink>
          <NavLink
            className="text-white py-2 px-4 w-full rounded hover:bg-gray-700"
            to="/termek-lista"
            onClick={() => setMobilMenuNyitva(false)}
          >
            Terméklista
          </NavLink>
          <NavLink
            className="text-white py-2 px-4 w-full rounded hover:bg-gray-700"
            to="/rendelesek"
            onClick={() => setMobilMenuNyitva(false)}
          >
            Rendelések
          </NavLink>
          <NavLink
            className="text-white py-2 px-4 w-full rounded hover:bg-gray-700"
            to="/kupon"
            onClick={() => setMobilMenuNyitva(false)}
          >
            Kuponok
          </NavLink>
        </div>
      )}
    </div>
  );
};

export default NavigaciosSav;
