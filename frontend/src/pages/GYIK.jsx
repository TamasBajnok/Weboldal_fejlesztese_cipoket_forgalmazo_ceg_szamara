import React from "react";
import { NavLink } from "react-router-dom";

const GyakoriKerdesek = () => {

    window.scrollTo(0,0)
  return (
    <div className="py-12 bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold text-white">Gyakran Ismételt Kérdések</h2>
          <NavLink to="/elerhetoseg" className="text-sm text-blue-400 hover:underline">
            Kapcsolat és ügyfélszolgálat →
          </NavLink>
        </div>

        <p className="text-gray-400 mb-6">Itt találja a legygyakrabban feltett kérdéseket a vásárlók által és rövid válaszainkat. Ha nem találja a választ, lépjen forduljon hozzánk bizalommal.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

     <details className="bg-gray-800/40 p-4 rounded">
        <summary className="font-medium cursor-pointer">Mennyi idő alatt érkezik a csomagom?</summary>
        <p className="mt-2 text-gray-300">Általában 2-5 munkanapon belül kézbesítünk országosan.</p>
    </details>

          <details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
            <summary className="font-medium cursor-pointer">Mennyibe kerül a szállítás?</summary>
            <p className="mt-2 text-gray-300">A szállítási díj egységesen 2000 Ft.</p>
          </details>

          <details className="bg-gray-800/40 p-4 rounded">
            <summary className="font-medium cursor-pointer">Milyen fizetési módok vannak?</summary>
            <p className="mt-2 text-gray-300">Bankkártya és készpénz.</p>
          </details>

          <details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
            <summary className="font-medium cursor-pointer">Hogyan tudom visszaküldeni vagy kicserélni a terméket?</summary>
            <p className="mt-2 text-gray-300">14 napon belül indoklás nélkül elállhat a vásárlástól, az ingyenes visszaküldés részleteitvel kapcsolatban keresse ügyfélszolgálatunkat, vagy tájékozódjon a Visszaküldés és csere oldalunkon.</p>
          </details>

          <details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
            <summary className="font-medium cursor-pointer">Mi a jótállás feltétele?</summary>
            <p className="mt-2 text-gray-300">A legtöbb termékre 1 év jótállást biztosítunk. Garanciális ügyekben kérjük, jelezze az ügyfélszolgálat felé a vásárláskor kapott bizonylat vagy rendelésazonosító megadásával.</p>
          </details>

          <details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
            <summary className="font-medium cursor-pointer">Nyomon tudom követni a rendelésemet?</summary>
            <p className="mt-2 text-gray-300">Igen, minden rendelés leadása után e-mailben küldünk róla üzenetet és további e-maileket a csomag aktuális állapotáról.</p>
          </details>

          <details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
            <summary className="font-medium cursor-pointer">Lehet személyesen átvenni a megrendelt terméket?</summary>
            <p className="mt-2 text-gray-300">Jelenleg a fő mód a házhozszállítás, azonban üzletünk címét és nyitvatartását megtalálja a Kapcsolat oldalon: 9021 Győr, Baross Gábor út 31. Nyitvatartás: H–P 09:00–18:00, Szo 09:00–13:00.</p>
          </details>

        

          <details className="bg-gray-800/40 p-4 rounded-lg" aria-expanded="false">
            <summary className="font-medium cursor-pointer">Hogyan tudok panaszt tenni?</summary>
            <p className="mt-2 text-gray-300">Panasz esetén forduljon ügyfélszolgálatunkhoz e-mailben vagy telefonon, kollégáink segítenek a probléma gyors rendezésében.</p>
          </details>


        </div>

        <div className="mt-8 text-sm text-gray-400">
          <p>
            Ha kérdése van, elérhet minket telefonon: <span className="text-white font-medium">+36 70 555 6987</span> vagy e-maiben: <span className="text-white font-medium">sneakshoes@sh.com</span>.
          </p>
          <p className="mt-2">Cím: <span className="text-white">9021 Győr, Baross Gábor út 31.</span></p>
        </div>
      </div>
    </div>
  );
};

export default GyakoriKerdesek;
