import {parentPort, workerData} from 'node:worker_threads';
import {canonical} from '../src/contrato.mjs';
try {
  const {resolver} = await import(workerData.sourceUrl);
  if (typeof resolver !== 'function') throw new Error('Export resolver ausente');
  const outputs = [];
  for (const c of workerData.cases) {
    try {
      const input = structuredClone(c.input), before = canonical(input), value = resolver(input);
      const normalized = canonical(value);
      if (normalized.length > 16384) throw new Error('Resultado grande');
      outputs.push({id:c.id,ok:true,value:JSON.parse(normalized),unchanged:before===canonical(input)});
    } catch { outputs.push({id:c.id,ok:false,error:'EXECUTION_ERROR'}); }
  }
  parentPort.postMessage(outputs);
} catch { parentPort.postMessage(workerData.cases.map(c=>({id:c.id,ok:false,error:'EXECUTION_ERROR'}))); }
