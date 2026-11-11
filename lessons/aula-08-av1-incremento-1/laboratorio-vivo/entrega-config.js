/** Mobile Aula 08 · contrato isolado. Não reutilizar endpoint Web.
 * Por padrão o envio é negado. Liberação exige homologação no Google,
 * revisão docente da rubrica e alteração explícita neste arquivo.
 */
(() => {
  'use strict';
  const PROD_ENDPOINT = ''; // Preencher somente após implantação Mobile homologada.
  const PROD_RELEASE_ENABLED = false;
  const canonical = /^\/teaching-mobile\/lessons\/aula-08-av1-incremento-1\/laboratorio-vivo\/(?:index\.html)?$/;
  const published = window.location.origin === 'https://thalesvalente.github.io';
  const prodActive = published && canonical.test(location.pathname) &&
    PROD_RELEASE_ENABLED && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(PROD_ENDPOINT);
  window.WebEntregaConfig = Object.freeze({
    get endpoint() { return prodActive ? PROD_ENDPOINT : ''; },
    get activated() { return prodActive; },
    get qaMode() { return false; },
    qaRequested: false,
    get requiredMode() { return prodActive ? 'PROD' : null; },
    activity: 'MOBILE-A08-2026',
    schema: 'mobile-a08-lab-v4',
    requiredVersion: 'mobile-notas-4.0.0',
    configureQa: async () => false,
  });
})();
