#!/usr/bin/env node
import assert from "node:assert/strict";
import {existsSync,readFileSync,statSync,readdirSync} from "node:fs";
import {dirname,join,resolve,sep} from "node:path";
const root=resolve(process.argv[2]??"_site");
const prefix="/teaching-mobile/";
function present(path,label){assert.ok(existsSync(path),"Arquivo não encontrado: "+label+" ("+path+")");}
function verifyHTML(path){
  present(path,"HTML");
  const html=readFileSync(path,"utf8");
  for(const [,raw] of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)){
    if(/^(?:https?:|mailto:|tel:|data:|#)/i.test(raw))continue;
    const name=decodeURIComponent(raw.split(/[?#]/,1)[0]);if(!name)continue;
    assert.ok(!name.startsWith("/")||name.startsWith(prefix),"URL absoluta fora da base: "+raw);
    const location=resolve(name.startsWith(prefix)?root:dirname(path),name.startsWith(prefix)?name.slice(prefix.length):name);
    assert.ok(location===root||location.startsWith(root+sep),"URL fora do site: "+raw);
    const file=existsSync(location)&&statSync(location).isDirectory()?join(location,"index.html"):location;
    present(file,raw);
  }
  return html;
}
const portal=verifyHTML(join(root,"index.html"));
for(const slug of ["memorias","eda"]){
  assert.ok(portal.includes('./apps/'+slug+'/'),"Falta link: "+slug);
  const html=verifyHTML(join(root,"apps",slug,"index.html"));
  assert.match(html,/<script\b/i,"Aplicativo sem script: "+slug);
  assert.match(html,/(_expo|assets)\//i,"Aplicativo sem assets: "+slug);
}
assert.ok(portal.includes('projeto/guia.html'),"Falta guia da Aula 07");
if(portal.includes('aula-08-av1-incremento-1/laboratorio-vivo/')) {
  const lab=join(root,'lessons/aula-08-av1-incremento-1/laboratorio-vivo');
  verifyHTML(join(lab,'index.html'));
  verifyHTML(join(lab,'preview.html'));
  for(const file of ['shared/ProjetoUniversal.tsx','criteria.js','runtime-compiler.js','assets/vendor.js','projeto/App.tsx','projeto/package-lock.json'])
    present(join(lab,file),'Fonte compartilhada da bancada/Expo: '+file);
  const gate=readFileSync(join(lab,'entrega-config.js'),'utf8');
  assert.match(gate,/PROD_RELEASE_ENABLED = false/,'Prévia não pode habilitar recebimento');
  assert.match(gate,/PROD_ENDPOINT = ''/,'Prévia não pode apontar para produção');
}
function samePublishedAssets(source,target) {
  for(const entry of readdirSync(source,{withFileTypes:true})) {
    const from=join(source,entry.name),to=join(target,entry.name);present(to,'Asset publicado preservado');
    if(entry.isDirectory())samePublishedAssets(from,to);
    else assert.ok(readFileSync(from).equals(readFileSync(to)),'Asset publicado alterado: '+to);
  }
}
// The v4 preview preserves existing builds instead of recompiling previous lessons.
if(existsSync(join(root,'mobile-a08-preview-manifest.json')))
  samePublishedAssets(resolve('apps'),join(root,'apps'));
console.log("PASS: portal, aplicativos preservados, links da Aula 08 e fontes compartilhadas.");
