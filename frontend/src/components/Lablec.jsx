import React from "react";
import { assets } from "../assets/assets";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram} from "react-icons/fa";

const Lablec = () => {


  return (
    <footer className="bg-gray-900 text-gray-200 pt-10 border-t border-gray-700 relative">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <div>
          <NavLink to="/">
            <img src={assets.sneaky_logo} alt="Logo" className="mb-5 w-32" />
          </NavLink>
          <p className="text-gray-400 text-sm leading-relaxed">
            Fedezd fel a legújabb cipőket, prémium minőségben és gyors
            szállítással! Célunk, hogy minden lépésed stílusos legyen.
          </p>

          <div className="flex space-x-4 mt-5 text-gray-400">
            <a
              href="https://facebook.com"
              className="hover:text-blue-400 transition-colors duration-200"
            >
              <FaFacebookF />
            </a>
            <a
              href="https://instagram.com"
              className="hover:text-pink-400 transition-colors duration-200"
            >
              <FaInstagram />
            </a>
          
          </div>
        </div>

        <div>
          <h4 className="text-blue-400 text-lg font-medium mb-5">Cég</h4>
          <ul className="space-y-2">
            <li>
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-sm block transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-blue-400"
                  }`
                }
              >
                Kezdőlap
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/rolunk"
                className={({ isActive }) =>
                  `text-sm block transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-blue-400"
                  }`
                }
              >
                Rólunk
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/szallitas"
                className={({ isActive }) =>
                  `text-sm block transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-blue-400"
                  }`
                }
              >
                Szállítás
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/altalanos-szerzodesi-feltetelek"
                className={({ isActive }) =>
                  `text-sm block transition-colors duration-200 ${
                    isActive
                      ? "text-blue-400"
                      : "text-gray-400 hover:text-blue-400"
                  }`
                }
              >
                Általános Szerződési Feltételek
              </NavLink>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-blue-400 text-lg font-medium mb-5">Segítség</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>
              <NavLink
                to="/gyik"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Gyakori kérdések
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/visszakuldes-csere"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Visszaküldés és csere
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/adatvedelmi-nyilatkozat"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                Adatvédelmi Nyilatkozat
              </NavLink>
            </li>
            <li>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-blue-400 text-lg font-medium mb-5">Elérhetőség</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li>+36 70 555 6987</li>
            <li>
              <a
                href="mailto:sneakshoes@sh.com"
                className="hover:text-blue-400 transition-colors duration-200"
              >
                sneakshoes@sh.com
              </a>
            </li>
            <li>Hétfő–Péntek: 9:00–18:00, Szo 09:00–13:00</li>
            <li>Székhely: 9021 Győr, Baross Gábor út 31.</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-700 text-center text-xs text-gray-500 py-6">
        <p>© 2025 SneakShoes - Minden jog fenntartva.</p>
      </div>

   
    </footer>
  );
};

export default Lablec;
