import React, { useEffect } from "react";

const Visszakuldes = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gray-900 text-gray-200 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-gray-800/40 rounded-2xl p-8 shadow-lg border border-gray-700">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-4">Visszaküldés és csere</h1>
        <p className="text-gray-400 mb-6">
          Itt találja lépésről-lépésre, hogyan tudja visszaküldeni vagy kicseréltetni nálunk vásárolt termékét. Célunk, hogy a folyamat egyszerű és gyors legyen — ha bármiben elakad, ügyfélszolgálatunk készséggel segít.
        </p>

        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Jogosultság — mikor élhet az elállási joggal?</h2>
            <p className="text-gray-300">
              A vásárló a termék átvételétől számított 14 napon belül indoklás nélkül elállhat a vásárlástól. A visszaküldés feltétele, hogy a termék visszaérkezzen eredeti állapotában, tisztán és sértetlen csomagolásban.
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">1. Lépés — Előkészületek</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Keresse elő rendelésazonosítóját.</li>
              <li>Győződjön meg róla, hogy a termék és a kiegészítők (doboz, címkék) visszakerülnek.</li>
              <li>Ha cserét szeretne (méret- vagy színcsere), ellenőrizze a kívánt termék raktárkészletét a weboldalon, vagy jelezze az ügyfélszolgálatnak.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">2. Lépés — Visszaküldés indítása</h2>
            <p className="text-gray-300 mb-2">
              Kérjük, először vegye fel velünk a kapcsolatot az alábbi elérhetőségek egyikén.
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>E-mail: <span className="text-white font-medium">sneakshoes@sh.com</span></li>
              <li>Telefon: <span className="text-white font-medium">+36 70 555 6987</span> (Nyitvatartás: H–P 09:00–18:00, Szo 09:00–13:00)</li>
            </ul>

            <p className="text-gray-300 mt-3">
              Ügyfélszolgálatunk elküldi Önnek a visszaküldés részleteit (például visszaküldési címet, esetleges ingyenes címkét vagy további instrukciókat).
            </p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">3. Lépés — Csomagolás és feladás</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Csomagolja vissza a terméket eredeti csomagolásbaa, mellékelje a számlát vagy rendelésazonosítót.</li>
              <li>Győződjön meg róla, hogy a cipőket védő elemekben és a dobozban küldi vissza, így elkerülhető a sérülés szállítás közben.</li>
              <li>
                Amennyiben mi biztosítunk visszaküldési címkét / futárcímkét, azt ragassza a csomagra az instrukciók szerint. Ha nem biztosított címkét, a feladás költségét az aktuális promóciók határozzák — alapértelmezett esetben a szállítási díj a rendeléskor feltüntetett szabályok szerint érvényes.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Csere (méret vagy típus csere)</h2>
            <p className="text-gray-300 mb-2">
              A csere folyamata hasonló a visszaküldéshez, de fontos a raktárkészlet ellenőrzése. A csere akkor történik a leggyorsabban, ha:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Először jelzi csereigényét ügyfélszolgálatunk felé (e-mailben vagy telefonon).</li>
              <li>Meghatározza a kívánt csere-terméket (méret, szín, típus), és kollégáink visszaigazolják a készletet.</li>
              <li>Amennyiben a kiválasztott termék nincs raktáron, felajánlunk alternatívát vagy visszatérítést.</li>
            </ul>
            <p className="text-gray-300 mt-2">Figyelem: a csere díjazása (pl. új termék feladási költsége) promóciótól függően változhat — ügyfélszolgálat tájékoztat.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Visszatérítés feldolgozása</h2>
            <p className="text-gray-300">Miután beérkezett és ellenőriztük a visszaküldött terméket:</p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>A visszatérítést a banki utaláson keresztül intézzük.</li>
              <li>A visszatérítés feldolgozása általában 5–10 munkanapot vehet igénybe a beérkezéstől számítva, a banki visszatérítés a banki ügyintézéstől függően tovább tarthat.</li>
              <li>Ha a visszaküldés során a csomag feladási költségét mi vállaljuk (pl. promóciók esetén), azt a visszatérítendő összeg automatikusan figyelembe vesszük.</li>
            </ul>
          </div>

          

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Hasznos tippek</h2>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Fotózza le a terméket és a csomagolást, mielőtt feladná — ez segít vitás esetek rendezésében.</li>
              <li>Csere esetén tüntesse fel a rendelés számát és a kívánt cseretermék pontos adatait.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-blue-400 mb-2">Kapcsolat</h2>
            <p className="text-gray-300 mb-2">Ha kérdése van vagy segítségre van szüksége a visszaküldés/csere folyamatában, forduljon hozzánk bizalommal:</p>
            <p className="text-gray-300">Telefon: <span className="text-white font-medium">+36 70 555 6987</span></p>
            <p className="text-gray-300">E-mail: <span className="text-white font-medium">sneakshoes@sh.com</span></p>
            <p className="text-gray-300 mt-3">Cím: <span className="text-white">9021 Győr, Baross Gábor út 31.</span></p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Visszakuldes;
