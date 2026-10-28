/** Shared client-side feedback; the server validates independently. */
export const normalizeIdentity = value => String(value || '').normalize('NFD').replace(/[\u0300-\u036f]/g,'').trim().replace(/\s+/g,' ').toLocaleLowerCase('pt-BR');
export function inspectIdentity(teamInput, nameInputs) {
  const team=teamInput.trim(), members=[], errors={};
  const invalid=/[\u0000-\u001f\u007f]/;
  const check=(raw,id,label)=>{
    if(raw.length>80)errors[id]=label+' deve ter no máximo 80 caracteres.';
    else if(/^[=+@-]/.test(raw.trim()))errors[id]=label+' não pode começar com símbolo de fórmula (=, +, -, @).';
    else if(invalid.test(raw))errors[id]=label+' contém quebra de linha ou caractere inválido.';
  };
  if(!team)errors.team='Informe o nome da equipe.';
  check(teamInput,'team','O nome da equipe');
  const seen=new Map();
  nameInputs.forEach((raw,i)=>{
    const name=raw.trim(),id='member-'+(i+1);
    if(!name)return;
    members.push({name});check(raw,id,'O nome do participante');
    if(!errors[id] && (name.length<3 || !/^[\p{L}][\p{L}\p{M} .'\-]{2,79}$/u.test(name)))
      errors[id]='Informe um nome com pelo menos três caracteres, usando letras, espaços, ponto, apóstrofo ou hífen.';
    const key=normalizeIdentity(name);
    if(seen.has(key)) {
      errors[id]='Este participante já foi informado. Remova o nome repetido.';
      errors[seen.get(key)]='Este nome está repetido em outro campo.';
    } else seen.set(key,id);
  });
  if(!members.length)errors['member-1']='Informe pelo menos um participante da equipe.';
  return {team,members,errors};
}
export function showIdentityErrors(result) {
  for(const id of ['team','member-1','member-2','member-3','member-4']) {
    const input=document.getElementById(id);
    let message=document.getElementById(id+'-error');
    if(!message) {
      message=document.createElement('p');message.id=id+'-error';message.className='field-error';
      input.after(message);
      const old=input.getAttribute('aria-describedby')||'';
      input.setAttribute('aria-describedby',(old+' '+message.id).trim());
    }
    message.textContent=result.errors[id]||'';message.hidden=!result.errors[id];
    input.setAttribute('aria-invalid',String(!!result.errors[id]));
  }
}
