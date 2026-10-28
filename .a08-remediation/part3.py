# Active student content only. Historical reports are not current acceptance.
content_files=[L+n for n in ['index.html','comecar.html','missoes.html','gemini.html','atividade.html','README.md','MISSOES.md','GUIA_GEMINI.md','ACESSIBILIDADE.md','projeto/README.md']]
replacements=[
('Para uma equipe menor, indique os slots que serão associados a integrantes na ficha:','Todas as equipes trabalham as quatro tarefas, independentemente do número de participantes. Não associe nomes aos arquivos. O comando explícito equivalente é:'),
('Para incluir apenas as tarefas técnicas 1 e 2, use <code>-- --slots=1,2</code>. Isso não identifica alunos.','As quatro tarefas são obrigatórias nesta candidata. Os números identificam arquivos, não alunos.'),
('ou, se a equipe incluiu somente as tarefas técnicas 1 e 2, <code>npm run entrega -- --slots=1,2</code>','(o pacote sempre inclui as quatro tarefas de programação)'),
('Para reduzir a quantidade de tarefas, escolha os números dos arquivos nos comandos','As quatro tarefas devem estar presentes nos comandos'),
('Para incluir menos tarefas, use a opção','As quatro tarefas são obrigatórias; use a opção'),
('Para escolher menos tarefas, use a opção','As quatro tarefas são obrigatórias; use a opção'),
('Para uma equipe menor, use a opção','As quatro tarefas são obrigatórias; use a opção'),
('Para menos de quatro pessoas, use','Independentemente da quantidade de pessoas, use'),
('se alguns slots não forem usados','para compor o pacote completo'),
('estimativa por slot','estimativa única para a equipe'),('Integrante do slot','Equipe — tarefa'),
('Trabalhar individualmente (M4)','Trabalhar em equipe (M4)'),
('Resolver meu desafio individual','Resolver a tarefa da equipe'),
('Meu slot é [1, 2, 3 ou 4]. Meu desafio é','A tarefa técnica é [1, 2, 3 ou 4]. Nosso desafio é'),
('Meu slot','Nossa tarefa'),('meu slot','a tarefa técnica'),('seu slot','a tarefa técnica'),
('Funções individuais testadas','Funções da equipe testadas'),('arquivo individual','arquivo de tarefa'),('arquivos individuais','arquivos de tarefa'),
('desafio individual','tarefa técnica'),('Desafio individual','Tarefa técnica'),('cada integrante recebe','a equipe recebe'),('Cada integrante recebe','A equipe recebe'),
('Síntese de uso da IA registrada','Registro reflexivo do processo'),('Uso real de IA documentado','Registro reflexivo do processo'),
('--slots=1,2`','--slots=1,2,3,4`'),('--slots=1,2</code>','--slots=1,2,3,4</code>'),('(exemplo de dupla)','(vale para equipes de um a quatro participantes)'),
('Se não usou IA, mantenha <code>aiLog: []</code>','Se não usou IA, mantenha <code>aiLog: []</code> e declare <code>aiUsage.status: "not-used"</code> com uma reflexão verdadeira'),
('Se não utilizou, mantenha <code>aiLog: []</code>.','Se não utilizou, mantenha <code>aiLog: []</code> e registre <code>aiUsage.status: "not-used"</code> com uma reflexão verdadeira.'),
('mobile-a08-lab-vivo-1.1.0','mobile-a08-lab-vivo-2.0.0'),('mobile-a08-v1','mobile-a08-v2')]
for p in content_files:
 text=read(p)
 for a,b in replacements:text=text.replace(a,b)
 put(p,text)
explanation='''<section class="panel" aria-labelledby="registro-reflexivo"><h2 id="registro-reflexivo">Registro do processo: com ou sem IA</h2><p>Na candidata, M1-4 considera um registro reflexivo verdadeiro, não a obrigação de usar Gemini. Em <code>src/evidencias.json</code>, mantenha <code>aiLog</code> e acrescente <code>aiUsage</code>. Não copie os exemplos como uma experiência realizada.</p><p><code>used</code>: declare ajuda real, ao menos uma interação em <code>aiLog</code> e uma reflexão. <code>not-used</code>: deixe <code>aiLog: []</code> e explique como o grupo trabalhou sem IA. <code>undeclared</code>: informação pendente, sem pontuação automática. Reflexão de 20 a 400 caracteres, sem nomes ou segredos.</p><pre><code>{
  "aiLog": [],
  "aiUsage": {
    "status": "undeclared",
    "reflection": ""
  }
}</code></pre><p>Escrevam a reflexão conforme o trabalho realmente feito. Nunca inventem logs. Esta proposta aguarda aceite docente para uso oficial.</p></section>'''
for p in [L+'missoes.html',L+'gemini.html']:sub(p,'<nav class="lesson-next"',explanation+'\n<nav class="lesson-next"')
notice='''<p class="candidate-notice"><strong>Versão candidata — avaliação por equipe.</strong> Quatro tarefas para todos e registro reflexivo de uso ou não uso de IA são propostas em qualificação. A avaliação oficial aguarda aceite do professor e homologação do servidor. Os testes locais continuam formativos.</p>'''
for p in [L+n for n in ['index.html','comecar.html','missoes.html','gemini.html','atividade.html']]:
 text=read(p);m=re.search(r'<main\b[^>]*>',text)
 if not m:raise RuntimeError('Missing main '+p)
 put(p,text[:m.end()]+notice+text[m.end():])
context='''<div class="asset-context"><strong>Como interpretar o infográfico original:</strong> referência histórica, não o roteiro executável desta candidata. Aqui usamos <code>npm run web</code>, o app <strong>Atividades da escola</strong>, arquivos <code>.mjs</code> e nota coletiva. Não use Expo/Expo Go, <code>.tsx</code> ou distribuição individual de notas da imagem. O exemplo 9,2/10 não é possível nesta rubrica: os 20 critérios somam pontos em intervalos de 0,5. Siga os passos HTML e o professor. A contextualização do original aguarda aceite docente.</div>'''
for p in [L+'index.html',L+'atividade.html']:sub(p,'<figure class="image-area"',context+'<figure class="image-area"')
for p in [L+'README.md',L+'projeto/README.md',L+'GUIA_GEMINI.md']:
 put(p,read(p)+'\n\n## Registro reflexivo — candidata v2\n\nA nota é coletiva. Quatro tarefas para todas as equipes, sem correspondência arquivo–pessoa. Em src/evidencias.json, mantenha aiLog e aiUsage:{status,reflection}. used exige log real e reflexão; not-used exige log vazio e reflexão verdadeira; undeclared fica pendente. Reflexão: 20–400 caracteres. Propostas sujeitas a aceite docente.\n')
put('docs/AULA08_REMEDIATION_20261027.md',(T/'report.md').read_text())
put(L+'INTEGRACAO_SHEETS.md',(T/'runbook.md').read_text())
put(L+'assets/originais.sha256','c34cf2dd33ba1124f6f4632b2dde3a4cc30bd12ff5c7e282c2afe3498320e773  infografico-marcos-av1.png\n41d39b5f76041da3b88cc636b4b7a7478da499b0b99661c001d52dea04e539e9  fluxo-aluno-laboratorio-vivo.png\n')
p='tests/aula08-assets.cjs'
put(p,read(p)+'''
const originalHashes={'infografico-marcos-av1.png':'c34cf2dd33ba1124f6f4632b2dde3a4cc30bd12ff5c7e282c2afe3498320e773','fluxo-aluno-laboratorio-vivo.png':'41d39b5f76041da3b88cc636b4b7a7478da499b0b99661c001d52dea04e539e9'};
for(const [name,expected] of Object.entries(originalHashes)) {
 const target=require('node:path').join(__dirname,'../lessons/aula-08-av1-incremento-1/assets',name);
 if(require('node:fs').existsSync(target))require('node:assert/strict').equal(require('node:crypto').createHash('sha256').update(require('node:fs').readFileSync(target)).digest('hex'),expected,'Bytes originais alterados: '+name);
}
''')
for p in [L+'README.md',L+'projeto/README.md',L+'GUIA_GEMINI.md']:
 def replace_example(match):
  try:value=json.loads(match.group(1))
  except Exception:return match.group(0)
  if isinstance(value,dict) and 'aiLog' in value:return '```json\n'+json.dumps({'aiLog':[],'aiUsage':{'status':'undeclared','reflection':''}},ensure_ascii=False,indent=2)+'\n```'
  return match.group(0)
 put(p,re.sub(r'```json\s*\n(.*?)\n```',replace_example,read(p),flags=re.S))
for n in range(1,5):
 p=L+f'projeto/src/individual/aluno{n}.mjs';put(p,'// Tarefa técnica coletiva: o número do arquivo não identifica um aluno.\n'+read(p))
for p in content_files:
 text=read(p)
 for a,b in [('Resolver seu desafio e entregar','Revisar o trabalho da equipe e entregar'),('Teste sua parte separadamente','Teste o trabalho da equipe'),('seu arquivo individual','o arquivo de tarefa'),('do seu slot','da tarefa técnica'),('Para uma equipe com os quatro slots:','Para qualquer equipe, com as quatro tarefas:'),('selecionados','obrigatórios'),('selecionadas','obrigatórias')]:text=text.replace(a,b)
 put(p,text)
p='tests/aula08-browser.cjs'
sub(p,"    const firstPdf = await submitPdf('aula08-entrega.pdf');","    fixture=createFixture({policy:false});\n    await page.locator('#submit-delivery').click();await waitResult(false);\n    assert.equal(fixture.grade().length,1);assert.match(await page.locator('#delivery-status').innerText(),/DECISION_REQUIRED/);\n    await auditStatePair('policy-pending');fixture=createFixture();\n    const firstPdf = await submitPdf('aula08-entrega.pdf');")
p='.github/workflows/qa-aula08.yml'
sub(p,'  contratos:\n    runs-on: ubuntu-latest','  contratos:\n    strategy:\n      fail-fast: false\n      matrix:\n        os: [ubuntu-latest, windows-latest]\n    runs-on: ${{ matrix.os }}\n    defaults:\n      run:\n        shell: bash')
put(p,read(p).replace('    steps:\n      - uses: actions/checkout@v4','    steps:\n      - run: git config --global core.autocrlf false\n      - uses: actions/checkout@v4'))
sub(p,'tests/aula08-local*.test.* tests/aula08-jsonl*.test.* tests/aula08-pages*.test.cjs','tests/aula08-local*.test.* tests/aula08-jsonl*.test.* tests/aula08-pages*.test.cjs tests/aula08-remediation.test.cjs tests/aula08-identity.test.mjs tests/aula08-policy.test.mjs')
sub(p,'        run: node tests/aula08-browser.cjs','        env:\n          AULA08_EVIDENCE_DIR: ${{ runner.temp }}/a08-evidence\n        run: node tests/aula08-browser.cjs\n      - uses: actions/upload-artifact@v4\n        if: always()\n        with:\n          name: aula08-browser-${{ github.sha }}\n          path: ${{ runner.temp }}/a08-evidence\n          if-no-files-found: error')
for p,content in changes.items():
 target=ROOT/p;target.parent.mkdir(parents=True,exist_ok=True);target.write_text(content,encoding='utf-8')
print('APPLIED',len(changes),'paths in ephemeral runner; no external write')
