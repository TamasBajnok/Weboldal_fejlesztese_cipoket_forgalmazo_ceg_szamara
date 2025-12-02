import React, { useContext, useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link, NavLink } from "react-router-dom";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Search, ShoppingCart, User, X, Menu as MenuIcon } from "lucide-react";
import Kereso from "./Kereso";

const Menuszalag = () => {
  const { setKosarElemek, backendUrl } = useContext(GlobalContext);
  const [mobilMenuNyitva, setMobilMenuNyitva] = useState(false);
  const [profilMenuNyitva, setProfilMenuNyitva] = useState(false);
  const profilMenuRef = useRef(null);

  const {
    felhasznaloAdat,
    setKeresesMegjelenites,
    keresesMegjelenites,
    kosarDarabszam,
    navigacio,
    setBejelentkezve,
    setFelhasznaloAdat,
  } = useContext(GlobalContext);

  const ellenorizOtpKuldes = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/ellenorzo-otp-kuldes`
      );
      if (data.siker) {
        navigacio("/email-ellenorzes");
        toast.success(data.uzenet);
      } else {
        toast.error(data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const kijelentkezes = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/kilepes`
      );
      if (data.siker) {
        setBejelentkezve(false);
        setFelhasznaloAdat(false);
        navigacio("/");
        setKosarElemek({});
        toast.success(data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };
  useEffect(() => {
    const kezelesKattintasKivul = (event) => {
      if (
        profilMenuRef.current &&
        !profilMenuRef.current.contains(event.target)
      ) {
        setProfilMenuNyitva(false);
      }
    };
    if (profilMenuNyitva) {
      document.addEventListener("mousedown", kezelesKattintasKivul);
    } else {
      document.removeEventListener("mousedown", kezelesKattintasKivul);
    }
    return () => {
      document.removeEventListener("mousedown", kezelesKattintasKivul);
    };
  }, [profilMenuNyitva]);

  return (
    <nav className="bg-gray-900 text-gray-200 border-b border-gray-700">
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              className="navnal:hidden p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={() => setMobilMenuNyitva(true)}
              aria-label="Menü megnyitása"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div className="hidden navnal:flex sm:space-x-4">
              {[
                { to: "/", label: "KEZDŐLAP" },
                { to: "/kinalat", label: "KÍNÁLAT" },
                { to: "/rolunk", label: "RÓLUNK" },
                { to: "/elerhetoseg", label: "ELÉRHETŐSÉG" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-400"
                        : "text-gray-300 hover:text-blue-400"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0 lg:hidden">
            <Link to="/">
              <img src={assets.sneaky_logo} alt="Logo" className="w-28" />
            </Link>
          </div>

          <div className="hidden lg:block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:pointer-events-none lg:z-10">
            <Link to="/" className="pointer-events-auto">
              <img src={assets.sneaky_logo} alt="Logo" className="w-36" />
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <div className="hidden lg:block">
              <Kereso />
            </div>
            <button
              onClick={() => setKeresesMegjelenites(!keresesMegjelenites)}
              className="p-1 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Keresés"
            >
              <Search className="w-6 h-6" />
            </button>

            <div className="relative" ref={profilMenuRef}>
              {felhasznaloAdat ? (
                <div
                  id="profil-menu-gomb"
                  className="w-8 h-8 flex items-center justify-center bg-blue-600 rounded-full text-gray-100 cursor-pointer border-2 border-white"
                  onClick={() => setProfilMenuNyitva((prev) => !prev)}
                  tabIndex={0}
                  aria-label="Profil menü"
                >
                  {felhasznaloAdat.nev[0].toUpperCase()}
                </div>
              ) : (
                <button
                  onClick={() => navigacio("/bejelentkezes")}
                  className="p-1 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <User className="w-6 h-6" />
                </button>
              )}

              {felhasznaloAdat && profilMenuNyitva && (
                <div className="absolute right-0 mt-2 w-44 bg-gray-800 rounded-lg shadow-lg z-30">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setProfilMenuNyitva(false);
                        navigacio("/profil");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Profilom
                    </button>
                    <button
                      onClick={() => {
                        setProfilMenuNyitva(false);
                        navigacio("/korabbi-rendelesek");
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Rendelések
                    </button>
                    {!felhasznaloAdat.fiokEllenorizve && (
                      <button
                        onClick={() => {
                          setProfilMenuNyitva(false);
                          ellenorizOtpKuldes();
                        }}
                        className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                      >
                        Hitelesítés
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setProfilMenuNyitva(false);
                        kijelentkezes();
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-700"
                    >
                      Kijelentkezés
                    </button>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/kosar"
              className="relative p-1 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <ShoppingCart className="w-6 h-6" />
              <span className="absolute -bottom-1 -right-1 bg-blue-400 text-gray-900 text-xs font-semibold w-4 h-4 flex items-center justify-center rounded-full">
                {kosarDarabszam()}
              </span>
            </Link>
          </div>
        </div>
      </div>

      {mobilMenuNyitva && (
        <div className="fixed inset-0 z-50 flex">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setMobilMenuNyitva(false)}
            aria-hidden="true"
          />

          <div className="relative w-72 bg-gray-900 border-r border-gray-800 h-full shadow-xl overflow-y-auto">
            <div className="p-4 flex items-center justify-between">
              <Link to="/" onClick={() => setMobilMenuNyitva(false)}>
                <img src={assets.sneaky_logo} alt="Logo" className="w-32" />
              </Link>
              <button
                onClick={() => setMobilMenuNyitva(false)}
                className="p-2 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Bezár menü"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <nav className="px-4 space-y-1">
              {[
                { to: "/", label: "KEZDŐLAP" },
                { to: "/kinalat", label: "KÍNÁLAT" },
                { to: "/rolunk", label: "RÓLUNK" },
                { to: "/elerhetoseg", label: "ELÉRHETŐSÉG" },
              ].map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobilMenuNyitva(false)}
                  className={({ isActive }) =>
                    `block px-4 py-3 rounded-md text-base font-medium transition-colors duration-200 ${
                      isActive
                        ? "text-blue-400 bg-gray-800"
                        : "text-gray-300 hover:text-blue-400 hover:bg-gray-800"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}
      <div className="block lg:hidden">
        <Kereso />
      </div>
    </nav>
  );
};

export default Menuszalag;
