/* Gate G1 independente: nunca substitui nem simula os dois originais. */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const dir = path.resolve(__dirname, '../lessons/aula-08-av1-incremento-1/assets');
let missing = 0;
for (const name of ['infografico-marcos-av1.png', 'fluxo-aluno-laboratorio-vivo.png']) {
  const file = path.join(dir, name);
  if (!fs.existsSync(file)) { console.error('BLOCKED G1 - arquivo original ausente:', name); missing++; continue; }
  const bytes = fs.readFileSync(file);
  if (!bytes.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) throw Error('PNG inválido: ' + name);
  console.log('PRESENT', name, crypto.createHash('sha256').update(bytes).digest('hex'));
}
process.exitCode = missing ? 2 : 0;
