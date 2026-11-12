#!/usr/bin/env node
/** Apenas empacota a prévia. Não publica, altera main ou configura Pages. */
import { cpSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, basename, sep } from 'node:path';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
const root = resolve('.');
const output = resolve('_site');
assert.ok(output.startsWith(root + sep));
mkdirSync(output, { recursive: true });
const deny = new Set(['node_modules', '.git', '.expo', 'dist', 'build', '.env', 'tests', 'test', 'entrega']);
const filter = (source) => !deny.has(basename(source)) && !basename(source).startsWith('.env.');
for (const name of ['index.html', '.nojekyll', 'lessons']) {
  cpSync(resolve(root, name), resolve(output, name), { recursive: true, filter });
}
// Expo public assets legitimately include assets/node_modules; preserve them.
cpSync(resolve(root, 'apps'), resolve(output, 'apps'), { recursive: true });
// Documentos linked by the portal; backend, QA oracles and records stay outside.
mkdirSync(resolve(output, 'docs'), { recursive: true });
cpSync(resolve(root, 'docs/GUIA_GIT_UPSTREAM.md'), resolve(output, 'docs/GUIA_GIT_UPSTREAM.md'));
const lab = resolve(output, 'lessons/aula-08-av1-incremento-1/laboratorio-vivo');
const config = readFileSync(resolve(lab, 'entrega-config.js'), 'utf8');
assert.match(config, /PROD_RELEASE_ENABLED = false/);
assert.match(config, /PROD_ENDPOINT = ''/);
assert.ok(!existsSync(resolve(output, 'tests')));
assert.ok(!existsSync(resolve(output, 'integrations')));
const manifest = {
  schema: 'mobile-a08-static-preview-v1',
  sha: execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim(),
  builtAt: new Date().toISOString(),
  productionWrite: false,
  submissionEnabled: false,
  canonicalPath: '/teaching-mobile/lessons/aula-08-av1-incremento-1/laboratorio-vivo/',
  limitations: ['Prévia React Native Web, não emulador nativo.', 'Nenhuma homologação Google é inferida deste pacote.']
};
writeFileSync(resolve(output, 'mobile-a08-preview-manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log('PASS: prévia montada em _site; sem deploy ou recebimento.');
