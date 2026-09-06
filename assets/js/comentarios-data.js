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
   1. Copiá la forma de objeto de más arriba (nombre/destino/
      experiencia/estrellas/texto).
   2. Completá sus 5 campos con una reseña real.
   3. Sumalo al array (en cualquier posición).
   Para sacar un comentario, borrá su objeto del array.

   Vacío a propósito: todavía no hay reseñas reales cargadas.
   Con el array vacío, tanto el carrusel de Inicio como la grilla
   de comentarios.html ocultan la sección/muestran un estado vacío
   en vez de mostrar contenido de ejemplo como si fuera real (ver
   initTestimoniosCarousel/initComentariosGrid en main.js). No
   completar con reseñas inventadas.
   ========================================================= */

const comentarios = [];
