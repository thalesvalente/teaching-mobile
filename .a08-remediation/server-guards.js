/* Candidate v2. Production admission requires explicit teacher approval.
 * No names, grades, secrets or real student data are bundled with this code. */
function mobileA08AssertPolicy() {
  const approval = PropertiesService.getScriptProperties().getProperty('MOBILE_A08_POLICY_APPROVAL');
  if (approval !== 'four-tasks-reflection-v2')
    throw Error('DECISION_REQUIRED_F02_F03: avaliação oficial aguarda aceite docente das quatro tarefas e do registro reflexivo.');
}
function mobileA08ProcessEvidence(evidence) {
  const usage = evidence && evidence.aiUsage;
  return !!usage && typeof usage.reflection === 'string' && usage.reflection.trim().length >= 20 &&
    ((usage.status === 'used' && evidence.aiLog.length > 0) ||
     (usage.status === 'not-used' && evidence.aiLog.length === 0));
}
function mobileA08AiUsage(value, aiLog) {
  mobileA08Object(value, ['status','reflection'], ['status','reflection'], 'registro reflexivo');
  if (!['undeclared','used','not-used'].includes(value.status)) throw Error('Situação de uso da IA inválida.');
  mobileRead(value.reflection, 400, 'reflexão');
  if (typeof value.reflection !== 'string') throw Error('Reflexão inválida.');
  if (value.status === 'used' && !aiLog.length) throw Error('Uso de IA declarado sem registro real.');
  if (value.status !== 'used' && aiLog.length) throw Error('Registro de IA contradiz a declaração de uso.');
  return {status:value.status,reflection:value.reflection};
}
function mobileA08RosterIdentity(binding) {
  const people = binding.members.map(m => mobileNormal(m.name)).sort();
  return {teamKey:mobileA08Hash([binding.activity,mobileNormal(binding.team)]),
    rosterHash:mobileA08Hash(people),people};
}
function mobileA08RosterKey(binding) {
  return 'MOBILE_A08_ROSTER_' + mobileA08RosterIdentity(binding).teamKey;
}
function mobileA08AssertRoster(binding, props, audit) {
  const id = mobileA08RosterIdentity(binding), raw = props.getProperty(mobileA08RosterKey(binding));
  let record = null;
  if (raw) {
    try {record = JSON.parse(raw);} catch {throw Error('ROSTER_RECONCILIATION_REQUIRED: cadastro da equipe inconsistente.');}
    if (record.rosterHash !== id.rosterHash || record.teamKey !== id.teamKey)
      throw Error('ROSTER_CHANGED: mantenha todos os participantes da entrega anterior; mudanças exigem conferência docente.');
    if (record.status !== 'committed')
      throw Error('ROSTER_RECONCILIATION_REQUIRED: há gravação incompleta; consulte o professor antes de reenviar.');
  }
  if (audit && audit.getLastRow() > 1) {
    const rows = audit.getRange(2,1,audit.getLastRow()-1,17).getValues().filter(row =>
      row[2] === binding.activity && mobileNormal(row[1]) === mobileNormal(binding.team));
    if (record && !rows.length) throw Error('ROSTER_RECONCILIATION_REQUIRED: histórico da equipe ausente.');
    if (rows.length) {
      const observed = rows.map(row => mobileNormal(row[0])).sort();
      if (mobileA08Canonical(observed) !== mobileA08Canonical(id.people))
        throw Error('ROSTER_CHANGED: composição da equipe difere da auditoria; procure o professor.');
      // Existing v1 data are admitted only when every historical member row
      // describes the SAME full roster. Inconsistent partial replays fail closed.
      for (const row of rows) {
        let previous;
        try {previous = JSON.parse(row[15]);} catch {throw Error('ROSTER_RECONCILIATION_REQUIRED: auditoria inválida.');}
        if (!Array.isArray(previous.members) || mobileA08Canonical(previous.members.map(m => mobileNormal(m.name)).sort()) !== mobileA08Canonical(id.people))
          throw Error('ROSTER_RECONCILIATION_REQUIRED: composições históricas divergentes.');
      }
    }
  }
  return {version:2,teamKey:id.teamKey,rosterHash:id.rosterHash};
}
function mobileA08ReserveRoster(binding, props, record, challengeId) {
  const key = mobileA08RosterKey(binding);
  if (!props.getProperty(key)) {
    const count = Object.keys(props.getProperties()).filter(k => k.startsWith('MOBILE_A08_ROSTER_')).length;
    if (count >= 200) throw Error('Capacidade de cadastro de equipes atingida; solicite manutenção docente.');
  }
  props.setProperty(key, JSON.stringify({...record,status:'processing',challengeId}));
}
function mobileA08FinishRoster(binding, props, record, challengeId, receiptId, status) {
  props.setProperty(mobileA08RosterKey(binding), JSON.stringify({...record,status,challengeId,receiptId}));
}
function mobileA08ConsumeRate(binding, props, now) {
  const id = mobileA08RosterIdentity(binding), prefix = MOBILE_A08.ratePrefix;
  // Free-text identity is NOT authentication. Shared global and member limits
  // bound rotation abuse; changing package bytes does not reset any quota.
  const buckets = [
    [prefix+'team_'+id.teamKey,5],
    [prefix+'roster_'+mobileA08Hash([binding.activity,id.rosterHash]),5],
    ...id.people.map(p => [prefix+'person_'+mobileA08Hash([binding.activity,p]),10]),
    [prefix+'global_'+binding.activity,100]
  ];
  const states = buckets.map(([key,limit]) => {
    const raw=props.getProperty(key); let r=raw?JSON.parse(raw):{count:0,until:now+MOBILE_A08.ttlMs};
    if (!Number.isFinite(r.until)||!Number.isInteger(r.count)||r.count<0) throw Error('Quota inválida; solicite manutenção docente.');
    if(r.until<=now)r={count:0,until:now+MOBILE_A08.ttlMs};
    if(r.count>=limit)throw Error('Muitas tentativas para a equipe ou limite global; aguarde dez minutos.');
    return [key,{count:r.count+1,until:r.until}];
  });
  // All quota checks precede all quota writes while holding ScriptLock.
  for(const [key,state] of states)props.setProperty(key,JSON.stringify(state));
}
