import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GlobalContext } from "../context/GlobalContext";

const JelszoVisszaallitas = () => {
  axios.defaults.withCredentials = true;

  const navigacio = useNavigate();
  const [email, setEmail] = useState("");
  const [ujJelszo, setUjJelszo] = useState("");
  const [emailElkuldve, setEmailElkuldve] = useState(false);
  const [egyszeriKod, setEgyszeriKod] = useState("");
  const [kodEllenorizve, setKodEllenorizve] = useState(false);
  const [jelszoLathato, setJelszoLathato] = useState(false);
  const { backendUrl } = useContext(GlobalContext);

  const inputRefek = React.useRef([]);

  const kezeloBevitel = (e, index) => {
    const ertek = e.target.value;
    if (!/^[0-9]$/.test(ertek)) {
      e.target.value = "";
      return;
    }
    if (ertek.length > 0 && index < inputRefek.current.length - 1) {
      inputRefek.current[index + 1].focus();
    }
  };

  const kezeloBillentyu = (e, index) => {
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      inputRefek.current[index - 1].focus();
    }
  };

  const kezeloBeilleszt = (e) => {
    const beillesztett = e.clipboardData.getData("text");
    const tomb = beillesztett.split("");
    tomb.forEach((karakter, index) => {
      if (inputRefek.current[index]) {
        inputRefek.current[index].value = karakter;
      }
    });
  };

  const emailBekuldes = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/jelszo-visszaallitas-otp`,
        { email }
      );
      data.siker ? toast.success(data.uzenet) : toast.error(data.uzenet);
      data.siker && setEmailElkuldve(true);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const otpBekuldes = async (e) => {
    e.preventDefault();
    try {
      const kodTomb = inputRefek.current.map((e) => e.value);
      setEgyszeriKod(kodTomb.join(""));

      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/otp-ellenorzes`,
        { email, otp: kodTomb.join("") }
      );
      data.siker ? setKodEllenorizve(true) : toast.error(data.uzenet);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const ujJelszoBekuldes = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/felhasznalo/jelszo-visszaallitas`,
        { email, ujJelszo: ujJelszo }
      );
      data.siker ? toast.success(data.uzenet) : toast.error(data.uzenet);
      data.siker && navigacio("/bejelentkezes");
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <img
        onClick={() => navigacio("/")}
        src={assets.logo}
        alt=""
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer"
      />

      {!emailElkuldve && (
        <form
          onSubmit={emailBekuldes}
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[28rem] text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Jelszó visszaállítás
          </h1>
          <p className="text-center mb-6 text-blue-400">
            Írd be a regisztrált email címed!
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800">
            <img src={assets.mail_icon} alt="" className="w-6 h-6" />
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-600 rounded-md text-gray-900 placeholder-gray-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-full mt-3">
            Küldés
          </button>
        </form>
      )}

      {!kodEllenorizve && emailElkuldve && (
        <form
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-96 text-sm"
          onSubmit={otpBekuldes}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Egyszeri kód ellenőrzése
          </h1>
          <p className="text-center mb-6 text-blue-400">
            Írd be az email címedre küldött 6 jegyű számot!
          </p>
          <div className="flex justify-between mb-8" onPaste={kezeloBeilleszt}>
            {Array(6)
              .fill(0)
              .map((_, index) => (
                <input
                  type="text"
                  maxLength="1"
                  key={index}
                  required
                  className="w-12 h-12 bg-white text-black text-center text-xl rounded-md focus:ring-2 focus:ring-blue-500"
                  ref={(e) => (inputRefek.current[index] = e)}
                  onInput={(e) => kezeloBevitel(e, index)}
                  onKeyDown={(e) => kezeloBillentyu(e, index)}
                />
              ))}
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-full">
            Küldés
          </button>
        </form>
      )}

      {kodEllenorizve && emailElkuldve && (
        <form
          className="bg-gray-800 p-8 rounded-2xl shadow-lg w-[28rem] text-sm"
          onSubmit={ujJelszoBekuldes}
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">
            Új jelszó
          </h1>
          <p className="text-center mb-6 text-blue-400">
            Írd be az új jelszavad!
          </p>
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-gray-800">
            <img src={assets.lock_icon} alt="" className="w-3 h-3" />
            <div className="relative w-full  text-black">
              <input
                type={jelszoLathato ? "text" : "password"}
                placeholder="Jelszó"
                className="w-full px-4 py-3 border border-gray-600 rounded-md text-gray-900 placeholder-gray-400"
                value={ujJelszo}
                onChange={(e) => setUjJelszo(e.target.value)}
                required
              />
              <img
                onClick={() => setJelszoLathato(!jelszoLathato)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[10%] h-50 cursor-pointer"
                src={
                  jelszoLathato ? assets.not_visible_eye : assets.visible_eye
                }
                alt=""
              />
            </div>
          </div>
          <button className="w-full py-2.5 bg-gradient-to-r from-blue-400 to-blue-700 text-white rounded-full mt-3">
            Mentés
          </button>
        </form>
      )}
    </div>
  );
};

export default JelszoVisszaallitas;
