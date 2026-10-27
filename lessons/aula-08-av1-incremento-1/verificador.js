/** Executa fontes não confiáveis somente em workers descartáveis de origem opaca. */
const MAX_CASES = 100;
const MAX_OUTPUT = 16384;

// Esta função vira um módulo worker. Nenhuma fonte de aluno é interpolada em HTML.
function workerBootstrap() {
  const send = globalThis.postMessage.bind(globalThis);
  const stringify = JSON.stringify.bind(JSON);
  const parse = JSON.parse.bind(JSON);
  const createUrl = URL.createObjectURL.bind(URL);
  const revokeUrl = URL.revokeObjectURL.bind(URL);
  const NativeBlob = Blob;
  const define = Object.defineProperty;
  const encode = new TextEncoder();
  const finite = Number.isFinite, array = Array.isArray;
  const ownKeys = Reflect.ownKeys, descriptors = Object.getOwnPropertyDescriptors;
  const proto = Object.getPrototypeOf, objectPrototype = Object.prototype, arrayPrototype = Array.prototype;
  // Evita que JSON.stringify transforme NaN em null, descarte undefined ou
  // invoque toJSON/getters plantados pela fonte antes da validação do contrato.
  Object.freeze(objectPrototype); Object.freeze(arrayPrototype);
  const rawJson = (value, depth = 0) => {
    if (depth > 16) return false;
    if (value === null || typeof value === 'boolean') return true;
    if (typeof value === 'string') return value.length <= 12000;
    if (typeof value === 'number') return finite(value);
    if (typeof value !== 'object') return false;
    const isArray = array(value), keys = ownKeys(value), props = descriptors(value);
    if (isArray ? proto(value) !== arrayPrototype || value.length > 150 : proto(value) !== objectPrototype || keys.length > 100) return false;
    if (isArray && keys.length !== value.length + 1) return false;
    for (const key of keys) {
      if (typeof key !== 'string' || ['__proto__', 'constructor', 'prototype', 'toJSON'].includes(key)) return false;
      if (isArray && key === 'length') continue;
      if (isArray && !/^(0|[1-9][0-9]*)$/.test(key)) return false;
      const descriptor = props[key];
      if (descriptor.get || descriptor.set || !rawJson(descriptor.value, depth + 1)) return false;
    }
    return true;
  };
  // O CSP é a barreira de rede; remover APIs também reduz a superfície exposta.
  for (const key of ['fetch', 'XMLHttpRequest', 'WebSocket', 'WebTransport',
    'EventSource', 'importScripts', 'Worker', 'SharedWorker', 'BroadcastChannel',
    'indexedDB', 'caches', 'navigator', 'FileSystemHandle', 'RTCPeerConnection',
    'postMessage']) {
    try { define(globalThis, key, { value: undefined, configurable: false, writable: false }); }
    catch { /* Origem opaca e CSP continuam obrigatórios. */ }
  }
  globalThis.onmessage = async ({ data }) => {
    globalThis.onmessage = null;
    const { nonce, job } = data;
    let sourceUrl;
    try {
      const input = parse(stringify(job.input));
      const before = stringify(input);
      sourceUrl = createUrl(new NativeBlob([job.code], { type: 'text/javascript' }));
      const module = await import(sourceUrl);
      if (typeof module.resolver !== 'function') throw Error('resolver ausente');
      const value = await module.resolver(input);
      if (!rawJson(value)) throw Error('Saída não é JSON estrito');
      const serialized = stringify(value);
      if (typeof serialized !== 'string' || encode.encode(serialized).length > 12000) throw Error('Saída excessiva');
      // JSON round-trip não permite funções, referências a DOM ou objetos vivos.
      send({ type: 'case-result', nonce, output: {
        id: job.id, ok: true, value: parse(serialized), unchanged: before === stringify(input)
      } });
    } catch {
      send({ type: 'case-result', nonce, output: { id: job.id, ok: false, error: 'EXECUTION_ERROR' } });
    } finally { if (sourceUrl) revokeUrl(sourceUrl); }
  };
}

function frameBootstrap() {
  const ownNonce = document.currentScript.dataset.nonce;
  const send = payload => parent.postMessage({ ...payload, nonce: ownNonce }, '*');
  let started = false;
  const workers = new Set();
  addEventListener('pagehide', () => workers.forEach(worker => worker.terminate()));
  addEventListener('message', async event => {
    if (event.source !== parent || event.data?.nonce !== ownNonce || event.data?.type !== 'start' || started) return;
    started = true;
    const { jobs, workerCode, caseTimeout } = event.data;
    const workerUrl = URL.createObjectURL(new Blob([workerCode], { type: 'text/javascript' }));
    try {
      for (const job of jobs) {
        const output = await new Promise(resolve => {
          const nonce = crypto.randomUUID();
          // Worker clássico funciona com blob de origem opaca em Chromium.
          // A fonte do aluno continua carregada como módulo por import(blob).
          const worker = new Worker(workerUrl);
          workers.add(worker);
          let finished = false;
          const finish = output => {
            if (finished) return;
            finished = true; clearTimeout(timer); worker.terminate(); workers.delete(worker); resolve(output);
          };
          const timer = setTimeout(() => finish({ id: job.id, ok: false, error: 'TIMEOUT' }), caseTimeout);
          worker.onerror = () => finish({ id: job.id, ok: false, error: 'EXECUTION_ERROR' });
          worker.onmessage = ({ data }) => {
            if (data?.type !== 'case-result' || data.nonce !== nonce || data.output?.id !== job.id) return;
            finish(data.output);
          };
          worker.postMessage({ nonce, job });
        });
        send({ type: 'progress', output });
      }
      send({ type: 'complete' });
    } catch { send({ type: 'failure' }); }
    finally { workers.forEach(worker => worker.terminate()); workers.clear(); URL.revokeObjectURL(workerUrl); }
  });
  send({ type: 'ready' });
}

function isJson(value, depth = 0) {
  if (depth > 20) return false;
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (typeof value === 'number') return Number.isFinite(value);
  if (Array.isArray(value)) return value.length <= 1000 && value.every(v => isJson(v, depth + 1));
  if (typeof value !== 'object') return false;
  const keys = Object.keys(value);
  return keys.length <= 100 && keys.every(key => !['__proto__', 'constructor', 'prototype'].includes(key) && isJson(value[key], depth + 1));
}

export async function runChallenge(sources, cases, options = {}) {
  if (!Array.isArray(sources) || !Array.isArray(cases) || !cases.length || cases.length > MAX_CASES) throw Error('Desafio inválido.');
  const caseTimeout = Math.min(2000, Math.max(100, options.caseTimeoutMs || 750));
  const totalTimeout = Math.min(90000, Math.max(1000, options.totalTimeoutMs || 60000));
  const ids = new Set();
  const jobs = cases.map(c => {
    if (!c || typeof c.id !== 'string' || c.id.length > 80 || ids.has(c.id) || !['team', 'individual'].includes(c.scope) || !isJson(c.input)) throw Error('Caso oficial inválido.');
    ids.add(c.id);
    if (c.scope === 'individual' && (!Number.isInteger(c.slot) || c.slot < 1 || c.slot > 4)) throw Error('Slot oficial inválido.');
    const path = c.scope === 'team' ? 'src/equipe.mjs' : `src/individual/aluno${c.slot}.mjs`;
    const source = sources.find(source => source.path === path);
    if (!source || typeof source.code !== 'string' || new TextEncoder().encode(source.code).length > 16384) throw Error('Fonte permitida ausente.');
    return { id: c.id, input: c.input, code: source.code };
  });
  return new Promise((resolve, reject) => {
    const nonce = crypto.randomUUID();
    const scriptNonce = crypto.randomUUID().replaceAll('-', '');
    const frame = document.createElement('iframe');
    frame.hidden = true; frame.title = 'Verificação isolada de funções';
    frame.setAttribute('sandbox', 'allow-scripts');
    frame.setAttribute('referrerpolicy', 'no-referrer');
    const outputs = [];
    let done = false, started = false;
    const finish = error => {
      if (done) return; done = true; clearTimeout(timer);
      removeEventListener('message', receive); frame.remove();
      error ? reject(error) : resolve(outputs);
    };
    const timer = setTimeout(() => finish(Error('A verificação demorou demais. Revise laços e tente novamente.')), totalTimeout);
    const receive = event => {
      if (event.source !== frame.contentWindow || event.origin !== 'null') return;
      const data = event.data;
      if (!data || data.nonce !== nonce || typeof data.type !== 'string') return;
      if (data.type === 'ready' && !started) {
        started = true;
        frame.contentWindow.postMessage({ type: 'start', nonce, jobs, caseTimeout,
          workerCode: `(${workerBootstrap.toString()})();` }, '*');
      } else if (data.type === 'progress' && started) {
        const output = data.output, expected = jobs[outputs.length];
        if (!expected || output?.id !== expected.id || typeof output.ok !== 'boolean' ||
            JSON.stringify(output).length > MAX_OUTPUT ||
            (output.ok ? !isJson(output.value) || typeof output.unchanged !== 'boolean' : !['TIMEOUT', 'EXECUTION_ERROR'].includes(output.error))) {
          return finish(Error('Resposta isolada inválida.'));
        }
        outputs.push(output);
        options.onProgress?.(outputs.length, jobs.length);
      } else if (data.type === 'complete' && outputs.length === jobs.length) finish();
      else if (data.type === 'failure') finish(Error('Não foi possível iniciar a verificação isolada neste navegador.'));
    };
    addEventListener('message', receive);
    frame.srcdoc = `<!doctype html><meta charset="utf-8"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'nonce-${scriptNonce}' blob:; worker-src blob:; connect-src 'none'; img-src 'none'; style-src 'none'; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"><script nonce="${scriptNonce}" data-nonce="${nonce}">(${frameBootstrap.toString()})();</scr` + 'ipt>';
    document.body.append(frame);
  });
}
