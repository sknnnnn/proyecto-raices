/* =========================================================
   GUÍAS / COLABORADORES — PROYECTO RAÍCES
   ---------------------------------------------------------
   Todavía no tenemos los perfiles definitivos: los datos de
   abajo son PLACEHOLDERS claramente identificados. Reemplazá
   nombre, foto, especialidad y descripción por los datos
   reales de cada guía. Para agregar un guía nuevo, copiá un
   objeto del array.
   ========================================================= */

const GUIAS = [
  {
    id: "guia-1",
    esPlaceholder: true,
    nombre: "[Nombre del guía]",
    foto: null,
    ubicacion: "[Ciudad, país]",
    especialidad: "[Especialidad — ej. trekking de montaña]",
    descripcion: "Breve descripción de ejemplo. Reemplazar por la bio real del guía: experiencia, certificaciones y qué lo/la caracteriza acompañando grupos.",
    experienciasRelacionadas: ["trekking-patagonia-ejemplo"]
  },
  {
    id: "guia-2",
    esPlaceholder: true,
    nombre: "[Nombre del guía]",
    foto: null,
    ubicacion: "[Ciudad, país]",
    especialidad: "[Especialidad — ej. camping y naturaleza]",
    descripcion: "Breve descripción de ejemplo. Reemplazar por la bio real del guía.",
    experienciasRelacionadas: ["camping-patagonia-ejemplo"]
  },
  {
    id: "guia-3",
    esPlaceholder: true,
    nombre: "[Nombre del guía]",
    foto: null,
    ubicacion: "[Ciudad, país]",
    especialidad: "[Especialidad — ej. cultura andina]",
    descripcion: "Breve descripción de ejemplo. Reemplazar por la bio real del guía.",
    experienciasRelacionadas: ["andes-peru-ejemplo"]
  }
];

function getGuiaPorId(id){
  return GUIAS.find(g => g.id === id);
}
