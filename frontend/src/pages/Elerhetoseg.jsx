import React, { useEffect } from "react";
import { assets } from "../assets/assets";
import Hirlevel from "../components/Hirlevel";

const Elerhetoseg = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-gray-900 text-gray-200 pt-16">
      <div className="flex-grow">
        <div className="max-w-6xl w-full mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img
                src={assets.contact}
                alt="Sneak Shoes üzlet - belső tér és cipők"
                className="w-full h-80 object-cover md:h-96"
              />
            </div>

            <div className="bg-gray-800 rounded-3xl p-8 shadow-lg border border-gray-700">
              <div className="flex items-start gap-4">
                <div>
                  <h1 className="text-3xl font-extrabold text-gray-100 mb-2">
                    KERÜLJÖN KAPCSOLATBA VELÜNK
                  </h1>
                  <p className="text-gray-300 mb-4">
                    Ha kérdése van termékeinkkel, rendelésével vagy
                    visszaküldéssel kapcsolatban, örömmel segítünk. Forduljon
                    hozzánk bizalommal!
                  </p>

                  <div className="space-y-2 text-gray-200">
                    <p className="font-medium text-blue-400">
                      Üzletünk helyszíne
                    </p>
                    <p className="text-gray-300">
                      9021 Győr, Baross Gábor út 31.
                    </p>

                    <p className="mt-3 font-medium text-blue-400">
                      Telefonszám
                    </p>
                    <p className="text-gray-300">+36 70 555 6987</p>

                    <p className="mt-3 font-medium text-blue-400">E-mail</p>
                    <p className="text-gray-300">sneakshoes@sh.com</p>
                  </div>

                  <p className="text-sm text-gray-400 mt-6">
                    Nyitvatartás: H–P 09:00–18:00, Szo 09:00–13:00
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
     <div className="flex flex-col items-center text-center my-12">
  <h2 className="text-3xl font-bold text-blue-400 mb-4">Székhely</h2>
  <p className="text-gray-300 text-lg mb-6">
    9021 Győr, Baross Gábor út 31.
  </p>

  <div className="w-full md:w-3/4 lg:w-2/3 h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-gray-700">
    <iframe
      title="SneakShoes székhely térkép"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2685.957476611286!2d17.632189911451608!3d47.68524578242395!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x476bbfef7ade10eb%3A0x5cf014289c3e0480!2zR3nFkXIsIEJhcm9zcyBHw6Fib3Igw7p0IDMxLCA5MDIx!5e0!3m2!1shu!2shu!4v1760263823410!5m2!1shu!2shu"
      width="100%"
      height="100%"
      style={{ border: 0 }}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
    ></iframe>
  </div>
</div>

      <div className="py-12">
        <Hirlevel />
      </div>
    </section>
  );
}

export default Elerhetoseg
