# QA-Commerce

### Loja virtual Geek para simulação de testes 

## Clonando e executando em sua máquina

### Pré-requisito:

-Node.js - Você encontra em: https://nodejs.org/en/
-Visual Studio Code ( ou editor de sua prefrência) - você encontra em: https://code.visualstudio.com/download
-Git: você encontra em: https://git-scm.com/downloads

Via terminal, rode os seguintes comandos:
```  
git clone https://github.com/Jlrqluca21/qa-commerce
```
```
cd qa-commerce
```

#### Para instalar as dependencias:
```
npm install 
```

#### Para subir o servidor e o banco:
```
npm start
```

No console vai aparecer os endereços do site e do banco. 
O site você acessa em: http://localhost:3000/

A documentação funciona em: http://localhost:3000/api-docs/

## Testes automatizados

### Pré-requisito
O servidor deve estar rodando em `http://localhost:3000` antes de executar os testes.

### Executar todos os testes (API + WEB)
```bash
npm run cy:run
```

### Executar apenas testes de API
Feature principal de API:
`cypress/e2e/api/features/api-qa-commerce.feature`

```bash
npm run cy:run -- --spec "cypress/e2e/api/features/api-qa-commerce.feature" --config "baseUrl=http://localhost:3000,video=true"
```

### Executar apenas testes WEB
Feature principal WEB:
`cypress/e2e/web/features/qa-commerce.feature`

```bash
npm run cy:run -- --spec "cypress/e2e/web/features/qa-commerce.feature" --config "baseUrl=http://localhost:3000,video=true"
```

### Executar em modo interativo (Cypress Open)
```bash
npm run cy:open
```

No Test Runner, selecione manualmente a feature de API ou WEB desejada.

### Observações
- O teste de API valida os endpoints `GET /api/produtos` e `POST /api/carrinho`.
- Use `npm start` em uma janela do terminal e os comandos de teste em outra.
- Prefira `npm run cy:run` e `npm run cy:open`, pois usam `scripts/run-cypress.js` para filtrar warnings do terminal.

*Parceria: Fábio Araújo, Bruna Emerich e Tamara Fontanella

## Resumo rápido de execução

```bash
# 1) Subir aplicação
npm start

# 2) Rodar API
npm run cy:run -- --spec "cypress/e2e/api/features/api-qa-commerce.feature" --config "baseUrl=http://localhost:3000,video=true"

# 3) Rodar WEB
npm run cy:run -- --spec "cypress/e2e/web/features/qa-commerce.feature" --config "baseUrl=http://localhost:3000,video=true"
```

## CI/CD (GitHub Actions)

O projeto ja possui pipeline configurada em:
- `.github/workflows/cypress.yml`

### Quando a pipeline roda
- Em `push` para qualquer branch
- Em `pull_request` para qualquer branch

### Como a pipeline executa
1. Faz checkout do repositorio (`actions/checkout@v4`)
2. Configura Node.js 20 com cache de dependencias npm (`actions/setup-node@v4`)
3. Executa os testes com `cypress-io/github-action@v6`, usando:
	- `install-command: npm ci`
	- `start: npm start`
	- `wait-on: http://localhost:3000`
	- `wait-on-timeout: 120`
	- `command: npm run cy:run`

### Artefatos publicados no CI
Mesmo em caso de falha, a pipeline faz upload dos artefatos de teste (`if: always()`):
- `cypress/screenshots`
- `cypress/videos`
- `cypress/evidence`
- `cypress/reports` (inclui o `index.html` do Mochawesome)

### O que isso garante
- Execucao automatica dos testes E2E (API + WEB) em PRs e pushes
- Evidencias disponiveis para investigacao de falhas
- Ambiente de execucao padronizado (Ubuntu + Node 20)

## Relatório visual das execuções

Os testes também geram um relatório HTML visual com screenshots e detalhes da execução usando Mochawesome.

### Gerar o relatório
```bash
npm test
```

### Visualizar o relatório
```bash
npm run report:open
```

O relatório será aberto em seu navegador padrão a partir do arquivo:
- `cypress/reports/index.html`

## Onde encontrar as evidências

- Vídeos: `cypress/videos/**/*.mp4` (ex.: `cypress/videos/api/features/api-qa-commerce.feature.mp4`)
- Screenshots: `cypress/screenshots/<spec>/*.png` (ex.: `cypress/screenshots/api/features/api-qa-commerce.feature/api-produtos-response.png`)
- JSON com responses das APIs: `cypress/evidence/*.json` (ex.: `cypress/evidence/api-produtos-response.json`)






