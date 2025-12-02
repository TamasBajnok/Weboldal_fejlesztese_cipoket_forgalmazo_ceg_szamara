import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { assets } from "../assets/assets";
import { useLocation, useNavigate } from "react-router-dom";

const Kereso = () => {
  const { kereses, setKereses, keresesMegjelenites, setKeresesMegjelenites } =
    useContext(GlobalContext);
  const [tervez, seTervez] = useState(kereses || "");
  const navigate = useNavigate();
  const hely = useLocation();


  useEffect(() => {
    seTervez(kereses || "");
  }, [kereses]);

  const handleChange = (e) => {
    seTervez(e.target.value);
   
  };
  
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const formaz = tervez.trim();
      setKereses(formaz);
      if (formaz) {
        setKeresesMegjelenites(true);
        if (!hely.pathname.includes("kinalat")) {
          navigate("/kinalat");
        }
      } else {
        setKeresesMegjelenites(false);
      }
    }
  };

  const handleClear = () => {
    seTervez("");
    setKereses("");
  };

   if (!keresesMegjelenites) return null;


   const nincsKeresesOldalak = ["/email-ellenorzes", "/jelszo-visszaallitas", "/ketfaktor", "/kosar-atvitele"];

if (nincsKeresesOldalak.some((path) => hely.pathname.includes(path))) {
  return null;
}
  return (
    <div className="bg-gray-900 text-gray-200  mt-5 mb-5 mx-20 lg:m-0">
      <div className="w-full flex items-center bg-gray-800 border border-gray-700 rounded-full px-3 py-1">
        <input
          type="text"
          placeholder="Keresés (nyomj Enter-t)"
          value={tervez}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500 focus:ring-0 text-gray-200"
        />
  
          <button
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors"
            aria-label="Törlés"
          >
            <img onClick={()=>setKeresesMegjelenites(!keresesMegjelenites)} src={assets.cross_icon} alt="Bezár" className="w-4 h-4" />
          </button>
      </div>
    </div>
  );
};

export default Kereso;
