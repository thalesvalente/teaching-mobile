import {lstat, readFile, realpath} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {SOURCE_PATHS, validateEvidence} from '../src/contrato.mjs';
export const PROJECT_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export async function readAllowed(root, relative, maxBytes = 16384) {
  const allowed = [...SOURCE_PATHS,'src/evidencias.json','package.json'];
  if (!allowed.includes(relative)) throw new Error('Arquivo fora da lista permitida.');
  const base = await realpath(root), filename = path.join(base,relative), stat = await lstat(filename);
  if (stat.isSymbolicLink() || !stat.isFile() || stat.size > maxBytes || await realpath(filename) !== filename) throw new Error(`Arquivo ausente, grande ou link não permitido: ${relative}`);
  const bytes = await readFile(filename);
  if (bytes.length > maxBytes) throw new Error(`Arquivo grande: ${relative}`);
  return new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(bytes);
}
export async function preflight(root = PROJECT_ROOT) {
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  let filesReady = true;
  for (const p of SOURCE_PATHS) { try { await readAllowed(root,p); } catch { filesReady = false; } }
  return {version:'1.0.0',ok:nodeMajor >= 22 && filesReady,nodeMajor,filesReady};
}
export async function collectEvidence(root = PROJECT_ROOT) {
  const raw = JSON.parse(await readAllowed(root,'src/evidencias.json',32768));
  if (Object.keys(raw).sort().join(',') !== 'aiLog,aiUsage') throw new Error('src/evidencias.json deve conter somente aiLog e aiUsage; use o exemplo da versão atual.');
  const nodeMajor = Number(process.versions.node.split('.')[0]);
  return validateEvidence({type:'evidence',preflight:await preflight(root),aiLog:raw.aiLog,aiUsage:raw.aiUsage,environment:{runtime:'node',nodeMajor,platform:['linux','win32','darwin'].includes(process.platform)?process.platform:'other'}});
}
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await preflight();
  console.log(result.ok ? 'Preflight OK: Node e cinco fontes prontos.' : 'Preflight pendente: use Node 22+ e restaure as cinco fontes permitidas.');
  console.log('Nenhum login, instalação de IA ou envio à planilha é necessário.');
  if (!result.ok) process.exitCode = 1;
}
