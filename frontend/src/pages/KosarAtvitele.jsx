import React, { useState, useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

const KosarAtvitele = () => {
  const felhasznaloId = sessionStorage.getItem("felhasznaloId");
  const kosarElemek = JSON.parse(sessionStorage.getItem("kosarElemek"));
  const [feldolgozas, setFeldolgozas] = useState(false);

  const [uzenet, setUzenet] = useState("");
  const navigacio = useNavigate();

  const { backendUrl, setBejelentkezve, felhasznaloAdatLekerdez,setKosarElemek } =
    useContext(GlobalContext);

  async function kuldesValasztast(opcio) {
    setFeldolgozas(true);
    setUzenet("");

    try {
      let valasz
      if(sessionStorage.getItem("kosarElemek")){
        valasz= await axios.post(
        backendUrl + "/api/kocsi/kosar-atvitele",
        {
          felhasznaloId: felhasznaloId,
          opcio: opcio,
          kosarElemek: JSON.parse(sessionStorage.getItem("kosarElemek")),
        }
      );
      }
      else{
      valasz = await axios.post(
        backendUrl + "/api/kocsi/kosar-atvitele",
        {
          felhasznaloId: felhasznaloId,
          opcio: opcio,
          kosarElemek: kosarElemek,
        }
      );
    }
      if (valasz.data.siker) {
        setUzenet("Siker: " + (valasz.data.uzenet || "A választás elküldve."));
        sessionStorage.removeItem("felhasznaloId")
        navigacio("/");
        localStorage.removeItem("vendegKosar");
        sessionStorage.removeItem("kosarElemek")
        window.location.reload()
        
      } else {
        setUzenet(valasz.data.uzenet);
      }
      setFeldolgozas(false);
    } catch (err) {
      setUzenet(err.message);
      setFeldolgozas(false);
    }
  }

  useEffect(() => {
    if (!felhasznaloId) {
      navigacio("/");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-xl w-full">
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h1 className="text-2xl font-semibold mb-4">Kosár</h1>
          <p className="text-gray-700 mb-6">
            A kosárban vannak már bepakolt elmek, válasszon, hogy mi legyen
            velük.
            <br />
            Válasszon az alábbi lehetőségek közül:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
            <button
              className="px-3 py-2 rounded-lg border border-gray-200 hover:shadow-sm"
              onClick={() => kuldesValasztast("felulir")}
              disabled={feldolgozas}
            >
              Felülír
              <div className="text-xs text-gray-500">
                Az új termékek fognak csak bekerülni a kosárba!
              </div>
            </button>

            <button
              className="px-3 py-2 rounded-lg border border-gray-200 hover:shadow-sm"
              onClick={() => kuldesValasztast("kiegeszit")}
              disabled={feldolgozas}
            >
              Kiegészít
              <div className="text-xs text-gray-500">
                A meglévőhöz hozzáadjuk az újakat!
              </div>
            </button>

            <button
              className="px-3 py-2 rounded-lg border border-red-400 hover:shadow-sm text-red-600"
              onClick={() => kuldesValasztast("elvet")}
              disabled={feldolgozas}
            >
              Elvet
              <div className="text-xs text-gray-500">
                Nem adjuk hozzá az új termékeket!
              </div>
            </button>
          </div>

          {uzenet && (
            <div className="text-sm p-3 rounded-lg bg-gray-100">{uzenet}</div>
          )}
        </div>
      </div>
    </div>
  );
}
export default KosarAtvitele