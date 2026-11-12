/** Mobile Aula 08. Production remains disabled until exact approval. */
(() => {
  'use strict';
  const PROD_ENDPOINT = '';
  const PROD_RELEASE_ENABLED = false;
  const canonical = /^\/teaching-mobile\/lessons\/aula-08-av1-incremento-1\/laboratorio-vivo\/(?:index\.html)?$/;
  const published = location.origin === 'https://thalesvalente.github.io';
  const prodActive = published && canonical.test(location.pathname) && PROD_RELEASE_ENABLED && /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(PROD_ENDPOINT);
  const qaRequested=!prodActive&&['localhost','127.0.0.1','[::1]'].includes(location.hostname)&&new URLSearchParams(location.search).get('qa')==='1';
  const protectedIds=new Set(['1pkbf3rJD3R5-lX7TuOyfir0A4ID1m2QfUg8ZIfNOeT0','1z5VEmScYCtfsEGg0AahY3cHE5eYO79Zj0xLMzx4iT0Y','1cPQD_ie3cEqt11fLXT398DPQIi5bnqkmTqfl9yk8a_Q']);
  let qaEndpoint='';
  const base={activity:'MOBILE-A08-2026',schema:'mobile-a08-lab-v4',requiredVersion:'mobile-notas-4.1.0'};
  async function configureQa(value){
    if(!qaRequested||qaEndpoint)return false;
    const candidate=String(value||'').trim();
    if(!/^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/.test(candidate)||!window.WebProductionGate?.ensureReady)return false;
    const health=await window.WebProductionGate.ensureReady({...base,endpoint:candidate,requiredMode:'QA',allowClosed:true});
    if(health.mode!=='QA'||health.dataPolicy!=='SYNTHETIC_ONLY'||typeof health.spreadsheetId!=='string'||!health.spreadsheetId||protectedIds.has(health.spreadsheetId))return false;
    qaEndpoint=candidate;return true;
  }
  window.WebEntregaConfig = Object.freeze({
    ...base,get endpoint(){return prodActive?PROD_ENDPOINT:qaEndpoint;},
    get activated(){return prodActive||Boolean(qaEndpoint);},
    get qaMode(){return Boolean(qaEndpoint);},qaRequested,
    get requiredMode(){return prodActive?'PROD':qaEndpoint?'QA':null;},configureQa
  });
})();
