/** Proposed policy for qualification; official use requires teacher approval. */
export const POLICY = Object.freeze({id:'four-tasks-reflection-v2',approval:'DECISION_REQUIRED',requiredTasks:[1,2,3,4]});
export function assertRequiredTasks(slots) {
  if (!Array.isArray(slots) || slots.length !== 4 || slots.some((x,i)=>x!==i+1))
    throw Error('Esta candidata exige as quatro tarefas (1,2,3,4). Omitir arquivos não permite aumentar a nota. Política sujeita a aceite docente.');
}
export function validateAiUsage(value, aiLog) {
  if (!value || typeof value !== 'object' || Array.isArray(value) ||
      Object.keys(value).sort().join(',') !== 'reflection,status' ||
      !['undeclared','used','not-used'].includes(value.status) ||
      typeof value.reflection !== 'string' || value.reflection.length > 400 ||
      /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value.reflection))
    throw Error('Registro reflexivo inválido: use status e reflection (até 400 caracteres).');
  if (value.status === 'used' && !aiLog.length) throw Error('Uso de IA declarado sem registro real.');
  if (value.status !== 'used' && aiLog.length) throw Error('Registro de IA contradiz a declaração de uso.');
  return value;
}
export function processEvidenceComplete(evidence) {
  const usage = evidence?.aiUsage;
  return !!usage && typeof usage.reflection === 'string' && usage.reflection.trim().length >= 20 &&
    ((usage.status === 'used' && evidence.aiLog.length > 0) ||
     (usage.status === 'not-used' && evidence.aiLog.length === 0));
}
