/* =========================================================
   CONFIGURACIÓN DEL SITIO — PROYECTO RAÍCES
   Editá los valores de este archivo para actualizar los
   datos de contacto en TODA la web (footer, sección de
   contacto, botón de WhatsApp, etc.) sin tocar el HTML.
   ========================================================= */

const SITE_CONFIG = {
  nombre: "Proyecto Raíces",
  dominio: "https://proyectoraices.com.ar",

  // Datos de contacto reales provistos por el cliente.
  email: "proyectoraicestravel@gmail.com",

  // Número de WhatsApp oficial: +54 9 280 497-1939.
  whatsapp: "5492804971939",

  instagram: "@proyectotravesia",
  instagramUrl: "https://instagram.com/proyectotravesia",

  tiktok: "@proyectotravesia",
  tiktokUrl: "https://www.tiktok.com/@proyectotravesia",

  horarios: [
    { dias: "Lunes a Viernes", horas: "8:00 – 20:00" },
    { dias: "Sábados y Domingos", horas: "10:00 – 16:00" }
  ],

  ubicacionBase: "Buenos Aires, Argentina",

  // Texto base de "Nosotros" (provisto por el cliente).
  nosotrosTexto: "Somos tres integrantes de Buenos Aires, Argentina, enfocados en crear y personalizar experiencias de viaje. Nos especializamos en turismo nacional e internacional. Contamos con salidas grupales, paquetes a medida y atención personalizada.",

  fraseHero: "Creamos y seleccionamos experiencias de viaje únicas para conectar personas con destinos, culturas y momentos que quedan para siempre."
};

// Arma el link de WhatsApp con mensaje precargado (si hay número cargado).
function whatsappLink(mensaje){
  if (!SITE_CONFIG.whatsapp) return null;
  const texto = encodeURIComponent(mensaje || "Hola, quiero consultar por una experiencia de Proyecto Raíces.");
  return `https://wa.me/${SITE_CONFIG.whatsapp}?text=${texto}`;
}

function mailtoLink(asunto){
  const subject = encodeURIComponent(asunto || "Consulta desde la web");
  return `mailto:${SITE_CONFIG.email}?subject=${subject}`;
}
