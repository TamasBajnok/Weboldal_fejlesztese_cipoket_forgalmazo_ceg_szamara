import React, { useContext, useEffect } from "react";
import { GlobalContext } from "../context/GlobalContext";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const FizetesHitelesitese = () => {
  const { navigacio, setKosarElemek, backendUrl, felhasznaloAdat } =
    useContext(GlobalContext);
  const [keresParameterek, setKeresParameterek] = useSearchParams();

  const siker = keresParameterek.get("siker");
  const rendelesId = keresParameterek.get("rendelesId");
  const kupon = keresParameterek.get("kupon");

  const fizetesEllenoriz = async () => {
    try {
      axios.defaults.withCredentials = true;
      if (!felhasznaloAdat) {
        return null;
      }

      const valasz = await axios.post(backendUrl + "/api/rendeles/ellenorzes-stripe", {
        siker: siker,
        rendelesId: rendelesId,
        kupon: kupon,
      });

      if (valasz.data.siker) {
        setKosarElemek({});
        navigacio("/korabbi-rendelesek");
      } else {
        navigacio("/kosar");
        
      }
    } catch (error) {
      console.log(error);
      toast.error(error.uzenet);
    }
  };

  useEffect(() => {
    fizetesEllenoriz();
  }, [felhasznaloAdat]);

  return <div></div>;
};

export default FizetesHitelesitese;
