import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import Hirlevel from "../components/Hirlevel";

const Rolunk = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="flex justify-center">
          <img
            src={assets.about_img}
            alt="Rólunk"
            className="mt-14 rounded-lg shadow-lg w-full max-w-lg"
          />
        </div>

        <div className="space-y-6">
         <div className='inline-flex gap-2 items-center mb-3'>
        <p className='text-gray-400'>TUDJON MEG <span className='text-white font-semibold'>TOBBET RÓLUNK</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500'></p>
    </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Kik vagyunk?</h3>
            <p className="text-gray-400 text-justify">
              Mi egy szenvedélyből született cipőbolt vagyunk, akik hisznek
              abban, hogy a cipő több mint egyszerű kiegészítő – a cipő
              személyiséget, életstílust és történeteket hordoz. Azért hoztuk
              létre webáruházunkat, hogy mindenki megtalálja a számára tökéletes
              darabot, legyen szó elegáns alkalomról, mindennapi kényelmes
              viseletről vagy sportos kihívásokról.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">
              Mivel foglalkozunk?
            </h3>
            <p className="text-gray-400 text-justify">
              Egy helyen gyűjtjük össze a legjobb márkákat, minőségi anyagokat
              és trendi designokat, hogy könnyedén rátalálhass a hozzád illő
              cipőre. Kínálatunkban megtalálod a klasszikus bőr cipőket, a
              divatos sneakereket, a sportcipőket, és a hétköznapi kényelmet
              biztosító darabokat is. Fontos számunkra a stílus és a
              funkcionalitás harmóniája, ezért minden termékünket gondosan
              válogatjuk össze.
            </p>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-2">Történetünk</h3>
            <p className="text-gray-400 text-justify">
              Az utunk egy apró ötlettel kezdődött: olyan cipőboltot szerettünk
              volna, ahol nem csak vásárlás történik, hanem élmény is. Egy
              helyet, ahol nem kell kompromisszumot kötni stílus és minőség
              között. Az online világ lehetőséget adott, hogy széles körben
              elérhessük a cipők szerelmeseit, és ma már büszkék vagyunk arra,
              hogy vásárlóink velünk együtt írják a történetet – minden egyes
              pár cipő új kaland kezdetét jelenti.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center mb-8">

        <div className='inline-flex gap-2 items-center mb-3'>
        <p className='text-gray-400'>VÁLASSZON <span className='text-white font-semibold'>MINKET</span></p>
        <p className='w-8 sm:w-12 h-[1px] sm:h-[2px] bg-blue-500'></p>
        </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            {
              cim: "Minőségbiztosítás",
              szoveg: "Prémium anyagok és szigorú ellenőrzés minden terméknél.",
            },
            {
              cim: "Kényelem",
              szoveg:
                "Ergonomikus tervezés és könnyű anyagok a tökéletes viseletért.",
            },
            {
              cim: "Kiváló ügyfélszolgálat",
              szoveg: "Segítőkész csapat, aki mindig támogatást nyújt.",
            },
          ].map((elem) => (
            <div
              key={elem.cim}
              className="bg-gray-900 p-6 rounded-lg shadow-md space-y-3"
            >
              <h4 className="text-blue-400 text-lg font-semibold">
                {elem.cim}
              </h4>
              <p className="text-gray-400 text-sm">{elem.szoveg}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="py-12">
        <Hirlevel />
      </div>
    </section>
  );
};

export default Rolunk;
