import React, { useEffect, useState } from "react";
import NavigaciosSav from "./components/NavigaciosSav";
import Kezdolap from "./pages/Kezdolap";
import { Routes, Route } from "react-router-dom";
import UjTermek from "./pages/UjTermek";
import TermekLista from "./pages/TermekLista";
import Rendelesek from "./pages/Rendelesek";
import Bejelentkezes from "./pages/Bejelentkezes";
import TermekSzerkesztes from "./pages/TermekSzerkesztes";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import Kupon from "./pages/Kupon";
import EgyRendelesTermekek from "./pages/EgyRendelesReszletek";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const penznem = "Ft";

const App = () => {
  const [bejelentkezve, setBejelentkezve] = useState(false);

  const lekerAuthAllapot = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.get(
        `${backendUrl}/api/felhasznalo/admin-hitelesitve`
      );

      if (data.siker) {
        setBejelentkezve(true);
      }
    } catch (hiba) {
      toast.error(hiba.message);
    }
  };

  useEffect(() => {
    lekerAuthAllapot();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      {bejelentkezve === false ? (
        <Bejelentkezes beallitasBejelentkezve={setBejelentkezve} />
      ) : (
        <>
          <NavigaciosSav setBejelentkezve={setBejelentkezve} />
          <div className="w-[90%] mx-auto my-8 text-gray-600 text-base">
            <Routes>
              <Route path="/" element={<Kezdolap />} />
              <Route path="/uj-termek" element={<UjTermek />} />
              <Route path="/termek-lista" element={<TermekLista />} />
              <Route
                path="/rendelesek"
                element={<Rendelesek bejelentkezve={bejelentkezve} />}
              />
              <Route
                path="/termek-lista/:termekId"
                element={<TermekSzerkesztes />}
              />
              <Route path="/kupon" element={<Kupon />} />
              <Route
                path="/rendelesek/:rendelesId"
                element={<EgyRendelesTermekek />}
              />
            </Routes>
          </div>
        </>
      )}
    </div>
  );
};

export default App;
