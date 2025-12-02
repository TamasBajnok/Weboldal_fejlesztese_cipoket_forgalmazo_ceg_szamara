import React, { useEffect, useContext, useState } from "react";
import { assets } from "../assets/assets";
import { GlobalContext } from "../context/GlobalContext";
import TermekKinalo from "../components/TermekKinalo";
import Hirlevel from "../components/Hirlevel";
import { NavLink } from "react-router-dom";
import { FaFacebookF, FaInstagram} from "react-icons/fa";


const Kezdolap = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const { termekek } = useContext(GlobalContext);
  const [legujabbTermekek, setLegujabbTermekek] = useState([]);

  useEffect(() => {
    const rendezett = [...termekek].sort((a, b) => b.pozicio - a.pozicio);
    setLegujabbTermekek(rendezett.slice(0, 8));
  }, [termekek]);

  const Feature = ({ cim, leiras, ikon }) => (
    <div className="flex items-start gap-4 bg-gray-800/60 p-4 rounded-lg shadow-sm">
      <div className="flex-shrink-0 w-12 h-12 rounded-md bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
        <span className="text-white text-lg">{ikon}</span>
      </div>
      <div>
        <h4 className="font-semibold text-white">{cim}</h4>
        <p className="text-sm text-gray-300">{leiras}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200">
      <section className="relative overflow-hidden bg-gradient-to-b from-gray-900/80 to-gray-900 py-20 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-full md:w-1/2">
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
                Találd meg a tökéletes cipőt — <span className="text-blue-400">új kollekció</span>
              </h1>
              <p className="text-gray-300 mb-6">
                Kényelmes, stílusos és megfizethető. Böngéssz a legújabb modellek között, és válaszd ki a
                hozzád illőt. Ingyenes visszaküldés 14 napon belül.
              </p>

              <div className="flex flex-wrap gap-3 items-center">
                <NavLink to="/kinalat" className="bg-blue-500 hover:bg-blue-600 transition text-white px-5 py-3 rounded-md font-medium">
                  Vásároljon most
                </NavLink>
                <NavLink to="/rolunk" className="border border-gray-700 text-gray-200 px-4 py-3 rounded-md hover:bg-gray-800 transition">
                  Tudjon meg többet rólunk
                </NavLink>
              </div>

              <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <Feature
                  ikon={"🔒"}
                  cim={"Biztonságos fizetés"}
                  leiras={"Bankkártyás és utánvétes fizetés — te döntesz."}
                />
                <Feature
                  ikon={"⭐"}
                  cim={"Minőségi márkák"}
                  leiras={"Külön válogatott, megbízható gyártóktól származó cipők."}
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 flex items-center justify-center relative">
              <div className="w-11/12 md:w-full rounded-xl shadow-2xl overflow-hidden border-4 border-blue-400">
                <img
                  src={assets.future || assets.placeholder}
                  alt="Bemutató poszter"
                  className="w-full h-full object-cover block"
                />
              </div>

        
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <div className="inline-flex gap-3 items-center">
              <p className="text-gray-400">LEGÚJABB <span className="text-white font-semibold">TERMÉKEK</span></p>
              <div className="w-10 h-[2px] bg-blue-500" />
            </div>
            <a href="/kinalat" className="text-sm text-blue-400 hover:underline hidden sm:inline">Összes megtekintése →</a>
          </div>

          <p className="text-gray-400 mb-6">Ismerje meg a legújabb cipőinket! Találja meg az Önhöz illőt!</p>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {legujabbTermekek.length === 0 ? (
              new Array(8).fill(0).map((_, i) => (
                <div key={i} className="bg-gray-800/50 rounded-lg p-4 animate-pulse h-56" />
              ))
            ) : (
              legujabbTermekek.map((elem) => (
                <TermekKinalo
                  key={elem._id}
                  termekId={elem._id}
                  kepek={elem.kepek}
                  nev={elem.nev}
                  ar={elem.ar}
                  akcios={elem.akcios}
                  akciosAr={elem.akciosAr}
                  akcioKezdet={elem.akcioKezdet}
                  akcioVege={elem.akcioVege}
                  marka={elem.marka}
                velemenyek={elem.velemenyek?.length || 0}
                ertekeles={(
                    elem.velemenyek.reduce(
                      (sum, velemenyek) => sum + velemenyek.ertekeles,
                      0
                    ) / elem.velemenyek.length
                  ).toFixed(2)}
                />
              ))
            )}
          </div>

        </div>
      </section>


      <Hirlevel />

<section className="py-10">
<div className="max-w-7xl mx-auto px-6">
<h4 className="text-lg font-semibold text-white mb-4">Márkáink</h4>
<div className="grid grid-cols-3 sm:grid-cols-5 gap-6 items-center bg-gray-800/30 p-4 rounded-lg">

<div  className="flex items-center justify-center p-4 bg-gray-800 rounded">
<img src={assets.nike} alt="nike" className="h-10 object-contain" />
</div>
<div  className="flex items-center justify-center p-4 bg-gray-800 rounded">
<img src={assets.puma} alt="puma" className="h-10 object-contain" />
</div>
<div  className="flex items-center justify-center p-4 bg-gray-800 rounded">
<img src={assets.jordan} alt="jordan" className="h-10 object-contain" />
</div>
<div  className="flex items-center justify-center p-4 bg-gray-800 rounded">
<img src={assets.adidas} alt="adidas" className="h-10 object-contain" />
</div>
<div  className="flex items-center justify-center p-4 bg-gray-800 rounded">
<img src={assets.converse} alt="converse" className="h-10 object-contain" />
</div>



</div>
<p className="text-lg font-semibold text-white mt-4 text-center">
      És még megannyi más termék!
    </p>
</div>
</section>

<section className="py-16 bg-gradient-to-b from-gray-900 to-gray-800 border-t border-gray-700">
  <div className="max-w-6xl mx-auto px-6 text-center">
    <h4 className="text-2xl font-semibold text-white mb-4">Kövess minket</h4>
    <p className="text-gray-400 mb-8">
      Csatlakozz közösségeinkhez, és értesülj elsőként a legújabb akciókról, újdonságokról és exkluzív ajánlatainkról!
    </p>

    <div className="flex justify-center gap-6">
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 flex items-center justify-center text-white text-2xl transition-transform transform hover:scale-110 shadow-lg"
        aria-label="Facebook"
      >
        <FaFacebookF/>
      </a>

      <a
        href="https://instagram.com"
        target="_blank"
        rel="noreferrer"
        className="w-14 h-14 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 hover:opacity-90 flex items-center justify-center text-white text-2xl transition-transform transform hover:scale-110 shadow-lg"
        aria-label="Instagram"
      >
         <FaInstagram/> 
      </a>
    </div>
  </div>
</section>

<section className="py-12 bg-gray-900">
<div className="max-w-7xl mx-auto px-6">
<h4 className="text-lg font-semibold text-white mb-4">Gyakori kérdések</h4>
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<details className="bg-gray-800/40 p-4 rounded">
<summary className="font-medium cursor-pointer">Mennyi idő alatt érkezik a csomagom?</summary>
<p className="mt-2 text-gray-300">Általában 2-5 munkanapon belül kézbesítünk országosan.</p>
</details>
<details className="bg-gray-800/40 p-4 rounded">
<summary className="font-medium cursor-pointer">Milyen fizetési módok vannak?</summary>
<p className="mt-2 text-gray-300">Bankkártya és készpénz.</p>
</details>
<details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
<summary className="font-medium cursor-pointer">Mi a jótállás feltétele?</summary>
<p className="mt-2 text-gray-300">A legtöbb termékre 1 év jótállást biztosítunk. Garanciális ügyekben kérjük, jelezze az ügyfélszolgálat felé a vásárláskor kapott bizonylat vagy rendelésazonosító megadásával.</p>
</details>
<details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
<summary className="font-medium cursor-pointer">Lehet személyesen átvenni a megrendelt terméket?</summary>
<p className="mt-2 text-gray-300">Jelenleg a fő mód a házhozszállítás, azonban üzletünk címét és nyitvatartását megtalálja a Kapcsolat oldalon: 9021 Győr, Baross Gábor út 31. Nyitvatartás: H–P 09:00–18:00, Szo 09:00–13:00.</p>
</details>
</div>
</div>
</section>


</div>
);
};


export default Kezdolap;
