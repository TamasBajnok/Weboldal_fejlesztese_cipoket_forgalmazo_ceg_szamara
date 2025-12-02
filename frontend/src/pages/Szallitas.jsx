import React, { useEffect } from "react";

const Szallitas = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="bg-gray-900 text-gray-200 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold mb-4 text-blue-400">
          Termék kiszállítási tájékoztató
        </h2>
        <ul className="space-y-4 text-gray-300 text-base">
          <li>
            <span className="font-semibold text-white">Szállítási módok:</span>
            Csomagjainkat futárszolgálattal juttatjuk el Önhöz, Magyarország
            egész területén.
          </li>
          <li>
            <span className="font-semibold text-white">Szállítási díj:</span>
            Egységesen mindig 2000 Ft.
          </li>
          <li>
            <span className="font-semibold text-white">Szállítási idő:</span>
            Általában 2-5 munkanap, a rendelés visszaigazolásától számítva.
          </li>
          <li>
            <span className="font-semibold text-white">Csomagkövetés:</span>
            Minden rendeléshez e-mailben küldünk nyomkövetési információt.
          </li>
          <li>
            <span className="font-semibold text-white">
              Átvételi lehetőségek:
            </span>
            Házhozszállítás
          </li>
          <li>
            <span className="font-semibold text-white">Fizetés:</span>
            Bankkártyával online vagy készpénzben átvételkor.
          </li>
          <li>
            <span className="font-semibold text-white">Kérdés esetén:</span>
            Ügyfélszolgálatunk elérhető e-mailben és telefonon, segítünk minden
            szállítással kapcsolatos kérdésben.
          </li>
        </ul>
      </div>
    </section>
  );
};

export default Szallitas;
