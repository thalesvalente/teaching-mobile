/* Gate independente: nunca substitui nem simula os dois originais. */
'use strict';
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),assert=require('node:assert/strict');
const dir=path.resolve(__dirname,'../lessons/aula-08-av1-incremento-1/assets');
const originals={
 'infografico-marcos-av1.png':'c34cf2dd33ba1124f6f4632b2dde3a4cc30bd12ff5c7e282c2afe3498320e773',
 'fluxo-aluno-laboratorio-vivo.png':'41d39b5f76041da3b88cc636b4b7a7478da499b0b99661c001d52dea04e539e9'
};
let missing=0;
for(const [name,expected] of Object.entries(originals)){
 const file=path.join(dir,name);
 if(!fs.existsSync(file)){console.error('BLOCKED G1 - original ainda não publicado:',name);missing++;continue;}
 const bytes=fs.readFileSync(file);
 assert.ok(bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])),'PNG inválido: '+name);
 const actual=crypto.createHash('sha256').update(bytes).digest('hex');
 assert.equal(actual,expected,'Bytes originais alterados: '+name);
 console.log('PASS ORIGINAL',name,actual);
}
process.exitCode=missing?2:0;
