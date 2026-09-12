const fs = require('fs');
const path = require('path');
const assert = require('node:assert/strict');

const pagePath = path.join(__dirname, '..', 'public', 'api-evidence.html');
const html = fs.readFileSync(pagePath, 'utf8');
const stepFilePath = path.join(__dirname, '..', 'cypress', 'e2e', 'api', 'steps', 'api-qa-commerce.steps.js');
const steps = fs.readFileSync(stepFilePath, 'utf8');

assert.match(
  html,
  /fetch\(['"]\/api\/evidencias['"]\)|fetch\(\/api\/evidencias\)|fileList|videoContainer/i,
  'A página deve consultar a API de evidências e renderizar os blocos de vídeo e arquivos'
);
assert.match(
  html,
  /video|evidence|videos|JSON/i,
  'A página deve ter área para vídeo e detalhes dos JSONs de evidência'
);
assert.match(
  steps,
  /validations\s*:\s*\{|request:\s*\[|response:\s*\[/i,
  'Os passos da API devem registrar validações de request e response na evidência'
);

console.log('api-evidence page check passed');
