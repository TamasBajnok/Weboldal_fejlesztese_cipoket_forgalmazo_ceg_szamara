import React, { useContext, useEffect, useState } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const BelepesEsRegisztracio = () => {
  const [aszfMegjelenit, setAszfMegjelenit] = useState(false);

  axios.defaults.withCredentials = true;

  const [aktualisAllapot, setAktualisAllapot] = useState("Bejelentkezés");
  const {
    navigacio,
    setBejelentkezve,
    felhasznaloAdatLekerdez,
    felhasznaloAdat,
    kosarDarabszam,
    kosarElemek,
    backendUrl,
  } = useContext(GlobalContext);

  const [nev, setNev] = useState("");
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [lathato, setLathato] = useState(false);

  const [aszfElfogadva, setAszfElfogadva] = useState(false);

  const googleLogin = async () => {
    try {
      sessionStorage.setItem("kosarDarab", kosarDarabszam());
      sessionStorage.setItem("kosarElemek", JSON.stringify(kosarElemek));
      window.location.href = `${backendUrl}/api/felhasznalo/google`;
    } catch (error) {
      toast.error("Hiba a Google bejelentkezés indításakor");
      console.error(error);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleSiker = urlParams.get("google_siker");
    const googleHiba = urlParams.get("hiba");
    if (googleSiker) {
      (async () => {
        try {
          const ideiglenesKosarDarab = sessionStorage.getItem("kosarDarab");

          const valasz = await axios.get(
            `${backendUrl}/api/felhasznalo/adatok`
          );

          if (!valasz.data || !valasz.data.siker) {
            toast.error("Hiba történt a Google bejelentkezés után!");
            return;
          }

          const felhasznaloId = valasz.data.felhasznaloAdat._id;

          const felhasznaloKocsi = valasz.data.felhasznaloAdat.kosarAdatok;

          let felhasznaloKocsiDB;
          if (felhasznaloKocsi !== null) {
            felhasznaloKocsiDB = Object.values(felhasznaloKocsi)
              .flatMap((meretek) => Object.values(meretek))
              .reduce((osszeg, mennyiseg) => osszeg + mennyiseg, 0);
          } else {
            felhasznaloKocsiDB = 0;
          }
          if (valasz.data.felhasznaloAdat.ketlepcsosHitelesites) {
            console.log(felhasznaloId);
            navigacio("/ketfaktor", {
              state: { felhasznaloId: felhasznaloId },
            });
            return;
          }
          valasz.data.felhasznaloAdat;
          if (ideiglenesKosarDarab > 0 && felhasznaloKocsiDB > 0) {
            sessionStorage.setItem("felhasznaloId", felhasznaloId);
            navigacio("/kosar-atvitele");
            return;
          } else if (ideiglenesKosarDarab > 0 && felhasznaloKocsiDB === 0) {
            const { data } = await axios.post(
              `${backendUrl}/api/kocsi/kosar-atvitele`,
              {
                felhasznaloId: felhasznaloId,
                opcio: "kiegeszit",
                kosarElemek: JSON.parse(sessionStorage.getItem("kosarElemek")),
              }
            );
            if (data.siker) {
              navigacio("/");
            } else {
              toast.error(data.uzenet);
            }
          } else {
            navigacio("/");
            setBejelentkezve(true);
            felhasznaloAdatLekerdez();
          }
          sessionStorage.removeItem("kosarDarab");
          sessionStorage.removeItem("kosarElemek");
          localStorage.removeItem("vendegKosar");
          toast.success("Sikeres Google bejelentkezés!");
        } catch (error) {
          toast.error("Hiba történt a Google bejelentkezés során!");
          console.error(error);
        }
      })();
    }

    if (googleHiba) {
      toast.error("Sikertelen Google bejelentkezés!");
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (aktualisAllapot === "Regisztráció" && !aszfElfogadva) {
      toast.error("A regisztrációhoz el kell fogadni az ÁSZF-et!");
      return;
    }
    try {
      axios.defaults.withCredentials = true;
      if (aktualisAllapot === "Regisztráció") {
        const valasz = await axios.post(
          `${backendUrl}/api/felhasznalo/regisztracio`,
          { nev: nev, email, jelszo: jelszo }
        );
        if (valasz.data.siker) {
          if (kosarDarabszam() > 0) {
            const { data } = await axios.post(
              `${backendUrl}/api/kocsi/kosar-atvitele`,
              {
                felhasznaloId: valasz.data.felhasznaloId,
                opcio: "kiegeszit",
                kosarElemek: kosarElemek,
              }
            );
            if (data.siker) {
              setBejelentkezve(true);
              felhasznaloAdatLekerdez();
              navigacio("/");
            } else {
              toast.error(data.uzenet);
            }
          } else {
            setBejelentkezve(true);
            felhasznaloAdatLekerdez();
            navigacio("/");
          }
        } else {
          toast.error(valasz.data.uzenet);
        }
      } else {
        const valasz = await axios.post(
          `${backendUrl}/api/felhasznalo/bejelentkezes`,
          { email, jelszo: jelszo }
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
          if (valasz.data.ketlepcsos) {
            sessionStorage.setItem("kosarElemek", JSON.stringify(kosarElemek));
            navigacio("/ketfaktor", {
              state: { felhasznaloId: valasz.data.felhasznaloId },
            });
            return;
          }

          if (kosarDarabszam() > 0 && felhasznaloKocsiDB > 0) {
            sessionStorage.setItem("felhasznaloId", valasz.data.felhasznaloId);
            sessionStorage.setItem("kosarElemek", JSON.stringify(kosarElemek));
            setBejelentkezve(true);
            felhasznaloAdatLekerdez();
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
            } else {
              toast.error(data.uzenet);
            }
          } else {
            navigacio("/");
            setBejelentkezve(true);
            felhasznaloAdatLekerdez();
          }
        } else {
          toast.error(valasz.data.uzenet);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (felhasznaloAdat) {
      navigacio("/");
    }
  }, [felhasznaloAdat]);

  return (
    <div className="min-h-screen bg-gray-900 py-12 flex items-center justify-center">
      <div className="w-full max-w-lg bg-gray-800 p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-8 text-blue-400">
          {aktualisAllapot === "Bejelentkezés"
            ? "Bejelentkezés"
            : "Regisztráció"}
          <hr className="border-none h-[1.5px] w-12 bg-blue-400" />
        </div>

        <form onSubmit={onSubmitHandler} className="flex flex-col gap-6">
          {aktualisAllapot === "Bejelentkezés" ? (
            ""
          ) : (
            <>
              <input
                onChange={(e) => setNev(e.target.value)}
                required
                type="text"
                className="w-full px-4 py-3 border border-gray-600 rounded-md text-gray-900 placeholder-gray-400"
                placeholder="Név"
              />
            </>
          )}

          <input
            onChange={(e) => setEmail(e.target.value)}
            required
            type="email"
            className="w-full px-4 py-3 border border-gray-600 rounded-md text-gray-900 placeholder-gray-400"
            placeholder="Email"
          />

          <div className="relative w-full text-black">
            <input
              onChange={(e) => setJelszo(e.target.value)}
              required
              type={lathato ? "text" : "password"}
              className="w-full px-4 py-3 border border-gray-600 rounded-md text-gray-900 placeholder-gray-400"
              placeholder="Jelszó"
            />
            <img
              onClick={() => setLathato(!lathato)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-[10%]"
              src={lathato ? assets.not_visible_eye : assets.visible_eye}
              alt="jelszó láthatóság"
            />
          </div>

          <div className="w-full flex justify-between text-sm mt-4">
            <p
              onClick={() => navigacio("/jelszo-visszaallitas")}
              className="text-blue-400 cursor-pointer hover:text-blue-600"
            >
              Elfelejtette a jelszavát?
            </p>
            {aktualisAllapot === "Bejelentkezés" ? (
              <p
                onClick={() => setAktualisAllapot("Regisztráció")}
                className="cursor-pointer text-blue-400 hover:text-blue-600"
              >
                Fiók létrehozása
              </p>
            ) : (
              <p
                onClick={() => setAktualisAllapot("Bejelentkezés")}
                className="cursor-pointer text-blue-400 hover:text-blue-600"
              >
                Bejelentkezés
              </p>
            )}
          </div>

          {aktualisAllapot === "Regisztráció" && (
            <div className="flex items-center gap-2 mt-2">
              <input
                type="checkbox"
                id="aszf"
                checked={aszfElfogadva}
                onChange={(e) => setAszfElfogadva(e.target.checked)}
                className="w-4 h-4 accent-blue-500"
                required
              />
              <label
                htmlFor="aszf"
                className="text-sm text-blue-400 cursor-pointer"
              >
                Elfogadom az
                <button
                  type="button"
                  className="underline text-blue-400 hover:text-blue-600 ml-1"
                  onClick={() => setAszfMegjelenit(true)}
                >
                  ÁSZF-et
                </button>
              </label>
            </div>
          )}

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 transition-all duration-200 mt-6 ${
              aktualisAllapot === "Regisztráció" && !aszfElfogadva
                ? "opacity-50 cursor-not-allowed"
                : ""
            }`}
            disabled={aktualisAllapot === "Regisztráció" && !aszfElfogadva}
          >
            {aktualisAllapot === "Bejelentkezés"
              ? "Bejelentkezés"
              : "Regisztráció"}
          </button>
        </form>
        <div className="text-sm text-blue-400 cursor-pointer text-center my-5 text-xl">
          vagy
        </div>
        <div className="mt-6 flex justify-center">
          <button
            type="button"
            onClick={googleLogin}
            className="flex items-center gap-2 bg-white text-gray-800 px-4 py-2 rounded-md shadow hover:bg-gray-100 transition-all"
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="w-5 h-5"
            />
            {aktualisAllapot === "Bejelentkezés"
              ? "Bejelentkezés Google fiókkal"
              : "Regisztráció Google fiókkal"}
          </button>
        </div>

        {aszfMegjelenit && (
          <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
            <div className="bg-white text-gray-900 rounded-2xl p-8 max-w-lg w-[90%] relative">
              <h2 className="text-xl font-bold mb-4 text-blue-500">
                Általános Szerződési Feltételek
              </h2>
              <div className="space-y-3 text-sm">
                <p>
                  A regisztrációval Ön elfogadja a boltunk általános szerződési
                  feltételeit. Kérjük, figyelmesen olvassa el az alábbiakat:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    <b>Regisztráció:</b> A regisztráció önkéntes, a megadott
                    adatokért a felhasználó felel.
                  </li>
                  <li>
                    <b>Adatvédelem:</b> Az adatokat bizalmasan kezeljük,
                    harmadik félnek nem adjuk át.
                  </li>
                  <li>
                    <b>Rendelés:</b> A rendelés fizetési kötelezettséggel jár,
                    visszaigazolás e-mailben történik.
                  </li>
                  <li>
                    <b>Szállítás:</b> Feltételek a weboldalon érhetők el, a díj
                    és idő a rendeléskor látható.
                  </li>
                  <li>
                    <b>Elállás joga:</b> 14 napon belül indoklás nélkül elállhat
                    a vásárlástól.
                  </li>
                  <li>
                    <b>Jótállás:</b> A jogszabályban előírt jótállás érvényes.
                  </li>
                  <li>
                    <b>Panaszkezelés:</b> Ügyfélszolgálat e-mailben vagy
                    telefonon elérhető.
                  </li>
                  <li>
                    <b>Felelősség kizárása:</b> Az oldalon található információk
                    tájékoztató jellegűek.
                  </li>
                  <li>
                    <b>Jogviták:</b> Magyar jog az irányadó, illetékes bíróság:
                    Székesfehérvári Törvényszék.
                  </li>
                </ul>
                <p>
                  A regisztrációval Ön kijelenti, hogy elolvasta és elfogadta az
                  ÁSZF-et.
                </p>
              </div>
              <button
                type="button"
                className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-lg font-bold"
                onClick={() => setAszfMegjelenit(false)}
              >
                X
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BelepesEsRegisztracio;
