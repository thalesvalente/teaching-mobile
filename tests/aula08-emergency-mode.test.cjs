'use strict';const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.join(__dirname,'../lessons/aula-08-av1-incremento-1');
test('A08 contingência informa ausência de recibo sem confundir PDF local com envio',()=>{
 const form=fs.readFileSync(path.join(root,'atividade.html'),'utf8');
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(form,/Se não receber um recibo válido/);
 assert.match(form,/PDF local não confirma recebimento nem lança nota/);
 assert.match(home,/a nota oficial só estará confirmada com recibo válido/);
 assert.match(form,/id="submit-delivery"/);
});
