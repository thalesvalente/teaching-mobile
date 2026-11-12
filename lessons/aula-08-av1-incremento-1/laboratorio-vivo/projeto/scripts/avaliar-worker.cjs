/** Local-only, no credentials. Not a remote grading service. */
'use strict';
const {parentPort,workerData}=require('node:worker_threads');
const path=require('node:path');
try{
 global.window=global;
 require(path.join(workerData.lab,'assets/vendor.js'));
 const compiler=require(path.join(workerData.lab,'runtime-compiler.js'));
 const {create}=require(path.join(workerData.lab,'criteria.js'));
 const app=compiler.compile(workerData.source,global.LabVendor);
 const criteria=create(app).map(test=>{try{test.run();return {id:test.id,status:'PASS',description:test.descricao,detail:null};}catch(error){return {id:test.id,status:'FAIL',description:test.descricao,detail:String(error.message).slice(0,450)};}});
 parentPort.postMessage({criteria});
}catch(error){parentPort.postMessage({error:String(error.message).slice(0,700)});}
