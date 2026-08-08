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

### Executar testes Cypress em modo aberto
```
npm run cy:open
```

### Executar testes Cypress em modo headless
```
npm run cy:run
```

### Executar testes BDD de API
O cenário de API principal está em `cypress/e2e/api/features/api-qa-commerce.feature`.

### Observações
- O teste de API valida o endpoint `GET /api/produtos` e o endpoint `POST /api/carrinho`.
- Use `npm start` em uma janela do terminal e os comandos de teste em outra.

*Parceria: Fábio Araújo, Bruna Emerich e Tamara Fontanella

## Comandos úteis para executar os testes

Execute o servidor em uma janela de terminal:
```bash
npm start
```

Rodar todos os testes (headless):
```bash
npm run cy:run
```

Abrir o Test Runner (modo interativo):
```bash
npm run cy:open
```

Executar apenas o cenário de API (feature específica):
```bash
npm run cy:run -- --spec "cypress/e2e/api/features/api-qa-commerce.feature" --config "baseUrl=http://localhost:3000,video=true"
```

Executar apenas os testes UI (feature específica):
```bash
npm run cy:run -- --spec "cypress/e2e/web/features/qa-commerce.feature" --config "baseUrl=http://localhost:3000,video=true"
```

Observação: os comandos acima iniciam o Cypress em modo headless e geram vídeo por padrão quando `video=true`.
Observação adicional: prefira `npm run cy:run` e `npm run cy:open`, pois esses scripts usam `scripts/run-cypress.js` para filtrar o warning de `allowCypressEnv` na saída do terminal.

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






