import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { backendUrl, penznem } from "../App";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { ChevronUp, ChevronDown } from "lucide-react";

const MARKAK = [
  "Összes",
  "Puma",
  "Nike",
  "Adidas",
  "Converse",
  "Jordan",
  "Bugatti",
  "Skechers",
];
const SZINEK = [
  "Összes",
  "Piros",
  "Fekete",
  "Fehér",
  "Zöld",
  "Sárga",
  "Lila",
  "Rózsaszín",
];
const TIPUSOK = [
  "Összes",
  "Utcai",
  "Sportos",
  "Csizma",
  "Magas sarkú",
  "Sneakrs",
  "Szandál",
  "Papucs",
  "Túra",
];
const KATEGORIAK = ["Összes", "Férfi", "Női", "Gyerek"];

const TermekLista = () => {
  const [termekek, setTermekek] = useState([]);
  const [dragolhatoLista, setDragolhatoLista] = useState([]);
  const [betoltes, setBetoltes] = useState(false);

  const [mutatTorlesModal, setMutatTorlesModal] = useState(false);
  const [torlendoTermek, setTorlendoTermek] = useState(null);
  const [torlesFolyamatban, setTorlesFolyamatban] = useState(false);

  const [kategoriaSzuro, setKategoriaSzuro] = useState("Összes");
  const [markaSzuro, setMarkaSzuro] = useState("Összes");
  const [szinSzuro, setSzinSzuro] = useState("Összes");
  const [tipusSzuro, setTipusSzuro] = useState("Összes");

  const [rendezAllapot, setRendezAllapot] = useState({
    mező: null,
    irany: null,
  });

  const lekerListat = async () => {
    try {
      setBetoltes(true);
      axios.defaults.withCredentials = true;
      const valasz = await axios.get(`${backendUrl}/api/termek/lista`);
      if (valasz.data.siker) {
        setTermekek(valasz.data.termekek || []);
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setBetoltes(false);
    }
  };

  useEffect(() => {
    lekerListat();
  }, []);

  const feldolgozottLista = useMemo(() => {
    let lista = Array.isArray(termekek) ? [...termekek] : [];

    if (kategoriaSzuro && kategoriaSzuro !== "Összes") {
      lista = lista.filter(
        (t) => t.kategoria?.toLowerCase() === kategoriaSzuro.toLowerCase()
      );
    }

    if (markaSzuro && markaSzuro !== "Összes") {
      lista = lista.filter(
        (t) => t.marka?.toLowerCase() === markaSzuro.toLowerCase()
      );
    }

    if (szinSzuro && szinSzuro !== "Összes") {
      lista = lista.filter(
        (t) => t.szin?.toLowerCase() === szinSzuro.toLowerCase()
      );
    }

    if (tipusSzuro && tipusSzuro !== "Összes") {
      lista = lista.filter(
        (t) => t.tipus?.toLowerCase() === tipusSzuro.toLowerCase()
      );
    }

    lista.sort((a, b) => (b.pozicio || 0) - (a.pozicio || 0));

    if (rendezAllapot.mező) {
      const { mező, irany } = rendezAllapot;
      lista.sort((a, b) => {
        if (mező === "nev") {
          const na = (a.nev || "").toLowerCase();
          const nb = (b.nev || "").toLowerCase();
          const cmp = na.localeCompare(nb, "hu", { sensitivity: "base" });
          return irany === "asc" ? cmp : -cmp;
        }
        if (mező === "ar") {
          const pa = Number(a.ar || 0);
          const pb = Number(b.ar || 0);
          return irany === "asc" ? pa - pb : pb - pa;
        }
        return 0;
      });
    }

    return lista;
  }, [
    termekek,
    kategoriaSzuro,
    markaSzuro,
    szinSzuro,
    tipusSzuro,
    rendezAllapot,
  ]);

  useEffect(() => {
    setDragolhatoLista(feldolgozottLista);
  }, [feldolgozottLista]);

  const valtasNevSzerintRendez = () => {
    setRendezAllapot((r) => {
      if (r.mező !== "nev") return { mező: "nev", irany: "asc" };
      if (r.irany === "asc") return { mező: "nev", irany: "desc" };
      return { mező: null, irany: null };
    });
  };

  const valtasArSzerintRendez = () => {
    setRendezAllapot((r) => {
      if (r.mező !== "ar") return { mező: "ar", irany: "asc" };
      return { mező: "ar", irany: r.irany === "asc" ? "desc" : "asc" };
    });
  };

  const szurokEsRendezesTorlese = () => {
    setKategoriaSzuro("Összes");
    setMarkaSzuro("Összes");
    setSzinSzuro("Összes");
    setTipusSzuro("Összes");
    setRendezAllapot({ mező: null, irany: null });
  };

  const nyitTorlesModal = (termek) => {
    setTorlendoTermek(termek);
    setMutatTorlesModal(true);
  };

  const zarTorlesModal = () => {
    setMutatTorlesModal(false);
    setTorlendoTermek(null);
  };

  const megerositTorles = async () => {
    if (!torlendoTermek) return;
    try {
      setTorlesFolyamatban(true);
      axios.defaults.withCredentials = true;
      const valasz = await axios.post(`${backendUrl}/api/termek/torles`, {
        termekId: torlendoTermek._id,
      });

      if (valasz.data.siker) {
        toast.success(valasz.data.uzenet);
        lekerListat();
      } else {
        toast.error(valasz.data.uzenet);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setTorlesFolyamatban(false);
      zarTorlesModal();
    }
  };
  const dragVege = async (eredmeny) => {
    if (!eredmeny.destination) return;
    const elemek = Array.from(dragolhatoLista);
    const [atmozgatott] = elemek.splice(eredmeny.source.index, 1);
    elemek.splice(eredmeny.destination.index, 0, atmozgatott);
    setDragolhatoLista(elemek);

    const ujPoziciok = elemek.map((elem, idx) => ({
      _id: elem._id,
      pozicio: elemek.length - idx,
    }));

    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/api/termek/sorrend`, {
        poziciok: ujPoziciok,
      });
    } catch (err) {
      toast.error("Sorrend mentése sikertelen!");
    }
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-3">
        <p className="text-lg font-medium">Összes termék</p>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <label className="text-sm flex items-center gap-2">
            <span className="text-xs">Kategória:</span>
            <select
              className="border px-2 py-1 rounded"
              value={kategoriaSzuro}
              onChange={(e) => setKategoriaSzuro(e.target.value)}
            >
              {KATEGORIAK.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm flex items-center gap-2">
            <span className="text-xs">Márka:</span>
            <select
              className="border px-2 py-1 rounded"
              value={markaSzuro}
              onChange={(e) => setMarkaSzuro(e.target.value)}
            >
              {MARKAK.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm flex items-center gap-2">
            <span className="text-xs">Típus:</span>
            <select
              className="border px-2 py-1 rounded"
              value={tipusSzuro}
              onChange={(e) => setTipusSzuro(e.target.value)}
            >
              {TIPUSOK.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm flex items-center gap-2">
            <span className="text-xs">Szín:</span>
            <select
              className="border px-2 py-1 rounded"
              value={szinSzuro}
              onChange={(e) => setSzinSzuro(e.target.value)}
            >
              {SZINEK.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={szurokEsRendezesTorlese}
            className="text-sm px-3 py-1 border rounded bg-gray-50 hover:bg-gray-100"
          >
            Visszaállítás
          </button>
        </div>
      </div>

      {betoltes && (
        <div className="mb-4 text-sm text-slate-600">Betöltés...</div>
      )}

      <div className="flex flex-col gap-2">
        <div className="hidden md:grid grid-cols-[72px_2fr_1fr_1fr_1fr_1fr_96px_160px] items-center py-2 px-3 border bg-gray-100 text-sm font-semibold">
          <div>Kép</div>
          <button
            className="text-left flex items-center gap-1"
            onClick={valtasNevSzerintRendez}
          >
            Név
            {rendezAllapot.mező === "nev" ? (
              rendezAllapot.irany === "asc" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            ) : null}
          </button>
          <div>Kategória</div>
          <div>Típus</div>
          <div>Márka</div>
          <div>Szín</div>
          <button
            className="flex items-center gap-1 justify-end"
            onClick={valtasArSzerintRendez}
          >
            Ár
            {rendezAllapot.mező === "ar" ? (
              rendezAllapot.irany === "asc" ? (
                <ChevronUp size={14} />
              ) : (
                <ChevronDown size={14} />
              )
            ) : null}
          </button>
          <div className="text-center">Műveletek</div>
        </div>

        {feldolgozottLista.length === 0 ? (
          <div className="py-6 text-center text-sm text-slate-500">
            Nincs találat
          </div>
        ) : kategoriaSzuro === "Összes" &&
          markaSzuro === "Összes" &&
          szinSzuro === "Összes" &&
          tipusSzuro === "Összes" &&
          !rendezAllapot.mező ? (
          <DragDropContext onDragEnd={dragVege}>
            <Droppable droppableId="droppable-lista">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {dragolhatoLista.map((elem, index) => (
                    <Draggable
                      key={elem._id || index}
                      draggableId={String(elem._id || index)}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`grid grid-cols-[72px_2fr_1fr_1fr_1fr_1fr_96px_160px] gap-2 items-center py-2 px-3 border text-sm bg-white ${
                            snapshot.isDragging ? "shadow-lg bg-blue-50" : ""
                          }`}
                          style={{
                            ...provided.draggableProps.style,
                            cursor: "grab",
                          }}
                        >
                          <div className="flex items-center">
                            <img
                              className="w-24 h-12 object-cover rounded"
                              src={(elem.kepek && elem.kepek[0]) || ""}
                              alt={elem.nev || "termék kép"}
                              onError={(e) => (e.currentTarget.src = "")}
                            />
                          </div>
                          <div className="truncate">{elem.nev}</div>
                          <div>{elem.kategoria || "-"}</div>
                          <div>{elem.tipus || "-"}</div>
                          <div>{elem.marka || "-"}</div>
                          <div>{elem.szin || "-"}</div>
                          <div className="text-right font-medium">
                            {(elem.ar ?? 0) + " " + penznem}
                          </div>
                          <div className="flex gap-2 justify-end md:justify-center">
                            <button
                              onClick={() => nyitTorlesModal(elem)}
                              className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                              Törlés
                            </button>
                            <Link
                              to={`/termek-lista/${elem._id}`}
                              className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                              Módosítás
                            </Link>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          dragolhatoLista.map((elem, index) => (
            <div
              key={elem._id || index}
              className="grid grid-cols-[72px_2fr_1fr_1fr_1fr_1fr_96px_160px] gap-2 items-center py-2 px-3 border text-sm bg-white"
            >
              <div className="flex items-center">
                <img
                  className="w-24 h-12 object-cover rounded"
                  src={(elem.kepek && elem.kepek[0]) || ""}
                  alt={elem.nev || "termék kép"}
                  onError={(e) => (e.currentTarget.src = "")}
                />
              </div>
              <div className="truncate">{elem.nev}</div>
              <div>{elem.kategoria || "-"}</div>
              <div>{elem.tipus || "-"}</div>
              <div>{elem.marka || "-"}</div>
              <div>{elem.szin || "-"}</div>
              <div className="text-right font-medium">
                {(elem.ar ?? 0) + " " + penznem}
              </div>
              <div className="flex gap-2 justify-end md:justify-center">
                <button
                  onClick={() => nyitTorlesModal(elem)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  Törlés
                </button>
                <Link
                  to={`/termek-lista/${elem._id}`}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Módosítás
                </Link>
              </div>
            </div>
          ))
        )}
      </div>

      {mutatTorlesModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={zarTorlesModal}
          />

          <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
            <h3 className="text-lg font-semibold mb-2">Biztos törlöd?</h3>
            <p className="text-sm text-gray-700 mb-4">
              {torlendoTermek
                ? `Biztosan törlöd a "${torlendoTermek.nev}" terméket? Ez a művelet nem visszavonható!`
                : "Biztosan törölni szeretnéd a kiválasztott terméket?"}
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={zarTorlesModal}
                className="px-4 py-2 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
              >
                Mégse
              </button>
              <button
                onClick={megerositTorles}
                disabled={torlesFolyamatban}
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 font-semibold disabled:opacity-50"
              >
                {torlesFolyamatban ? "Törlés..." : "Törlés"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermekLista;
