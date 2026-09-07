/* =========================================================
   SUPABASE CLIENT — PROYECTO RAÍCES
   ---------------------------------------------------------
   Única fuente de la URL y la clave pública del proyecto.
   Ningún otro archivo debe conocer estos valores directamente:
   todo acceso a Supabase pasa por data-api.js, que usa el
   cliente inicializado acá.

   La clave usada es "anon"/"publishable" (pública por diseño):
   la protección de los datos la da RLS en Supabase (políticas
   de lectura pública ya configuradas por tabla), no el secreto
   de esta clave. Nunca agregar acá una "service_role key".

   Requiere que la página haya cargado antes el SDK de Supabase
   vía CDN (UMD), que expone el global "supabase":
     <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/dist/umd/supabase.js"></script>
   ========================================================= */

const SUPABASE_URL = "https://zvssmqhwotwgjmpdqoax.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_TWbfqmDOzgKTr0rGUWyECQ_UJ70f2OV";

const supabaseClient = (typeof window !== "undefined" && window.supabase)
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;
