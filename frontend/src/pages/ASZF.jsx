import React, { useEffect } from "react";

const ASZF = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-gray-900 text-gray-200 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          Általános Szerződési Feltételek
        </h2>
        <div className="space-y-6 text-gray-300 text-base">
          <p>
            A regisztrációval Ön elfogadja a boltunk általános szerződési
            feltételeit. Kérjük, figyelmesen olvassa el az alábbiakat:
          </p>
          <ul className="list-disc pl-6 space-y-3">
            <li>
              <span className="font-semibold text-white">Regisztráció:</span>A
              regisztráció önkéntes, a megadott adatok valóságtartalmáért a
              felhasználó felel.
            </li>
            <li>
              <span className="font-semibold text-white">Adatvédelem:</span>A
              megadott személyes adatokat bizalmasan kezeljük, harmadik félnek
              nem adjuk ki, kivéve jogszabályi kötelezettség esetén.
            </li>
            <li>
              <span className="font-semibold text-white">Rendelés:</span>A
              rendelés leadása fizetési kötelezettséggel jár. A rendelés
              visszaigazolása e-mailben történik.
            </li>
            <li>
              <span className="font-semibold text-white">Szállítás:</span>A
              szállítási feltételek a weboldalon részletesen megtalálhatók. A
              szállítási díj és idő a rendeléskor látható.
            </li>
            <li>
              <span className="font-semibold text-white">Elállás joga:</span>A
              vásárló a termék átvételétől számított 14 napon belül indoklás
              nélkül elállhat a vásárlástól.
            </li>
            <li>
              <span className="font-semibold text-white">Jótállás:</span>
              Minden termékre a jogszabályban előírt jótállás.
            </li>
            <li>
              <span className="font-semibold text-white">Panaszkezelés:</span>
              Panasz esetén ügyfélszolgálatunkhoz fordulhat e-mailben vagy
              telefonon.
            </li>
            <li>
              <span className="font-semibold text-white">
                Felelősség kizárása:
              </span>
              A weboldalon található információk tájékoztató jellegűek, a
              hibákért felelősséget nem vállalunk.
            </li>
            <li>
              <span className="font-semibold text-white">Jogviták:</span>A
              jogviták rendezésére a magyar jog az irányadó, illetékes bíróság:
              Székesfehérvári Törvényszék.
            </li>
          </ul>
          <p>
            A regisztrációval Ön kijelenti, hogy elolvasta és elfogadta az
            Általános Szerződési Feltételeket.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ASZF;
