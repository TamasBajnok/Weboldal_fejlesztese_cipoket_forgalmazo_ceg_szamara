import React, { useContext } from "react";
import { Routes, Route } from "react-router-dom";
import Kezdolap from "./pages/Kezdolap";
import Kinalat from "./pages/Kinalat";
import Rolunk from "./pages/Rolunk";
import Elerhetoseg from "./pages/Elerhetoseg";
import TermekLeiras from "./pages/TermekLeiras";
import Kocsi from "./pages/Kocsi";
import BelepesEsRegisztracio from "./pages/BelepesEsRegisztracio";
import RendelésElküldés from "./pages/RendelésElküldés";
import LeadottRendelesek from "./pages/LeadottRendelesek";
import Menuszalag from "./components/Menuszalag";
import Lablec from "./components/Lablec";
import Kereso from "./components/Kereso";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FizetesHitelesitese from "./pages/FizetesHitelesitese";
import EmailHitelesitese from "./pages/EmailHitelesitese";
import JelszoVisszaallitas from "./pages/JelszoVisszaallitas";
import Profil from "./pages/Profil";
import EgyRendelesTermekei from "./pages/EgyRendelesTermekei";
import KetlepcsosAzonositas from "./pages/KetlepcsosAzonositas";
import { GlobalContext } from "./context/GlobalContext";
import Szallitas from "./pages/Szallitas";
import ASZF from "./pages/ASZF";
import KosarAtvitele from "./pages/KosarAtvitele";
import GyakoriKerdesek from "./pages/GYIK";
import Visszakuldes from "./pages/Visszakuldes";
import AdatvedelemiNyilatkozat from "./pages/AdatvedelmiNyilatkozat";

const App = () => {
  const { kosarElemek, felhasznaloAdat } = useContext(GlobalContext);
  const nincsKocsi = Object.values(kosarElemek).some((meretek) =>
    Object.values(meretek).some((mennyiseg) => mennyiseg > 0)
  );

  return (
    <div>
      <ToastContainer />
      <Menuszalag />
      <Routes>
        <Route path="/" element={<Kezdolap />} />
        <Route path="/kinalat" element={<Kinalat />} />
        <Route path="/rolunk" element={<Rolunk />} />
        <Route path="/elerhetoseg" element={<Elerhetoseg />} />
        <Route path="/termek/:termekId" element={<TermekLeiras />} />
        <Route path="/kosar" element={<Kocsi />} />
        <Route path="/szallitas" element={<Szallitas />} />
        <Route path="/altalanos-szerzodesi-feltetelek" element={<ASZF />} />

        <Route path="/bejelentkezes" element={<BelepesEsRegisztracio />} />
        {felhasznaloAdat && nincsKocsi ? (
          <Route path="/rendeles" element={<RendelésElküldés />} />
        ) : null}

        {felhasznaloAdat ? (
          <Route path="/korabbi-rendelesek" element={<LeadottRendelesek />} />
        ) : null}

        <Route path="/hitelesites" element={<FizetesHitelesitese />} />
        <Route path="/email-ellenorzes" element={<EmailHitelesitese />} />
        <Route path="/jelszo-visszaallitas" element={<JelszoVisszaallitas />} />
        {felhasznaloAdat ? <Route path="/profil" element={<Profil />} /> : null}
        {felhasznaloAdat ? (
          <Route
            path="/korabbi-rendelesek/:rendelesId"
            element={<EgyRendelesTermekei />}
          />
        ) : null}

        <Route path="/ketfaktor" element={<KetlepcsosAzonositas />} />
        {sessionStorage.getItem("kosarElemek") ? (
          <Route path="/kosar-atvitele" element={<KosarAtvitele />} />
        ) : null}
        <Route path="/gyik" element={<GyakoriKerdesek />} />
        <Route path="/visszakuldes-csere" element={<Visszakuldes />} />
        <Route
          path="/adatvedelmi-nyilatkozat"
          element={<AdatvedelemiNyilatkozat />}
        />
      </Routes>
      <Lablec />
    </div>
  );
};

export default App;
