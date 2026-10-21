/* Adaptação de entrega Mobile: PDF atual preservado; sem alterar avaliador nem enunciados. */
(() => {
  'use strict';
  // Após o professor implantar Code.gs + RubricaAula07.gs, inserir a URL /exec MOBILE.
  // Nunca utilizar o endpoint da disciplina PPI I.
  const ENDPOINT = '';
  const ACTIVITY = 'MOBILE-AULA07-2026';
  const SCHEMA = 'mobile-a07-v1';
  const button = document.getElementById('mobile-submit');
  const output = document.getElementById('mobile-delivery-status');
  if (!button || !output || !window.MobileActivity || !window.FormalPdf)
    throw Error('Módulo de entrega Mobile sem dependências.');
  const validUrl = /^https:\/\/script\.google\.com\/macros\/s\/[\w-]+\/exec$/;
  const configured = validUrl.test(ENDPOINT);
  const googleOrigin = origin => /^https:\/\/(?:[a-z0-9-]+\.)?script\.googleusercontent\.com$/.test(origin)
    || origin === 'https://script.google.com';
  let busy = false;
  button.disabled = !configured;
  if (!configured) {
    output.textContent = 'Entrega online ainda não ativada pelo professor. PDF, impressão e rascunho continuam disponíveis.';
    button.title = 'Aguardando implantação do Apps Script Mobile';
  }
  const msg = text => { output.textContent = text; };
  const hex = bytes => Array.from(new Uint8Array(bytes)).map(x => x.toString(16).padStart(2,'0')).join('');
  async function sha256(data) {
    if (!crypto || !crypto.subtle) throw Error('SHA-256 exige HTTPS ou contexto seguro.');
    return hex(await crypto.subtle.digest('SHA-256',data));
  }
  function filename() {
    const team = String(document.getElementById('team').value || 'equipe').normalize('NFD')
      .replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/[^a-z0-9]+/g,'_')
      .replace(/^_|_$/g,'').slice(0,60) || 'equipe';
    return 'mobile_aula07_' + team + '_atividade.pdf';
  }
  function savePdf(bytes) {
    // Uint8Array inalterado, usado igualmente no download e no hash.
    const blob = new Blob([bytes],{type:'application/pdf'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename();
    document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url),60000);
  }
  function deliver(snapshot,pdfHash,expectedGrade) {
    return new Promise((resolve,reject) => {
      const nonce = crypto.randomUUID();
      const frame = document.createElement('iframe');
      frame.name = 'mobile-entrega-' + nonce;
      frame.title = 'Canal de confirmação de entrega Mobile';
      frame.hidden = true;
      const form = document.createElement('form');
      form.hidden = true; form.method = 'POST';
      form.action = ENDPOINT; form.target = frame.name;
      const payload = JSON.stringify({
        schema:SCHEMA,activity:ACTIVITY,snapshot,pdfSha256:pdfHash
      });
      for (const [key,value] of Object.entries({nonce,payload})) {
        const input = document.createElement('input');
        input.name = key; input.value = value;
        form.append(input);
      }
      let done = false;
      const finish = (error,result) => {
        if (done) return;
        done = true; clearTimeout(timer);
        window.removeEventListener('message',receive);
        frame.remove(); form.remove();
        error ? reject(error) : resolve(result);
      };
      const receive = e => {
        if (!googleOrigin(e.origin)) return;
        const data = e.data;
        if (!data || data.channel !== 'mobile-entrega-aula07' || data.nonce !== nonce) return;
        if (!data.ok) return finish(Error(data.error || 'Recebimento recusado.'));
        if (data.activity !== ACTIVITY || data.instrument !== 'simulador-html' ||
            data.pdfSha256 !== pdfHash || typeof data.receiptId !== 'string' ||
            !/^[0-9a-f]{64}$/.test(String(data.answersSha256 || '')) ||
            !/^[0-9a-f]{64}$/.test(String(data.signature || '')) ||
            !Number.isFinite(data.grade) || !Number.isFinite(data.xp))
          return finish(Error('O recibo retornou dados inconsistentes.'));
        if (Math.abs(data.grade - expectedGrade) > 1e-9 || data.xp !== expectedGrade * 10)
          return finish(Error('A nota calculada no servidor difere do simulador; confira com o professor.'));
        finish(null,data);
      };
      const timer = setTimeout(() => finish(Error(
        'Não houve confirmação do servidor. Verifique a planilha antes de reenviar.'
      )),45000);
      window.addEventListener('message',receive);
      document.body.append(frame,form);
      try { form.submit(); } catch (error) { finish(error); }
    });
  }
  button.addEventListener('click',async () => {
    if (busy || !configured) return;
    const snapshot = window.MobileActivity.snapshot();
    const names = snapshot.members.filter(m => String(m.name || '').trim());
    if (!names.length || names.some(m => String(m.name).trim().length < 3)) {
      msg('Para entregar, informe o nome completo de ao menos um integrante. O PDF local continua disponível.');
      return;
    }
    if (names.some(m => !/^[\p{L}][\p{L}\p{M} .'\-]{2,99}$/u.test(String(m.name).trim()))) {
      msg('Revise os nomes completos dos integrantes antes de entregar.');
      return;
    }
    busy = true; button.disabled = true;
    try {
      // NÃO modificar a função original de PDF nem os critérios de pontuação.
      const model = window.MobileActivity.model();
      const bytes = window.FormalPdf.generate(model);
      if (!(bytes instanceof Uint8Array) || !bytes.length || bytes.length < 8)
        throw Error('O PDF não foi gerado em bytes verificáveis.');
      savePdf(bytes);
      const hash = await sha256(bytes);
      msg('PDF baixado. Aguardando o recibo real do Apps Script...');
      const receipt = await deliver(snapshot,hash,snapshot.scores.simulator.earned);
      msg('ENTREGA CONFIRMADA. Nota do simulador: '+
        receipt.grade.toFixed(1).replace('.',',')+'/10 · '+receipt.xp+'/100 XP.\n'+
        'Recibo: '+receipt.receiptId+'\nUTC: '+receipt.receivedAt+
        '\nSHA-256 PDF: '+receipt.pdfSha256+'\nSHA-256 respostas: '+
        receipt.answersSha256+'\nHMAC: '+receipt.signature+
        '\nGuarde o PDF e este recibo.');
    } catch (error) {
      if (error && error.code === 'UNSUPPORTED_PDF_CHARACTER') {
        msg('O PDF direto contém um caractere não suportado. Use “Versão para impressão” para salvar seu PDF local. Sem bytes verificáveis, nenhuma entrega online foi enviada.');
      } else msg('ENTREGA NÃO CONFIRMADA: '+String(error && error.message || 'Falha de envio.')+
        '\nO PDF baixado, quando gerado, não comprova o recebimento.');
    } finally { busy = false; button.disabled = !configured; }
  });
  window.MobileEntrega = Object.freeze({ configurado: configured });
})();
