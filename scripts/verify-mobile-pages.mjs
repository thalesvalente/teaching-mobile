#!/usr/bin/env node
import assert from "node:assert/strict";
import {existsSync,readFileSync,statSync} from "node:fs";
import {dirname,join,resolve,sep} from "node:path";
const root=resolve(process.argv[2]??"_site");
const prefix="/teaching-mobile/";
function present(path,label){assert.ok(existsSync(path),"Arquivo não encontrado: "+label+" ("+path+")");}
function verifyHTML(path){
  present(path,"HTML");
  const html=readFileSync(path,"utf8");
  for(const [,raw] of html.matchAll(/\b(?:src|href)=["']([^"']+)["']/gi)){
    if(/^(?:https?:|mailto:|tel:|data:|#)/i.test(raw))continue;
    const name=raw.split(/[?#]/,1)[0];if(!name)continue;
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
console.log("PASS: portal, dois aplicativos, missões e assets resolvidos.");
