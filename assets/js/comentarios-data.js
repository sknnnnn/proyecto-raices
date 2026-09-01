/* =========================================================
   COMENTARIOS — PROYECTO RAÍCES
   ---------------------------------------------------------
   Reseñas que se muestran en el carrusel "Lo que dicen" de
   Inicio. El HTML y el carrusel no cambian nunca: para
   agregar, sacar o editar un comentario alcanza con tocar
   este archivo.

   Cada comentario tiene:
     nombre      string  → quién lo dejó
     destino     string  → destino de la experiencia
     experiencia string  → tipo de salida (Tour, Travesía, Paquete, etc.)
     estrellas   number  → puntuación, de 1 a 5
     texto       string  → el comentario en sí

   Para agregar un comentario nuevo:
   1. Copiá uno de los objetos de abajo.
   2. Completá sus 5 campos.
   3. Sumalo al array (en cualquier posición).
   Para sacar un comentario, borrá su objeto del array.

   Los que están ahora son de ejemplo/provisorios, pensados
   para probar el carrusel — reemplazarlos por reseñas reales
   antes de publicar la web.
   ========================================================= */

const comentarios = [
  {
    nombre: "Nombre de ejemplo",
    destino: "Patagonia",
    experiencia: "Travesía",
    estrellas: 5,
    texto: "Una experiencia distinta a cualquier tour tradicional. El grupo chico hizo toda la diferencia y se sintió una salida entre amigos, no una excursión más."
  },
  {
    nombre: "Nombre de ejemplo",
    destino: "Cusco",
    experiencia: "Paquete",
    estrellas: 5,
    texto: "Los guías conocen cada rincón de Cusco y del Valle Sagrado. Volví con ganas de hacer todas las rutas que todavía me faltan."
  },
  {
    nombre: "Nombre de ejemplo",
    destino: "Norte Argentino",
    experiencia: "Tour",
    estrellas: 4,
    texto: "Organización impecable de principio a fin. El único punto a mejorar fue el horario de salida, pero el resto superó lo que esperaba."
  },
  {
    nombre: "Nombre de ejemplo",
    destino: "Cusco",
    experiencia: "Tour",
    estrellas: 5,
    texto: "Se nota que arman cada salida con cariño. Fuimos pocos, el ritmo fue humano y terminé conociendo Cusco de una forma que sola nunca hubiera logrado."
  },
  {
    nombre: "Nombre de ejemplo",
    destino: "Patagonia",
    experiencia: "Camping",
    estrellas: 5,
    texto: "Dormir bajo las estrellas con un grupo copado y un guía que sabía responder cualquier pregunta. Ya estoy averiguando la próxima fecha."
  }
];
