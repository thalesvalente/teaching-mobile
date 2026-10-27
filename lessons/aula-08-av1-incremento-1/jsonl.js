import { CONFIG, parsePackage, canonical, sha256 } from './projeto/src/contrato.mjs';
export { CONFIG, parsePackage, canonical, sha256 };

export async function importFile(file) {
  if (!file || file.size === 0) throw Error('Escolha entrega-a08.jsonl gerado pelo comando npm run entrega.');
  if (file.size > CONFIG.maxBytes) throw Error('O arquivo deve ter no máximo 128 KiB. Gere novamente com npm run entrega.');
  if (!/\.jsonl$/i.test(file.name)) throw Error('Selecione um arquivo .jsonl.');
  // Limite antes de alocar/ler. O mesmo contrato é usado pelo gerador local.
  return parsePackage(new Uint8Array(await file.arrayBuffer()));
}

export function serverEvidence(evidence) {
  const { type, ...body } = evidence;
  return body;
}
