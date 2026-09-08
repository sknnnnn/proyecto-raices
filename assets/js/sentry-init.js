/* =========================================================
   SENTRY — MONITOREO DE ERRORES (PRO-52)
   ---------------------------------------------------------
   Inicialización mínima del SDK de Sentry para navegador,
   cargado vía CDN (ver el <script> de Sentry justo antes de
   este archivo, en cada página). Separado a propósito de
   supabase-client.js/data-api.js/main.js: Sentry no conoce ni
   depende de la lógica de negocio del sitio.

   Alcance deliberadamente mínimo — sólo error monitoring:
     - errores JS no controlados (window.onerror)
     - promesas rechazadas sin catch (unhandledrejection)
   Sin performance monitoring, sin session replay, sin profiling
   (no se configura tracesSampleRate/replaysSessionSampleRate ni
   se cargan esos integrations).

   SENTRY_DSN: DSN PÚBLICO del proyecto en sentry.io (Settings →
   Client Keys / DSN). No es un secreto — es el mecanismo oficial
   de Sentry para SDKs de browser, pensado para exponerse en
   código de frontend (ver https://docs.sentry.io/platforms/javascript/).
   Placeholder hasta crear el proyecto en sentry.io — con este
   valor, Sentry.init() no se ejecuta (ver guarda abajo) y el
   sitio sigue funcionando exactamente igual que sin Sentry. */
const SENTRY_DSN = "COMPLETAR"; // TODO(PRO-52): pegar acá el DSN público una vez creado el proyecto en sentry.io

if (typeof Sentry !== "undefined" && SENTRY_DSN && SENTRY_DSN !== "COMPLETAR") {
  Sentry.init({
    dsn: SENTRY_DSN,
    // "proyecto-raices.com.ar" es el dominio de producción real
    // (ver CLAUDE.md/PROJECT-CONTEXT.md); cualquier otro host
    // (preview, local, staging) se reporta como "development" para
    // no mezclar ruido de desarrollo con errores de producción.
    environment: location.hostname === "proyectoraices.com.ar" ? "production" : "development"
  });
}
