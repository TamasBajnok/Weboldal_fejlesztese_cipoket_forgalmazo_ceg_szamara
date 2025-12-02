import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const GlobalContext = createContext();

const GlobalContextProvider = (props) => {
  const penznem = "Ft";
  const szallitasiDij = 2000;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [kereses, setKereses] = useState("");
  const [keresesMegjelenites, setKeresesMegjelenites] = useState(false);
  const [kosarElemek, setKosarElemek] = useState({});
  const [termekek, setTermekek] = useState([]);
  const [bejelentkezve, setBejelentkezve] = useState(false);
  const [felhasznaloAdat, setFelhasznaloAdat] = useState(false);

  const navigacio = useNavigate();
  axios.defaults.withCredentials = true;


  const authAllapotLekerdez = async () => {
    try {
      const { data } = await axios.get(
        `${backendUrl}/api/felhasznalo/hitelesitve`
      );
      if (data.siker) {
        setBejelentkezve(true);
        felhasznaloAdatLekerdez();
        felhasznaloKosarLekerdez();
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const felhasznaloAdatLekerdez = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/felhasznalo/adatok`);
      console.log(data);
      data.siker
        ? setFelhasznaloAdat(data.felhasznaloAdat)
        : toast.error(data.uzenet);
    } catch (error) {
      toast.error(error.uzenet);
    }
  };


  const kosarhozAdas = async (termekId, meret) => {
    if (!meret) {
      toast.error("Válassz méretet!");
      return;
    }

    let kosarAdatok = structuredClone(kosarElemek);
    if (typeof kosarAdatok !== "object" || kosarAdatok === null) {
      kosarAdatok = {};
    }
    if (
      typeof kosarAdatok[termekId] !== "object" ||
      kosarAdatok[termekId] === null
    ) {
      kosarAdatok[termekId] = {};
    }
    if (kosarAdatok[termekId][meret]) {
      kosarAdatok[termekId][meret] += 1;
    } else {
      kosarAdatok[termekId][meret] = 1;
    }
    setKosarElemek(kosarAdatok);

    if (felhasznaloAdat) {
      try {
        console.log(termekId, meret);
        const { data } = await axios.post(`${backendUrl}/api/kocsi/hozzaadas`, {
          termekId: termekId,
          meret: meret,
        });
        if (data.siker) {
          toast.success(data.uzenet);
        } else {
          toast.error(data.uzenet);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const kosarDarabszam = () => {
    let osszesen = 0;
    for (const termek in kosarElemek) {
      for (const meret in kosarElemek[termek]) {
        if (kosarElemek[termek][meret] > 0) {
          osszesen += kosarElemek[termek][meret];
        }
      }
    }
    return osszesen;
  };


  const kosarOsszeg = () => {
    let osszeg = 0;
    let frissKosar = { ...kosarElemek };
    let valtozott = false;

    for (const termek in kosarElemek) {
      let termekAdat = termekek.find((t) => t._id === termek);
      if (!termekAdat) {
        delete frissKosar[termek];
        valtozott = true;
        continue;
      }

      for (const meret in kosarElemek[termek]) {
        if (kosarElemek[termek][meret] > 0) {
          if (
            termekAdat.isDiscounted &&
            new Date(termekAdat.akcioVege.slice(0, 10)) > Date.now() &&
            new Date(termekAdat.akcioKezdet.slice(0, 10)) < Date.now()
          ) {
            osszeg += termekAdat.akciosAr * kosarElemek[termek][meret];
          } else {
            osszeg += termekAdat.ar * kosarElemek[termek][meret];
          }
        }
      }
    }

    if (valtozott) setKosarElemek(frissKosar);
    return osszeg;
  };


  const mennyisegFrissit = async (termekId, meret, mennyiseg) => {
    let kosarAdatok = structuredClone(kosarElemek);
    kosarAdatok[termekId][meret] = mennyiseg;
    setKosarElemek(kosarAdatok);

    if (felhasznaloAdat) {
      try {
        await axios.post(`${backendUrl}/api/kocsi/frissites`, {
          termekId: termekId,
          meret: meret,
          mennyiseg: mennyiseg,
        });
      } catch (error) {
        toast.error(error.message);
      }
    }
  };


  const termekekLekerdez = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/termek/lista`);
      if (data.siker) {
        setTermekek(data.termekek.reverse());
        return data.termekek;
      } else {
        toast.error(data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };


  const felhasznaloKosarLekerdez = async () => {
    try {
      const { data } = await axios.post(`${backendUrl}/api/kocsi/lekeres`);
      if (data.siker) {
        setKosarElemek(data.kosarAdatok);
      }
    } catch (error) {
      toast.error(error.uzenet);
    }
  };


  const kosarSzinkronizal = async () => {
    if (!felhasznaloAdat || !felhasznaloAdat._id) return;
    const termekIdLista = Object.keys(kosarElemek);
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/kocsi/kocsi-torles`,
        {
          termekIdLista,
        }
      );
      kosarOsszeg();
      if (data.siker) {
        setKosarElemek(data.kosarAdatok);

        if (data.uzenet) toast.info(data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    termekekLekerdez();


    const folyamatban = sessionStorage.getItem("felhasznaloId");
    if (!folyamatban) {
      authAllapotLekerdez();
    }
  }, [bejelentkezve]);


  useEffect(() => {
    const mentettKosar = localStorage.getItem("vendegKosar");
    if (mentettKosar && !bejelentkezve) {
      try {
        setKosarElemek(JSON.parse(mentettKosar));
      } catch (err) {
        console.error("Kosár betöltési hiba:", err);
        localStorage.removeItem("vendegKosar");
      }
    }
  }, []);


  useEffect(() => {

    if (!bejelentkezve && Object.keys(kosarElemek).length > 0) {
      localStorage.setItem("vendegKosar", JSON.stringify(kosarElemek));
    }
  }, [kosarElemek, bejelentkezve]);

  
  const ertek = {
    termekek,
    penznem,
    szallitasiDij,
    kereses,
    setKereses,
    keresesMegjelenites,
    setKeresesMegjelenites,
    kosarElemek,
    kosarhozAdas,
    kosarDarabszam,
    mennyisegFrissit,
    kosarOsszeg,
    navigacio,
    backendUrl,
    setKosarElemek,
    authAllapotLekerdez,
    felhasznaloAdat,
    felhasznaloAdatLekerdez,
    bejelentkezve,
    setBejelentkezve,
    setFelhasznaloAdat,
    termekekLekerdez,
    kosarSzinkronizal,
  };

  return (
    <GlobalContext.Provider value={ertek}>
      {props.children}
    </GlobalContext.Provider>
  );
};

export default GlobalContextProvider;
