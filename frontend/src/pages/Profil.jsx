import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { assets } from "../assets/assets";
import axios from "axios";
import { toast } from "react-toastify";
import { NavLink } from "react-router-dom";

const Profil = () => {
  const [lathato1, setLathato1] = useState(false);
  const [lathato2, setLathato2] = useState(false);
  const [lathato3, setLathato3] = useState(false);
  const [cimMegjelenit, setCimMegjelenit] = useState(false);
  const [toltes, setToltes] = useState(true);
  const { felhasznaloAdat, felhasznaloAdatLekerdez, backendUrl } =
    useContext(GlobalContext);
  const [cimTorlesIndex, setCimTorlesIndex] = useState(null);

  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [profilKep, setProfilKep] = useState("");
  const [regiJelszo, setRegiJelszo] = useState("");
  const [ujJelszo, setUjJelszo] = useState("");
  const [ujJelszoUjra, setUjJelszoUjra] = useState("");
  const [kepUzenet, setKepUzenet] = useState("");

  const [urlapAdat, setUrlapAdat] = useState({
    nev: "",
    iranyitoszam: "",
    varos: "",
    utca: "",
    telefon: "",
  });
  const [ketlepcsos, setKetlepcsos] = useState(false);
  const [hitelesitett, setHitelesitett] = useState(false);

  const urlapValtozas = (e) => {
    const nev = e.target.name;
    let ertek = e.target.value;

    if (nev === "iranyitoszam" || nev === "telefon") {
      ertek = ertek.replace(/\D/g, "");
    }

    setUrlapAdat((adat) => ({ ...adat, [nev]: ertek }));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const init = async () => {
      if (!felhasznaloAdat) {
        await felhasznaloAdatLekerdez();
      }
      if (felhasznaloAdat) {
        setNev(felhasznaloAdat.nev || "");
        setEmail(felhasznaloAdat.email || "");
        setUrlapAdat({
          nev: "",
          iranyitoszam: "",
          varos: "",
          utca: "",
          telefon: "",
        });
        setKetlepcsos(felhasznaloAdat.ketlepcsosHitelesites);
        setHitelesitett(felhasznaloAdat.fiokEllenorizve);
      }
      setCimMegjelenit(false);
      setToltes(false);
    };
    init();
  }, [felhasznaloAdat, felhasznaloAdatLekerdez]);

  const urlapBekuldes = async (e) => {
    e.preventDefault();

    if (nev === "") return toast.error("Üres a név mező!");
    if (email === "") return toast.error("Üres az email mező!");
    if (regiJelszo === "" && ujJelszo !== "")
      return toast.error("Adja meg a régi jelszavát!");
    if (regiJelszo !== "" && ujJelszo === "")
      return toast.error("Adja meg az új jelszavát!");
    if (ujJelszo !== ujJelszoUjra)
      return toast.error("Eltérés az új jelszó megadásánál!");
    if (ujJelszo.length < 8 && regiJelszo !== "")
      return toast.error("Túl rövid jelszó (min. 8 karakter)!");

    const cimHianyos =
      (cimMegjelenit &&
        Object.values(urlapAdat).every((value) => value.trim() === "")) ||
      !cimMegjelenit;

    if (
      Object.values(urlapAdat).some((value) => value.trim() === "") &&
      cimMegjelenit
    ) {
      toast.error("Tölts ki minden mezőt az új cím hozzáadásához!");
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(
        `${backendUrl}/api/felhasznalo/profil-frissites`,
        {
          nev: nev,
          email: email,
          regiJelszo: regiJelszo,
          ujJelszo: ujJelszo,
          cim: cimHianyos ? null : urlapAdat,
          ketlepcsosHitelesites: ketlepcsos,
        }
      );

      if (valasz.data.siker) {
        setRegiJelszo("");
        setUjJelszo("");
        setUjJelszoUjra("");
        await felhasznaloAdatLekerdez();
        toast.success(valasz.data.uzenet);
        window.scrollTo(0, 0);
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const cimTorles = async (index) => {
    try {
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(
        `${backendUrl}/api/felhasznalo/cim-torles`,
        {
          index: index,
        }
      );
      if (valasz.data.siker) {
        await felhasznaloAdatLekerdez();
        setCimTorlesIndex(null);
        toast.success(valasz.data.uzenet);
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (toltes) return <div className="text-white">Betöltés...</div>;

  return (
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
        <p className="mt-5 text-center font-bold text-5xl text-gray-100">
          Profil beállítások
        </p>
        <div className="mt-6 mx-auto center border-2 border-gray-600 w-[70%]">
          <hr />
        </div>

        <form
          onSubmit={urlapBekuldes}
          className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-5 gap-4 text-gray-100"
        >
          <div className="flex flex-col items-center">
            <div className="w-[200px] h-[200px] flex justify-center items-center rounded-full bg-blue-700 border-4 border-white text-white text-7xl">
              {felhasznaloAdat.nev[0].toUpperCase()}
            </div>
          </div>
          <p className="mt-5 text-center font-bold text-3xl">Felhasználó név</p>
          <input
            onChange={(e) => setNev(e.target.value)}
            type="text"
            className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
            value={nev}
          />
          <div className="mt-6 mx-auto center border-2 border-gray-600 w-full">
            <hr />
          </div>
          <p className="mt-5 text-center text-3xl font-bold">Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
            value={email}
          />
          <div className="mt-6 mx-auto center border-2 border-gray-600 w-full">
            <hr />
          </div>
          <p className="mt-5 text-center text-3xl font-bold">
            Kétlépcsős belépés
          </p>
          <div className="w-full mt-4 flex flex-col items-center">
            <div
              className={`flex items-center gap-4 ${
                !hitelesitett ? "opacity-50" : ""
              }`}
            >
              {ketlepcsos ? (
                <span className="text-xl font-medium">Bekapcsolva</span>
              ) : (
                <span className="text-xl font-medium">Kikapcsolva</span>
              )}
              <button
                type="button"
                onClick={() => setKetlepcsos(!ketlepcsos)}
                className={`relative inline-flex items-center h-8 w-14 rounded-full p-1 transition-all ${
                  ketlepcsos ? "bg-blue-400" : "bg-gray-400"
                }`}
                aria-pressed={ketlepcsos}
                aria-label="Kétlépcsős belépés váltása"
                disabled={!hitelesitett}
              >
                <span
                  className={`inline-block h-6 w-6 transform rounded-full bg-white shadow-md transition-transform ${
                    ketlepcsos ? "translate-x-6" : "translate-x-0"
                  }`}
                ></span>
              </button>
            </div>
            {!hitelesitett && (
              <p className="mt-2 text-sm text-gray-300">
                Ehhez a funkcióhoz hitelesítenie kell az email címét!
              </p>
            )}
          </div>

          <div className="mt-6 mx-auto center border-2 border-gray-600 w-full">
            <hr />
          </div>
          <p className="mt-5 text-center text-3xl font-bold">
            Jelszó módosítás
          </p>
          <p className="mt-5 text-center text-2xl">Régi jelszó</p>
          <div className="relative w-full  text-black">
            <input
              onChange={(e) => setRegiJelszo(e.target.value)}
              type={lathato1 ? "text" : "password"}
              placeholder="Régi jelszó"
              value={regiJelszo}
              className=" text-xl w-full pl-4 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none"
            />
            <img
              onClick={() => setLathato1(!lathato1)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[10%] h-50"
              src={lathato1 ? assets.not_visible_eye : assets.visible_eye}
              alt=""
            />
          </div>

          <p className="mt-5 text-center text-2xl">Új jelszó</p>
          <div className="relative w-full  text-black">
            <input
              onChange={(e) => setUjJelszo(e.target.value)}
              type={lathato2 ? "text" : "password"}
              placeholder="Új jelszó"
              value={ujJelszo}
              className="text-xl w-full pl-4 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none"
            />
            <img
              onClick={() => setLathato2(!lathato2)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[10%] h-50"
              src={lathato2 ? assets.not_visible_eye : assets.visible_eye}
              alt=""
            />
          </div>

          <p className="mt-5 text-center text-2xl">Jelszó megerősítés</p>
          <div className="relative w-full  text-black">
            <input
              onChange={(e) => setUjJelszoUjra(e.target.value)}
              type={lathato3 ? "text" : "password"}
              placeholder="Jelszó megerősítés"
              value={ujJelszoUjra}
              className="text-xl w-full pl-4 pr-10 py-3 rounded-full border border-gray-300 focus:outline-none"
            />
            <img
              onClick={() => setLathato3(!lathato3)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[10%] h-50"
              src={lathato3 ? assets.not_visible_eye : assets.visible_eye}
              alt=""
            />
          </div>

          <div className="mt-6 mx-auto center border-2 border-gray-600 w-full">
            <hr />
          </div>
          <p className="mt-5 text-center text-3xl font-bold">Szállítási cím</p>

          {felhasznaloAdat.cim && felhasznaloAdat.cim.length > 0 && (
            <div className="bg-gray-800 p-4 rounded-2xl text-white text-center mb-4 w-full">
              <p className="text-2xl font-semibold mb-4">
                Mentett szállítási címek:
              </p>
              {felhasznaloAdat.cim.map((cim, index) => (
                <div
                  key={index}
                  className="bg-gray-700 p-3 rounded-xl mb-3 flex justify-between items-center"
                >
                  <div className="text-left">
                    <p className="font-semibold">Név: {cim.nev}</p>
                    <p>
                      Cím:{cim.iranyitoszam}, {cim.varos} {cim.utca}
                    </p>
                    <p>Telefonszám: {cim.telefon}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setCimTorlesIndex(index)}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-full"
                  >
                    Törlés
                  </button>
                </div>
              ))}
            </div>
          )}

          {cimTorlesIndex !== null && (
            <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
              <div className="bg-white text-black rounded-2xl p-6 w-[90%] max-w-md text-center">
                <p className="text-xl font-semibold mb-4">
                  Biztosan törlöd ezt a szállítási címet?
                </p>
                <div className="flex justify-center gap-6 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      cimTorles(cimTorlesIndex);
                      setCimTorlesIndex(null);
                    }}
                    className="bg-red-500 hover:bg-red-600 text-white font-semibold px-6 py-2 rounded-full"
                  >
                    Igen
                  </button>
                  <button
                    type="button"
                    onClick={() => setCimTorlesIndex(null)}
                    className="bg-gray-300 hover:bg-gray-400 text-black font-semibold px-6 py-2 rounded-full"
                  >
                    Nem
                  </button>
                </div>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCimMegjelenit(!cimMegjelenit)}
            className="bg-blue-400 text-black font-light px-8 py-4 w-60 rounded-full mb-5 text-xl"
          >
            {cimMegjelenit ? "Mégse" : "Új cím +"}
          </button>

          {cimMegjelenit && (
            <>
              <input
                onChange={urlapValtozas}
                name="nev"
                value={urlapAdat.nev}
                className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
                placeholder="Név"
                type="text"
              />
              <input
                onChange={urlapValtozas}
                name="iranyitoszam"
                value={urlapAdat.iranyitoszam}
                className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
                placeholder="Irányítószám"
                type="text"
              />
              <input
                onChange={urlapValtozas}
                name="varos"
                value={urlapAdat.varos}
                className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
                placeholder="Város"
                type="text"
              />
              <input
                onChange={urlapValtozas}
                name="utca"
                value={urlapAdat.utca}
                className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
                placeholder="Utca név"
                type="text"
              />
              <input
                onChange={urlapValtozas}
                name="telefon"
                value={urlapAdat.telefon}
                className="w-full px-3 py-3 border border-gray-800 text-center rounded-full text-xl text-black"
                onKeyDown={(e) => {
                  if (
                    !/[0-9]/.test(e.key) &&
                    e.key !== "Backspace" &&
                    e.key !== "Tab"
                  ) {
                    e.preventDefault();
                  }
                }}
                placeholder="Telefonszám"
                type="text"
              />
            </>
          )}

          <div className="mt-6 flex flex-col sm:flex-row justify-between gap-8 text-3xl">
            <NavLink
              to="/"
              className="bg-blue-400 text-black font-light px-8 py-4 w-40 cursor-pointer"
            >
              Mégse
            </NavLink>
            <button
              className="bg-blue-400 text-black font-light px-8 py-4 w-40"
              type="submit"
            >
              Mentés
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profil;
