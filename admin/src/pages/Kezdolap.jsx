import React from "react";

const Kezdolap = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-100 text-center px-4">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
        Üdvözöljük az Admin felületen!
      </h1>
      <p className="text-gray-600 text-lg">
        Itt kezelheti a termékeket, rendeléseket és kuponokat.
      </p>
    </div>
  );
};

export default Kezdolap;
