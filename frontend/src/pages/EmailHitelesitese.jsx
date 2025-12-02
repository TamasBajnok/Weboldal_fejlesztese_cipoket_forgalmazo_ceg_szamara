import React, { useContext, useEffect } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GlobalContext } from "../context/GlobalContext";
import { toast } from "react-toastify";

const EmailHitelesitese = () => {
  axios.defaults.withCredentials = true;
  const {
    bejelentkezve,
    felhasznaloAdat,
    felhasznaloAdatLekerdez,
    backendUrl,
  } = useContext(GlobalContext);

  const navigacio = useNavigate();

  const inputHivatkozasok = React.useRef([]);

  const kezeloInput = (e, index) => {
    if (!/^[0-9]$/.test(e.target.value)) {
      e.target.value = "";
      return;
    }
    if (
      e.target.value.length > 0 &&
      index < inputHivatkozasok.current.length - 1
    ) {
      inputHivatkozasok.current[index + 1].focus();
    }
  };

  const kezeloBillentyuzet = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputHivatkozasok.current[index - 1].focus();
    }
  };

  const kezeloBeillesztes = (e) => {
    const beillesztett = e.clipboardData.getData("text");
    const karakterTomb = beillesztett.split("");
    karakterTomb.forEach((karakter, index) => {
      if (inputHivatkozasok.current[index]) {
        inputHivatkozasok.current[index].value = karakter;
      }
    });
  };

  useEffect(() => {
    bejelentkezve &&
      felhasznaloAdat &&
      felhasznaloAdat.isAccountVerified &&
      navigacio("/");
  }, [bejelentkezve, felhasznaloAdat]);

  const bekuldesKezelo = async (e) => {
    try {
      e.preventDefault();
      const otpTomb = inputHivatkozasok.current.map((e) => e.value);
      const otp = otpTomb.join("");

      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/email-ellenorzes`,
        {
          otp,
        }
      );

      if (data.siker) {
        toast.success(data.uzenet);
        felhasznaloAdatLekerdez();
        navigacio("/");
      } else {
        toast.error(data.uzenet);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <form
        className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 text-sm"
        onSubmit={bekuldesKezelo}
      >
        <h1 className="text-white text-2xl font-semibold text-center mb-4">
          Email hitelesítése
        </h1>
        <p className="text-center mb-6 text-blue-400">
          Gépelje be az emailben megkapott 6 jegyű számot!
        </p>
        <div className="flex justify-between mb-8" onPaste={kezeloBeillesztes}>
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <input
                type="text"
                maxLength="1"
                key={index}
                required
                className="w-12 h-12 bg-white text-center text-black text-xl rounded-md focus:ring-2 focus:ring-black"
                ref={(e) => (inputHivatkozasok.current[index] = e)}
                onInput={(e) => kezeloInput(e, index)}
                onKeyDown={(e) => kezeloBillentyuzet(e, index)}
              />
            ))}
        </div>
        <button className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-full">
          Hitelesítés
        </button>
      </form>
    </div>
  );
};

export default EmailHitelesitese;
