# Proyecto Raíces — Contexto del Proyecto

## 1. Propósito

Proyecto Raíces es una marca de turismo aventura enfocada en experiencias para conectar con cada lugar.

La web funciona principalmente como catálogo + contacto/consulta. No es una tienda online tradicional.

La propuesta actual se centra en destinos de Argentina y Perú, con posibilidad de ampliar destinos en el futuro.

### Concepto de marca

"Viajes para conectar con cada lugar."

La comunicación debe transmitir:

* aventura
* naturaleza
* exploración
* conexión con los lugares
* experiencias auténticas
* cercanía
* identidad local

Evitar una estética de agencia de viajes genérica o excesivamente corporativa.

### Identidad y estrategia de marca (resumen)

Proyecto Raíces conecta personas, guías y territorios a través de experiencias de turismo aventura (trekking, hiking, MTB, buceo, salidas de uno o varios días, paquetes), priorizando confianza, seguridad y respeto por el lugar visitado. Principio central: **la experiencia vale más que la transacción**.

Personalidad: humana, cercana, aventurera, curiosa, consciente, confiable, humilde, comunitaria — evitar lo artificial, frío, excesivamente premium o corporativo.

Diferencial: lugares menos convencionales, conexión humana, confianza y calidad de servicio por sobre precio.

Territorio conceptual (pilares de marca): **Raíces** (origen, pertenencia), **Conexión** (personas, lugares, guías), **Movimiento** (aventura, libertad), **Experiencia** (lo vivido por sobre lo transaccional).

Identidad visual vigente: ver §5 más abajo (paleta, tipografías, logo). Destinos actuales relevantes: ver §4 más abajo (Argentina: 6 destinos reales; Perú sin cambios; "Patagonia" ya no es destino navegable).

Fuente estratégica ampliada (esencia, historia, público, motivaciones, relación con viajeros y guías, visión de red, conceptos exploratorios): `BRAND-BIBLE.md`.

## 2. Estructura general

La navegación principal debe contemplar:

* Inicio
* Destinos
* Experiencias
* Galería
* Comentarios
* Nosotros
* Contacto

Dentro de Experiencias existen tres tipos:

* Tours
* Travesías
* Paquetes

### Definiciones

**Tours:**

* Experiencias de 1 día.
* Actividades puntuales.
* No deben confundirse con travesías o paquetes.

**Travesías:**

* Experiencias de varios días.
* Son experiencias de viaje/aventura.
* No incluyen necesariamente traslados de aeropuerto, hoteles, etc.

**Paquetes:**

* Producto más completo.
* Puede incluir transporte, alojamiento, comidas y actividades.

Estas categorías deben mantenerse diferenciadas tanto en contenido como en interfaz.

### Navegación validada (no rediseñar)

* Experiencias → País → Destino → Experiencias
* Destinos → Destino → filtros → Experiencias
* Desde cada destino: Destino → Tours / Travesías / Paquetes

Esta arquitectura es funcional y reutilizable. No crear un sistema de navegación nuevo si esto ya resuelve el caso.

## 3. Experiencias

La dirección actual es evitar que Tours, Travesías y Paquetes se sientan como tres sitios separados.

La sección Experiencias debe funcionar como un sistema unificado.

Las experiencias pueden identificarse mediante chips/etiquetas:

* TOUR
* TRAVESÍA
* PAQUETE

Cuando corresponda, debe existir una vista donde el usuario pueda consultar todas las experiencias/tours disponibles, sin perder la posibilidad de filtrar o navegar por tipo.

No mostrar filtros irrelevantes para el contexto actual.

Si el usuario está dentro de Tours, no mostrar filtros de Travesías y Paquetes sin una justificación clara.

## 4. Destinos

Destinos actuales (estado real en `destinos-data.js`, corregido 2026-09-05 — "Patagonia" ya no es un destino navegable, se dividió en destinos reales):

**Argentina**

* Bariloche
* Ushuaia
* San Martín de los Andes
* Villa Pehuenia
* Norte Neuquino
* Norte Argentino (en preparación, sin contenido real todavía)

**Perú**

* Cusco (destino "peru" en los datos)
* Choquequirao
* Paracas (en preparación)
* Huacachina (en preparación)
* Arequipa (en preparación)
* Lima (en preparación)

No reintroducir "Patagonia" como destino navegable. Sigue siendo válida solo como referencia geográfica en textos.

La tarjeta de Perú debe poder comunicar claramente que incluye destinos como Cusco, entre otros.

Cuando se presenten destinos nacionales agrupados, priorizar una composición visual horizontal y coherente.

La información debe mantenerse clara y no sobrecargar las tarjetas.

## 5. Identidad visual

### Paleta actual (jerarquía aprobada 2026-09-05)

* Verde `#013020` — **color base** de la identidad visual. No implica fondo verde plano ni grandes superficies verdes oscuras: debe integrarse con superficies, fotografía y espacio en una composición equilibrada.
* Naranja `#ff5b28` — **acento principal / CTA** y acciones importantes.
* Amarillo `#e9e073` — **acento secundario**, detalles puntuales.
* Azul `#8ba6b7`, Marrón `#8d4b12`, Verde `#43612f`, Verde oliva `#6a7133` — colores complementarios, se mantienen y se usan cuando corresponda.

No es obligatorio usar los tres colores jerárquicos constantemente en cada sección.

### Logo

La versión preferida actualmente es el logo amarillo:
`assets/img/logo-amarillo.png`

Priorizar esta versión salvo indicación explícita en contrario.

### Tipografías

* Alte Haas Grotesk → títulos / headings
* Cascadia Mono Semi → textos
* Arial Rounded → textos pequeños / elementos secundarios cuando corresponda

Mantener consistencia tipográfica.

## 6. Dirección fotográfica

Las fotografías son una parte fundamental de la identidad visual.

Priorizar:

* paisajes reales
* personas viviendo las experiencias
* montaña
* naturaleza
* aventura
* elementos característicos de cada destino
* imágenes con composición fuerte

Las imágenes deben mostrar correctamente los elementos importantes de la fotografía.

Ejemplo: si una fotografía tiene llamas, montañas u otro elemento protagonista, evitar recortarlo innecesariamente.

Evitar:

* overlays verdes excesivos
* filtros que oculten la fotografía
* crops arbitrarios
* imágenes deformadas
* proporciones inconsistentes entre cards similares

Las imágenes de cards deben mantener proporciones consistentes dentro de cada sistema de componentes.

## 7. Hero / portadas

Las portadas y heroes deben priorizar la fotografía.

El diseño debe permitir que se vea una parte significativa de la imagen original.

Evitar que:

* el overlay cubra demasiado la fotografía
* el contenido tape los elementos importantes
* el hero quede dominado por un bloque de color
* el recorte elimine el punto focal de la imagen

Cuando se modifique un hero, revisar:

* desktop
* mobile
* posición del contenido
* crop de la imagen
* legibilidad del texto

## 8. Cards

Las cards deben ser visualmente consistentes.

Evitar:

* textos cortados
* títulos truncados accidentalmente
* imágenes con proporciones diferentes sin intención
* cards con alturas inconsistentes cuando forman una grilla
* botones desplazados por diferencias de contenido
* imágenes horizontales que hagan que una card parezca visualmente más pequeña
* contenido que desborde

Priorizar responsive design y comportamiento natural del contenido antes que ocultar texto mediante truncamientos agresivos.

## 9. Galería

La sección de galería se plantea como Comunidad Raíces.

Debe transmitir que las fotografías también pueden provenir de la comunidad/viajeros.

Invitar a los usuarios a compartir fotografías de sus experiencias.

Contacto: `proyectoraicestravel@gmail.com`

La galería debe sentirse integrada con la identidad de la marca y no como un simple grid genérico de imágenes.

## 10. CTAs y consultas

CTA principal: **Consultar**

Según el contexto también puede utilizarse: **Reservar ahora**

Las consultas/reservas pueden derivar a:

* WhatsApp
* Google Forms
* otros mecanismos definidos para cada experiencia

No convertir el sitio en un e-commerce si no se solicita explícitamente.

## 11. Referencias visuales

Referencias utilizadas:

* WAMANI Turismo
* NicoTrip
* TrekaTravel

Sirven para estudiar composición, jerarquía, fotografía, navegación, presentación de experiencias y sensación general.

No copiar diseños literalmente.

## 12. Principios de UX

La web debe ser:

* clara
* visual
* fácil de recorrer
* orientada a experiencias
* responsive
* rápida
* coherente entre secciones

El usuario debe poder entender rápidamente:

1. dónde está
2. qué experiencia está viendo
3. qué tipo de experiencia es
4. dónde se realiza
5. qué incluye
6. cómo consultar/reservar

Evitar interfaces con demasiados filtros, categorías o elementos que no aporten al contexto actual.

## 13. Estado conceptual actual

El proyecto está en desarrollo activo.

La prioridad actual es refinar la experiencia visual y la organización del contenido, especialmente:

* Experiencias
* Tours
* Travesías
* Paquetes
* Galería
* cards
* portadas/heroes
* imágenes
* responsive
* navegación

El objetivo no es agregar complejidad, sino conseguir una web visualmente sólida, clara y coherente.

Se exploraron 2 rondas de direcciones visuales comparativas (3 propuestas cada una); ninguna fue aprobada (detalle y criterios en `CLAUDE.md` §19-20). No hay todavía una dirección visual nueva aprobada más allá de la jerarquía de color de §5.

## 14. Regla de oro

Proyecto Raíces debe sentirse como una marca de experiencias de viaje, no como un catálogo genérico de paquetes turísticos.

Cada decisión de diseño debe priorizar: **fotografía + experiencia + lugar + claridad**.

---

## Importante sobre este contexto

Este documento debe funcionar como contexto vivo del proyecto.

Si en el futuro se modifica una decisión de contenido, estructura, branding o UX, actualizar `PROJECT-CONTEXT.md` en lugar de acumular esa información innecesariamente en `CLAUDE.md`.

No inventes información que no esté definida.
