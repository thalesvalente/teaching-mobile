import { mkdir, writeFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import { avaliar } from '../src/avaliacao.mjs';

const raiz = fileURLToPath(new URL('../', import.meta.url));
const resultado = {
  ...avaliar(), geradoEm: new Date().toISOString(),
  arquivoAvaliado: 'src/missoes.mjs',
  sha256: createHash('sha256').update(readFileSync(join(raiz, 'src/missoes.mjs'))).digest('hex')
};
const fmt = n => n.toFixed(1).replace('.', ',');
const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const caminho = join(raiz, 'entrega');
await mkdir(caminho, { recursive: true });
await writeFile(join(caminho, 'resultado.json'), JSON.stringify(resultado, null, 2) + '\n');
const quantidade = estado => resultado.resultados.filter(r => r.estado === estado).length;
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Aula 07 · Nota do projeto</title>
<style>*{box-sizing:border-box}body{font:17px/1.6 system-ui,sans-serif;color:#183b2a;background:#f2f7f4;margin:0;padding:24px;overflow-wrap:anywhere}main{max-width:900px;margin:auto}h1,h2{line-height:1.2;color:#006b3c}.placar,article{background:white;padding:20px;border:1px solid #8aa99a;border-radius:10px;margin:16px 0}.nota{font-size:2.5rem;font-weight:800;margin:8px 0}button{font:inherit;min-height:48px;padding:10px 20px;color:white;background:#006b3c;border:0;border-radius:6px}button:focus-visible{outline:3px solid #196b98;outline-offset:4px}progress{width:100%;height:20px}table{width:100%;border-collapse:collapse}th,td{padding:10px 6px;text-align:left;border-bottom:1px solid #bbcfc3}code{font-size:.85em}.passou{border-left:6px solid #006b3c}.pendente{border-left:6px solid #8b5a0c}.ajustar{border-left:6px solid #a12323}h3{margin:0}small{font-size:.9em}@media(max-width:480px){body{padding:12px}.placar,article{padding:14px}.nota{font-size:2rem}}@page{size:A4;margin:18mm;@bottom-center{content:"Aula 07 · página " counter(page);font:9pt sans-serif;color:#445d4d}}@media print{body{padding:0;background:white;font-size:11pt}button{display:none}h2,h3{break-after:avoid}.placar,article{border-radius:0;break-inside:avoid}a{color:inherit}article{padding:10px 12px;margin:8px 0;line-height:1.4;font-size:10pt}article h3{font-size:11pt}article p{margin:6px 0}.rastreio{break-inside:avoid}}</style></head><body><main>
<p>IFMA · Programação para Dispositivos Móveis · Aula 07</p><h1>Dados em movimento</h1>
<p>Nota formativa do código · ${resultado.total === 10 ? 'resultado completo dos testes' : 'resultado parcial; pendências preservadas'}.</p>
<section class="placar" aria-labelledby="placar"><h2 id="placar">${esc(resultado.nivel)}</h2><p class="nota">${fmt(resultado.total)} / 10,0</p><p>${resultado.xp} / 100 XP · ${quantidade('passou')} passaram · ${quantidade('ajustar')} a ajustar · ${quantidade('pendente')} pendentes</p><label for="progresso">Pontos conquistados</label><progress id="progresso" max="10" value="${resultado.total}">${fmt(resultado.total)} de 10</progress><p>Pendências e testes que ainda falham valem zero. O denominador permanece 10,0; dicas e tentativas não descontam pontos. Uma nova execução substitui este resultado.</p></section>
<button type="button" onclick="window.print()">Imprimir / salvar como PDF</button>
<h2>Pontuação por missão</h2><table><thead><tr><th scope="col">Missão</th><th scope="col">Atual</th><th scope="col">Máximo</th></tr></thead><tbody>${resultado.missoes.map(m => `<tr><th scope="row">${esc(m.nome)}</th><td>${fmt(m.pontos)}</td><td>${fmt(m.max)}</td></tr>`).join('')}</tbody></table>
<h2>Critérios e próximos ajustes</h2>${resultado.resultados.map(r => `<article class="${r.estado}"><h3>${esc(r.id)} · ${esc(r.titulo)}</h3><p><strong>${esc(r.estado.toUpperCase())} · ${fmt(r.pontos)} / ${fmt(r.max)}</strong></p><p>${esc(r.detalhe)}</p></article>`).join('')}
<section class="rastreio"><h2>Rastreabilidade</h2><p>Gerado em: ${esc(resultado.geradoEm)}<br>Arquivo avaliado: <code>${esc(resultado.arquivoAvaliado)}</code><br>SHA-256: <code>${esc(resultado.sha256)}</code></p><p>${esc(resultado.limite)}</p><p>Este documento não é autenticado. Anexe também commit, ambiente, teste visual realizado e pendências na ficha. O PDF é uma fotografia desta execução; execute <code>npm run nota</code> novamente após editar o código.</p></section></main></body></html>`;
await writeFile(join(caminho, 'resultado.html'), html);
console.log(`AULA 07 — ${resultado.nivel}`);
console.log(`NOTA ATUAL: ${fmt(resultado.total)} / 10,0 — ${resultado.xp} / 100 XP`);
for (const m of resultado.missoes) console.log(`${m.nome}: ${fmt(m.pontos)} / ${fmt(m.max)}`);
for (const r of resultado.resultados) console.log(`${r.estado.toUpperCase().padEnd(8)} ${r.id} ${r.titulo} (${fmt(r.pontos)}/${fmt(r.max)})`);
console.log('Relatórios: entrega/resultado.json e entrega/resultado.html (imprimir/salvar como PDF, inclusive parcial).');
console.log(resultado.limite);
if (process.argv.includes('--strict') && resultado.total !== 10) process.exitCode = 1;
