import React, { useEffect } from "react";

const AdatvedelemiNyilatkozat = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800/40 rounded-2xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Adatvédelmi nyilatkozat</h1>

        <p className="text-gray-300 mb-4">
          Ez az adatvédelmi nyilatkozat tájékoztatja Önt arról, hogyan gyűjtjük,
          használjuk és védjük a személyes adatait a <span className="font-semibold">SneakyShoes</span> szolgáltatásai
          során. Amennyiben kérdése van az adatkezeléssel kapcsolatban, kérjük lépjen kapcsolatba velünk: <span className="text-white font-medium">sneakshoes@sh.com</span>.
        </p>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Adatkezelő</h2>
        <p className="text-gray-300">
          SneakShoes — Székhely: 9021 Győr, Baross Gábor út 31. — E-mail: <span className="text-white">sneakshoes@sh.com</span>
        </p>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Gyűjtött adatok</h2>
        <p className="text-gray-300">A leggyakoribb, általunk kezelt adatok:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li>Kapcsolattartási adatok (név, cím, e-mail, telefonszám).</li>
          <li>Rendelési adatok (rendelésazonosító, termékek, szállítási cím).</li>
          <li>Fizetéshez szükséges adatok (a fizetési szolgáltató által kezelt adatok; bankkártya adatokat nem tárolunk saját rendszereinkben).</li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Az adatkezelés célja és jogalapja</h2>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li>
            Rendelés teljesítése és szállítás.
            </li>
          <li>
            Ügyfélszolgálat és panaszkezelés: jogos érdeken alapuló, illetve a szerződés teljesítéséhez kapcsolódó kezelés.
          </li>
          <li>
            Marketing (hírlevél): kifejezett hozzájáruláson alapul. 
          </li>
          <li>
            Jogszabályi kötelezettségek teljesítése (pl. számlázás, könyvelés)..
          </li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Adattovábbítás és adatfeldolgozók</h2>
        <p className="text-gray-300">Az adatait szükség szerint továbbítjuk megbízható harmadik fél szolgáltatóknak:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li>Fizetési szolgáltató (sTRIPE).</li>
          <li>Futárszolgálatok a kiszállításhoz.</li>
          <li>E-mail küldő szolgáltatók.</li>
        </ul>
        <p className="text-gray-300 mt-2">Minden adatfeldolgozóval szerződéses kapcsolatban állunk, és megfelelő technikai, szervezeti intézkedéseket kérünk tőlük az adatok védelmére.</p>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Adatmegőrzés</h2>
        <p className="text-gray-300">Az adatokat addig tároljuk, amíg az a fentiek szerinti célokhoz szükséges, és amíg a jogszabályok előírják (pl. könyvelési és számlázási kötelezettségek). A marketing célú adatkezelés addig tart, amíg a hozzájárulását vissza nem vonja.</p>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Érintetti jogok</h2>
        <p className="text-gray-300">Ön jogosult:</p>
        <ul className="list-disc pl-6 text-gray-300 space-y-1">
          <li>hozzáférést kérni az adataihoz,</li>
          <li>adatainak helyesbítését kérni,</li>
          <li>adatainak törlését vagy kezelésének korlátozását kezdeményezni,</li>
          <li>tiltakozni az adatkezelés ellen (amennyiben jogalapja nem szerződésen vagy jogszabályon alapul),</li>
        </ul>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Biztonság</h2>
        <p className="text-gray-300">Megfelelő technikai és szervezési intézkedéseket alkalmazunk az adatok védelmére (titkosítás, hozzáférés-korlátozás, belső eljárások). Az interneten történő adatátvitel azonban soha nem teljesen kockázatmentes; ezért javasoljuk, hogy ügyeljen a saját adatai biztonságára is.</p>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Sütik és analitika</h2>
        <p className="text-gray-300">Weboldalunk sütiket (cookie-kat) használhat a működés és a felhasználói élmény javítása érdekében. A marketing célú sütik használata a hozzájárulás részét képezi.</p>

        <h2 className="text-lg font-semibold text-blue-400 mt-6 mb-2">Kapcsolat</h2>
        <p className="text-gray-300">További információért vagy adatkezeléssel kapcsolatos kérések esetén keressen minket:</p>
        <p className="text-gray-300">E-mail: <span className="text-white font-medium">sneakshoes@sh.com</span></p>
        <p className="text-gray-300">Telefon: <span className="text-white font-medium">+36 70 555 6987</span></p>
        </div>

    </div>
  );
};

export default AdatvedelemiNyilatkozat;
