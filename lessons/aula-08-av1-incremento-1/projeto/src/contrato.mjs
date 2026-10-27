/** Contrato compartilhado pelo gerador Node e importador do navegador. */
export const CONFIG = Object.freeze({ schema: 'mobile-a08-v1', activity: 'MOBILE-AULA08-2026', generator: '1.0.0', contract: '1.0.0', evaluator: 'formativo-1.0.0', maxBytes: 131072, maxSourceBytes: 16384, maxLines: 9 });
export const SOURCE_PATHS = Object.freeze(['src/equipe.mjs', ...[1, 2, 3, 4].map(n => `src/individual/aluno${n}.mjs`)]);
const encoder = new TextEncoder();
const fail = message => { throw new Error(`Pacote inválido: ${message}`); };
const plain = x => x !== null && typeof x === 'object' && !Array.isArray(x) && Object.getPrototypeOf(x) === Object.prototype;
const hex = x => typeof x === 'string' && /^[a-f0-9]{64}$/.test(x);
export function canonical(value) {
  if (value === null || typeof value === 'boolean' || typeof value === 'string') return JSON.stringify(value);
  if (typeof value === 'number' && Number.isFinite(value)) return JSON.stringify(value);
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (!plain(value)) fail('valor JSON não permitido');
  const keys = Object.keys(value).sort();
  if (keys.some(k => ['__proto__', 'constructor', 'prototype'].includes(k))) fail('campo reservado');
  return '{' + keys.map(k => JSON.stringify(k) + ':' + canonical(value[k])).join(',') + '}';
}
export async function sha256(value) {
  const bytes = typeof value === 'string' ? encoder.encode(value) : value;
  return [...new Uint8Array(await globalThis.crypto.subtle.digest('SHA-256', bytes))].map(b => b.toString(16).padStart(2, '0')).join('');
}
function exact(obj, keys, label) {
  if (!plain(obj) || canonical(Object.keys(obj).sort()) !== canonical([...keys].sort())) fail(`${label}: campos ausentes ou extras`);
}
function short(value, max, label, empty = false) {
  if (typeof value !== 'string' || value.length > max || (!empty && !value.trim()) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(value)) fail(`${label}: texto inválido`);
}
function noSecrets(value) {
  const text = canonical(value);
  if (/(?:gh[pousr]_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----|[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}|(?:api[_-]?key|password|senha|token)\s*[=:]\s*["']?[A-Za-z0-9_\-]{12,})/i.test(text)) fail('possível segredo ou dado pessoal; remova antes de entregar');
}
export function validateEvidence(evidence) {
  exact(evidence, ['type', 'preflight', 'aiLog', 'environment'], 'evidence');
  if (evidence.type !== 'evidence') fail('evidence incompatível');
  exact(evidence.preflight, ['version', 'ok', 'nodeMajor', 'filesReady'], 'preflight');
  const p = evidence.preflight;
  if (p.version !== '1.0.0' || typeof p.ok !== 'boolean' || typeof p.filesReady !== 'boolean' || !Number.isInteger(p.nodeMajor) || p.nodeMajor < 0 || p.nodeMajor > 99) fail('preflight incompatível');
  exact(evidence.environment, ['runtime', 'nodeMajor', 'platform'], 'environment');
  const e = evidence.environment;
  if (e.runtime !== 'node' || !Number.isInteger(e.nodeMajor) || e.nodeMajor < 0 || e.nodeMajor > 99 || !['linux', 'darwin', 'win32', 'other'].includes(e.platform)) fail('ambiente incompatível');
  if (!Array.isArray(evidence.aiLog) || evidence.aiLog.length > 20) fail('log de IA deve ter até 20 entradas');
  for (const entry of evidence.aiLog) {
    exact(entry, ['mission', 'request', 'suggestion', 'humanChange', 'test'], 'log de IA');
    if (!['M1', 'M2', 'M3', 'M4'].includes(entry.mission)) fail('missão do log de IA');
    for (const key of ['request', 'suggestion', 'humanChange', 'test']) short(entry[key], 400, key);
  }
  noSecrets(evidence);
  return evidence;
}
export function decodeSource(content) {
  if (typeof content !== 'string' || !content || content.length > Math.ceil(CONFIG.maxSourceBytes / 3) * 4 || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(content)) fail('Base64 inválido ou grande demais');
  let bytes;
  try { const raw = atob(content); if (btoa(raw) !== content) fail('Base64 não canônico'); bytes = Uint8Array.from(raw, c => c.charCodeAt(0)); } catch { fail('Base64 inválido'); }
  if (bytes.length === 0 || bytes.length > CONFIG.maxSourceBytes) fail('fonte ausente ou maior que 16 KiB');
  try { return new TextDecoder('utf-8', { fatal: true }).decode(bytes); } catch { fail('fonte não é UTF-8'); }
}
export async function parsePackage(input) {
  let text;
  if (typeof input === 'string') text = input;
  else { try { text = new TextDecoder('utf-8', { fatal: true }).decode(input); } catch { fail('arquivo não é UTF-8'); } }
  if (encoder.encode(text).length > CONFIG.maxBytes) fail('arquivo maior que 128 KiB');
  if (!text.endsWith('\n') || text.includes('\r') || text.charCodeAt(0) === 0xfeff) fail('use JSONL UTF-8 canônico, linhas LF e uma quebra final');
  const lines = text.slice(0, -1).split('\n');
  if (lines.length < 6 || lines.length > CONFIG.maxLines) fail('quantidade de linhas');
  const rows = lines.map((line, i) => {
    let row; try { row = JSON.parse(line); } catch { fail(`linha ${i + 1} não é JSON`); }
    if (canonical(row) !== line) fail(`linha ${i + 1} não canônica (ou chaves duplicadas)`);
    return row;
  });
  const manifest = rows[0];
  exact(manifest, ['type', 'schema', 'activity', 'generator', 'contract', 'slots'], 'manifest');
  if (manifest.type !== 'manifest' || manifest.schema !== CONFIG.schema || manifest.activity !== CONFIG.activity || manifest.generator !== CONFIG.generator || manifest.contract !== CONFIG.contract) fail('atividade, schema ou versão incompatível');
  if (!Array.isArray(manifest.slots) || manifest.slots.length < 1 || manifest.slots.length > 4 || manifest.slots.some((n, i) => !Number.isInteger(n) || n < 1 || n > 4 || (i > 0 && n <= manifest.slots[i - 1]))) fail('slots devem ser únicos, crescentes e entre 1 e 4');
  if (rows.length !== manifest.slots.length + 5) fail('fontes, slots ou linhas ausentes/duplicadas');
  const expectedPaths = ['src/equipe.mjs', ...manifest.slots.map(n => `src/individual/aluno${n}.mjs`)];
  const sources = [], sourceHashes = {};
  for (let i = 0; i < expectedPaths.length; i++) {
    const row = rows[i + 1], individual = i > 0;
    exact(row, ['type', 'scope', 'path', 'sha256', 'encoding', 'content', ...(individual ? ['slot'] : [])], 'source');
    if (row.type !== 'source' || row.path !== expectedPaths[i] || row.scope !== (individual ? 'individual' : 'team') || row.encoding !== 'base64' || !hex(row.sha256) || (individual && row.slot !== manifest.slots[i - 1])) fail('fonte fora da allowlist, duplicada ou scope/slot inválido');
    const code = decodeSource(row.content);
    noSecrets(code);
    if (await sha256(code) !== row.sha256) fail(`hash incoerente em ${row.path}`);
    sources.push({ ...row, code }); sourceHashes[row.path] = row.sha256;
  }
  const localResult = rows[rows.length - 3];
  exact(localResult, ['type', 'evaluator', 'criteria', 'grade'], 'local-result');
  if (localResult.type !== 'local-result' || localResult.evaluator !== CONFIG.evaluator || !Array.isArray(localResult.criteria) || localResult.criteria.length > 35 || typeof localResult.grade !== 'number' || !Number.isFinite(localResult.grade) || localResult.grade < 0 || localResult.grade > 10) fail('resultado local incompatível');
  const ids = new Set();
  for (const c of localResult.criteria) {
    exact(c, ['id', 'passed'], 'critério local');
    if (typeof c.id !== 'string' || !/^(?:M[1-3]-[1-6]|S[1-4]-M4-[1-5])$/.test(c.id) || ids.has(c.id) || typeof c.passed !== 'boolean') fail('critério local inválido ou duplicado');
    ids.add(c.id);
  }
  const evidence = validateEvidence(rows[rows.length - 2]);
  const end = rows[rows.length - 1];
  exact(end, ['type', 'lineCount', 'packageSha256'], 'end');
  if (end.type !== 'end' || end.lineCount !== rows.length || !hex(end.packageSha256)) fail('fim de pacote inválido');
  const packageSha256 = await sha256(rows.slice(0, -1).map(canonical).join('\n') + '\n');
  if (packageSha256 !== end.packageSha256) fail('hash do pacote incoerente');
  return Object.freeze({ manifest, sources, sourceHashes, localResult, evidence, packageSha256, lineCount: rows.length, byteLength: encoder.encode(text).length });
}
export async function serializePackage(rows) {
  const body = rows.map(canonical).join('\n') + '\n';
  const end = { type: 'end', lineCount: rows.length + 1, packageSha256: await sha256(body) };
  const text = body + canonical(end) + '\n';
  await parsePackage(text);
  return text;
}
