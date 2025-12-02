import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import React, { useContext, useEffect } from "react";

const KetlepcsosAzonositas = () => {
  const hely = useLocation();
  const kosarElemek = JSON.parse(sessionStorage.getItem("kosarElemek"));
  const felhasznaloId = hely.state.felhasznaloId;
  const {
    backendUrl,
    setBejelentkezve,
    bejelentkezve,
    felhasznaloAdat,
    kosarDarabszam,
    felhasznaloAdatLekerdez,
  } = useContext(GlobalContext);

  const navigacio = useNavigate();

  const inputHivatkozasok = React.useRef([]);

  const kezeldInput = (e, index) => {
    const ertek = e.target.value;
    if (!/^[0-9]$/.test(ertek)) {
      e.target.value = "";
      return;
    }
    if (ertek.length > 0 && index < inputHivatkozasok.current.length - 1) {
      inputHivatkozasok.current[index + 1].focus();
    }
  };

  const kezeldBillentyuzet = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputHivatkozasok.current[index - 1].focus();
    }
  };

  const kezeldBeillesztes = (e) => {
    const beillesztett = e.clipboardData.getData("text");
    const beillesztettTomb = beillesztett.split("");
    beillesztettTomb.forEach((karakter, index) => {
      if (inputHivatkozasok.current[index]) {
        inputHivatkozasok.current[index].value = karakter;
      }
    });
  };

  const kezeldBekuldes = async (e) => {
    try {
      e.preventDefault();
      const otpTomb = inputHivatkozasok.current.map((e) => e.value);
      const otp = otpTomb.join("");
      const valasz = await axios.post(
        backendUrl + "/api/felhasznalo/ketlepcsos",
        {
          otp: otp,
          felhasznaloId: felhasznaloId,
        }
      );

      if (valasz.data.siker) {
        let felhasznaloKocsiDB;
        if (valasz.data.kocsi !== null) {
          felhasznaloKocsiDB = Object.values(valasz.data.kocsi)
            .flatMap((meretek) => Object.values(meretek))
            .reduce((osszeg, mennyiseg) => osszeg + mennyiseg, 0);
        } else {
          felhasznaloKocsiDB = 0;
        }
        toast.success(valasz.data.uzenet);
        if (kosarDarabszam() > 0 && felhasznaloKocsiDB > 0) {
          /*navigacio("/kosar-atvitele", {
            state: { felhasznaloId: valasz.data.felhasznaloId },
          });*/
          let ujKosarMasolat = structuredClone(kosarElemek);

          sessionStorage.setItem("felhasznaloId", valasz.data.felhasznaloId);
          //sessionStorage.setItem("ujKosarMasolat", ujKosarMasolat);
          navigacio("/kosar-atvitele");
          return;
        } else if (kosarDarabszam() > 0 && felhasznaloKocsiDB == 0) {
          const { data } = await axios.post(
            `${backendUrl}/api/kocsi/kosar-atvitele`,
            {
              felhasznaloId: valasz.data.felhasznaloId,
              opcio: "kiegeszit",
              kosarElemek: kosarElemek,
            }
          );
          if (data.siker) {
            navigacio("/");
            setBejelentkezve(true);
            felhasznaloAdatLekerdez();
            sessionStorage.removeItem("kosarElemek");
            localStorage.removeItem("vendegKosar");
          } else {
            toast.error(data.uzenet);
          }
        } else {
          setBejelentkezve(true);
          felhasznaloAdatLekerdez();
          navigacio("/");
          sessionStorage.removeItem("kosarElemek");
        }
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 text-sm"
        onSubmit={kezeldBekuldes}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email hitelesítése
        </h1>
        <p className="text-center mb-6 text-blue-400">
          Gépelje be az emailben megkapott 6 jegyű számot!
        </p>
        <div className="flex justify-between mb-8" onPaste={kezeldBeillesztes}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                pattern="[0-9]"
                key={index}
                required
                className="w-12 h-12 bg-white text-center text-black text-xl rounded-md focus:ring-2 focus:ring-black"
                ref={(e) => (inputHivatkozasok.current[index] = e)}
                onInput={(e) => kezeldInput(e, index)}
                onKeyDown={(e) => kezeldBillentyuzet(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-full">
          Küldés
        </button>
      </form>
    </div>
  );
};

export default KetlepcsosAzonositas;
