import React, { useState, useContext } from "react";
import { GlobalContext } from "../context/GlobalContext";
import axios from "axios";
import { toast } from "react-toastify";

const Hirlevel = () => {
  const [email, setEmail] = useState("");

  const { felhasznaloAdat, backendUrl } = useContext(GlobalContext);

  const kezeloBekuldes = async (e) => {
    e.preventDefault();
    if (!felhasznaloAdat) {
      toast.error("Kérjük, jelentkezzen be a feliratkozáshoz!");
      return;
    }

    if (!email) {
      toast.error("Kérjük adja meg az email címét!");
      return;
    }

    try {
      axios.defaults.withCredentials = true;

      const valasz = await axios.post(
        `${backendUrl}/api/feliratkozo/feliratkozas`,
        { email }
      );

      if (valasz.data.siker) {
        toast.success(valasz.data.uzenet);
        setEmail("");
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (hiba) {
      toast.error(hiba.message);
    }
  };

  return (
    <section className="bg-gray-900 text-gray-200 py-16">
      <div className="max-w-md mx-auto px-4 text-center">
        <h2 className="text-2xl font-semibold">
          Iratkozzon fel és szerezzen{" "}
          <span className="text-blue-400">20%-os kupont</span>
        </h2>
        <p className="mt-3 text-gray-400">
          Csatlakozzon Ön is oldalunkhoz, és vásároljon szuper kedvezményes
          árakon!
        </p>
        <form
          onSubmit={kezeloBekuldes}
          className="mt-6 flex flex-col sm:flex-row gap-3"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Adja meg az emailjét"
            required
            className="flex-1 px-4 py-2 bg-gray-800 text-gray-200 placeholder-gray-500 rounded-md sm:rounded-r-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-blue-400 text-gray-900 font-medium rounded-md sm:rounded-l-none hover:bg-blue-500 transition-colors duration-200"
          >
            FELIRATKOZÁS
          </button>
        </form>
      </div>
    </section>
  );
};

export default Hirlevel;
