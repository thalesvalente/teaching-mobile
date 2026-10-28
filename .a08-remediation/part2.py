# Existing test fixtures: explicit synthetic policy approval, never production props.
p='tests/mobile-entregas-aula08.test.cjs'
put(p,read(p).replace('mobile-a08-v1','mobile-a08-v2').replace('mobile-a08-lab-vivo-1.1.0','mobile-a08-lab-vivo-2.0.0').replace('makeBinding([1])','makeBinding()'))
sub(p,"const props={MOBILE_WEB_SUBMISSIONS_ENABLED:'true'};","const props={MOBILE_WEB_SUBMISSIONS_ENABLED:'true',MOBILE_A08_POLICY_APPROVAL:options.policy===false?'':'four-tasks-reflection-v2'};")
sub(p,"    evidence:{preflight:","    evidence:{aiUsage:{status:'used',reflection:'Reflexão sintética de fixture de testes, não declaração de aluno.'},preflight:")
put(p,read(p).replace("binding.evidence.aiLog=[];", "binding.evidence.aiLog=[];binding.evidence.aiUsage={status:'not-used',reflection:''};").replace("noEvidence.evidence.aiLog=[];","noEvidence.evidence.aiLog=[];noEvidence.evidence.aiUsage={status:'not-used',reflection:''};"))
sub(p,"assert.throws(()=>f.dispatch(altered),/diferentes/)","assert.throws(()=>f.dispatch(altered),/diferentes|quatro|contradiz/)")
p='tests/aula08-local.test.mjs'
sub(p,"const fullEvidence={preflight:","const fullEvidence={aiUsage:{status:'used',reflection:'Reflexão sintética de teste, sem dados pessoais.'},preflight:")
put(p,read(p).replace('slots:[1]','slots:[1,2,3,4]'))
sub(p,"assert.deepEqual(parseSlots(['--slots=1,3']),[1,3]);","assert.deepEqual(parseSlots(['--slots=1,2,3,4']),[1,2,3,4]);assert.throws(()=>parseSlots(['--slots=1,3']),/quatro/);")
p='tests/aula08-jsonl.test.mjs'
a="test('1 a 4 slots selecionados produzem somente as fontes autorizadas'"
b="test('Base64 adulterado"
between(p,a,b,"""test('omitir tarefas obrigatórias é recusado antes de gerar o pacote',async()=>{
  await assert.rejects(generatePackage(project,[2,4]),/quatro/);
  assert.equal((await parsePackage(baseline)).sources.length,5);
});
""")
put(p,read(p).replace("JSON.stringify({aiLog:[{mission:'M1'","JSON.stringify({aiUsage:{status:'used',reflection:'Evidência sintética para validar rejeição de segredos.'},aiLog:[{mission:'M1'"))
for name in ['aula08-remediation.test.cjs','aula08-identity.test.mjs','aula08-policy.test.mjs']:
 put('tests/'+name,(T/name).read_text())
p='tests/aula08-browser.cjs'
sub(p,'const passed = [], pageErrors = [], external = [];','const passed = [], pageErrors = [], external = [], accessibility = [];')
a="      for (const width of [320, 375, 768, 1024, 1440])"
b="    record('Cinco páginas em"
i=read(p).index(a); j=read(p).index(b,i)
put(p,read(p)[:i]+'''      await page.addScriptTag({ path: require.resolve('axe-core/axe.min.js') });
      for (const width of [320, 375, 768, 1024, 1440]) for (const height of [812, 375]) {
        await page.setViewportSize({ width, height });
        await auditAccessibility('initial');
      }
    }
'''+read(p)[j:])
anchor="  try {\n    await page.goto(base + 'index.html');"
helper='''  async function auditStatePair(state) {
    const previous=page.viewportSize();
    for(const viewport of [{width:375,height:812},{width:1440,height:900}]) {
      await page.setViewportSize(viewport);await auditAccessibility(state);
    }
    await page.setViewportSize(previous);
  }
  async function auditAccessibility(state) {
    if(!await page.evaluate(()=>typeof axe!=='undefined'))
      await page.addScriptTag({path:require.resolve('axe-core/axe.min.js')});
    const data=await page.evaluate(async()=>({
      url:location.pathname,viewport:{width:innerWidth,height:innerHeight},
      overflow:document.documentElement.scrollWidth>innerWidth+1,
      disclosures:[...document.querySelectorAll('details[open]')].map(e=>e.id||e.className),
      violations:(await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa','wcag22aa']}})).violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)}))
    }));
    await page.locator('.skip-link').focus();await page.keyboard.press('Tab');
    const focus=await page.evaluate(()=>{const e=document.activeElement,s=getComputedStyle(e);return {tag:e.tagName,visible:s.outlineStyle!=='none'&&parseFloat(s.outlineWidth)>0,attached:document.contains(e)&&e!==document.body};});
    accessibility.push({...data,state,focus});
    fs.writeFileSync(path.join(output,'accessibility-matrix.json'),JSON.stringify(accessibility,null,2));
    assert.equal(data.overflow,false,JSON.stringify({state,viewport:data.viewport,url:data.url}));
    assert.deepEqual(data.violations,[],JSON.stringify({state,viewport:data.viewport,url:data.url}));
    assert.ok(focus.attached && focus.visible,'Teclado/foco: '+JSON.stringify(focus));
  }
  try {
    await page.goto(base + 'index.html');'''
sub(p,anchor,helper)
sub(p,"    await page.locator('.criteria-toggle summary').first().click();","    await page.locator('.criteria-toggle summary').first().click();\n    await auditStatePair('mission-1-criteria-open');")
sub(p,"    assert.match(await page.locator('#m4 .slot-guide').first().innerText(), /PRAÇA/);","    assert.match(await page.locator('#m4 .slot-guide').first().innerText(), /PRAÇA/);\n    await auditStatePair('mission-4-task-open');")
sub(p,"    await page.locator('[data-copy=\"prompt-m1\"]').click();","    await auditStatePair('gemini-prompt-open');\n    await page.locator('[data-copy=\"prompt-m1\"]').click();")
sub(p,"    await page.goto(base + 'atividade.html'); await upload(); await identify();","    await page.goto(base + 'atividade.html'); await upload();\n    await page.locator('#team').fill('');\n    await page.locator('#member-1').fill('A');\n    await auditStatePair('invalid-identity');\n    assert.equal(await page.locator('#member-1').getAttribute('aria-invalid'),'true');\n    assert.match(await page.locator('#member-1-error').innerText(),/três/);\n    await identify();")
sub(p,"    assert.equal(await page.locator('#member-results .result-card').count(), 1, 'A ficha apresenta uma nota para toda a equipe');","    assert.equal(await page.locator('#member-results .result-card').count(), 1, 'A ficha apresenta uma nota para toda a equipe');\n    await page.locator('#member-results summary').click();\n    await auditStatePair('verified-result-and-receipt');")
sub(p,"    record('Erro de gravação não confirma, mantendo PDF local');","    await auditStatePair('delivery-failure');\n    record('Erro de gravação não confirma, mantendo PDF local');")
sub(p,"    await context.setOffline(true);","    await context.setOffline(true);\n    await auditStatePair('offline');")
sub(p,"result.receipt.members[0].total += 0.5;","result.receipt.evaluation.total += 0.5;")
put(p,read(p).replace('quatro desafios individuais','quatro tarefas técnicas coletivas'))
sub(p,"    record('Nenhum erro JavaScript de página; nenhum pedido externo escapou ao mock');","    await page.setViewportSize({width:1440,height:900});\n    await auditAccessibility('final-desktop');\n    console.log('ACCESSIBILITY_MATRIX',accessibility.length,'actual axe/overflow/keyboard state samples');\n    record('Nenhum erro JavaScript de página; nenhum pedido externo escapou ao mock');")
