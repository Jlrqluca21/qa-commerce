# Estrutura do Projeto QA-Commerce

## Visao geral
Este repositorio contem:
- Aplicacao web (frontend estatico em HTML/CSS/JS)
- Backend Node.js/Express com API
- Automacao de testes com Cypress + Cucumber (BDD)
- Geracao de evidencias e relatorios de execucao

## Fluxo principal
1. O servidor sobe por `src/server.js`.
2. O frontend e servido a partir de `public/`.
3. A API e protegida (quando necessario) por middleware em `middleware/auth.js`.
4. Os testes E2E/API rodam em `cypress/e2e/`.
5. Artefatos sao gerados em `cypress/evidence`, `cypress/screenshots`, `cypress/videos` e `cypress/reports`.

## Estrutura por pasta

### Raiz
- `package.json`: scripts e dependencias
- `README.md`: setup e comandos de execucao
- `cypress.config.js`: configuracao Cypress (BDD, reporter, saida)
- `collection-pm.json`: colecao Postman

### config/
- `db.js`: conexao/configuracao de banco
- `swagger.json`: documentacao/contrato da API

### src/
- `server.js`: servidor principal, rotas e arquivos estaticos

### middleware/
- `auth.js`: autenticacao JWT para rotas administrativas

### public/
Contem o frontend da loja:
- Paginas: `index.html`, `product.html`, `cart.html`, `checkout.html`, `status.html`, `login.html`, `dashboard.html`, etc.
- Estilos: `css/styles.css`
- Scripts: `js/*.js` (app, carrinho, checkout, produto, usuario, etc.)
- Midia: `images/produtos/`
- Apoio a evidencias: `api-evidence.html`

### scripts/
- `init_db.js`: inicializacao do banco
- `run-cypress.js`: wrapper para executar Cypress e tratar warnings

### cypress/
Base de automacao de testes.

#### cypress/e2e/
- `api/`: cenarios BDD da API
  - `features/api-qa-commerce.feature`
  - `steps/api-qa-commerce.steps.js`
- `web/`: cenarios BDD da interface
  - `features/qa-commerce.feature`
  - `steps/qa-commerce.steps.js`

#### cypress/support/
Componentes reutilizaveis dos testes:
- `e2e.js`: bootstrap global de testes
- `commands.js`: comandos customizados
- `pageObjects/`: HomePage, CartPage, CheckoutPage
- `requests/QaCommerceRequest.js`: chamadas API centralizadas
- `factories/checkoutDataFactory.js`: geracao de massa dinamica

#### cypress/fixtures/
Massa estatica de teste:
- `cart-payload.json`
- `checkout-data.json`

#### cypress/evidence/
Evidencias em JSON (respostas de API, validacoes, dados gerados)

#### cypress/screenshots/ e cypress/videos/
Evidencias visuais por execucao

#### cypress/reports/
- `index.html`: relatorio visual Mochawesome

### tests/
- `collection-pm.json`: colecao Postman adicional

## Observacao tecnica
Foi identificada duplicidade historica de steps web entre `qa-commerce.steps.js` e `qa-commerce.js`.

Status atual:
- O arquivo legado `cypress/e2e/web/steps/qa-commerce.js` foi removido.
- O fluxo web ativo permanece em `cypress/e2e/web/steps/qa-commerce.steps.js`, importado por `cypress/e2e/web/features/qa-commerce.js`.

Validacao apos a limpeza:
- Execucao da feature web concluida com sucesso (3 testes passando, 0 falhando).

Recomendacao operacional:
- Preferir `npm run cy:run` e `npm run cy:open` (wrapper em `scripts/run-cypress.js`) para reduzir ruido de warning no terminal durante as execucoes.
