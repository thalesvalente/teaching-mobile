'use strict';
const fs = require('node:fs');
const assert = require('node:assert/strict');
const path = require('node:path');
const YAML = require('yaml');

for (const name of fs.readdirSync('.github/workflows').filter(n => /\.ya?ml$/.test(n))) {
  const file = path.join('.github/workflows', name);
  const parsed = YAML.parseDocument(fs.readFileSync(file, 'utf8'), { uniqueKeys: true });
  assert.deepEqual(parsed.errors, [], `YAML inválido: ${file}`);
  const workflow = parsed.toJS();
  assert.ok(workflow.on && workflow.jobs, `Workflow sem eventos/jobs: ${file}`);
  if (name === 'qa-aula08-live-v4.yml') {
    assert.ok(workflow.on.push.branches.includes('feat/aula08-lab-vivo-ciclos-20261111'));
    assert.ok(workflow.on.pull_request && Object.hasOwn(workflow.on, 'workflow_dispatch'));
    assert.deepEqual(workflow.permissions, { contents: 'read' });
    for (const job of Object.values(workflow.jobs)) {
      assert.ok(job['timeout-minutes'] > 0);
      assert.ok(!job['continue-on-error'], 'QA não pode ignorar falhas');
    }
  }
  console.log(`PASS ${file}`);
}
