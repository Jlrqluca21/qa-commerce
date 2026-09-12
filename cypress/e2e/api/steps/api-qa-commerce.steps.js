import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import QaCommerceRequest from '../../../support/requests/QaCommerceRequest';

function normalizeRequest(request) {
  const source = request?.request || request || {};

  return {
    method: source.method || request?.method || 'UNKNOWN',
    url: source.url || request?.url || '',
    headers: source.headers || request?.headers || {},
    body: source.body ?? request?.body ?? null,
  };
}

function normalizeResponse(response) {
  return {
    status: response?.status,
    headers: response?.headers || {},
    body: response?.body,
  };
}

function renderApiEvidence(title, request, response, fileName, validations = {}) {
  const evidence = {
    title,
    result: Object.values(validations?.response || {}).every((validation) => validation.passed) && Object.values(validations?.request || {}).every((validation) => validation.passed) ? 'pass' : 'fail',
    request: normalizeRequest(request),
    response: normalizeResponse(response),
    validations: {
      request: validations.request || [],
      response: validations.response || [],
    },
    validatedAt: new Date().toISOString(),
  };

  cy.writeFile(`cypress/evidence/${fileName}.json`, evidence);
}

Given('que o carrinho do usuário com id 1 está limpo', () => {
  QaCommerceRequest.clearCart(1).then((response) => {
    expect(response.status).to.be.oneOf([200, 201]);
  });
});

When('eu solicitar a lista de produtos sem parâmetros de paginação', () => {
  QaCommerceRequest.getProducts().as('produtosResponse').then((response) => {
    const requestSummary = {
      method: 'GET',
      url: `${Cypress.config('baseUrl') || 'http://localhost:3000'}/api/produtos`,
      headers: response?.request?.headers || {},
      body: null,
    };

    const responseValidation = [
      { name: 'status', expected: 200, actual: response.status, passed: response.status === 200 },
      { name: 'products array', expected: true, actual: Array.isArray(response.body?.products), passed: Array.isArray(response.body?.products) },
      { name: 'currentPage', expected: 1, actual: response.body?.currentPage, passed: response.body?.currentPage === 1 },
    ];

    renderApiEvidence('Evidencia da API: listagem de produtos', requestSummary, response, 'api-produtos-response', {
      request: [
        { name: 'method', expected: 'GET', actual: requestSummary.method, passed: requestSummary.method === 'GET' },
        { name: 'url', expected: '/api/produtos', actual: requestSummary.url, passed: requestSummary.url.includes('/api/produtos') },
      ],
      response: responseValidation,
    });
  });
});

Then('a resposta deve retornar status 200', () => {
  cy.get('@produtosResponse').then((response) => {
    expect(response.status).to.eq(200);
  });
});

Then('o corpo deve conter uma lista de produtos', () => {
  cy.get('@produtosResponse').then((response) => {
    expect(response.body).to.have.property('products');
    expect(response.body.products).to.be.an('array');
  });
});

Then('a página atual deve ser 1', () => {
  cy.get('@produtosResponse').then((response) => {
    expect(response.body).to.have.property('currentPage', 1);
  });
});

When('eu adicionar o produto com id 1 ao carrinho do usuário 1 com quantidade 2', () => {
  cy.fixture('cart-payload').then((payload) => {
    QaCommerceRequest.addToCart(payload).as('adicionarCarrinhoResponse').then((response) => {
      const requestSummary = {
        method: 'POST',
        url: `${Cypress.config('baseUrl') || 'http://localhost:3000'}/api/carrinho`,
        headers: response?.request?.headers || {},
        body: payload,
      };

      const responseValidation = [
        { name: 'status', expected: 201, actual: response.status, passed: response.status === 201 },
        { name: 'message', expected: 'Produto adicionado ao carrinho com sucesso.', actual: response.body?.message, passed: /produto adicionado ao carrinho com sucesso/i.test(response.body?.message || '') },
      ];

      renderApiEvidence('Evidencia da API: adicionar produto ao carrinho', requestSummary, response, 'api-carrinho-add-response', {
        request: [
          { name: 'method', expected: 'POST', actual: requestSummary.method, passed: requestSummary.method === 'POST' },
          { name: 'url', expected: '/api/carrinho', actual: requestSummary.url, passed: requestSummary.url.includes('/api/carrinho') },
          { name: 'body', expected: payload, actual: requestSummary.body, passed: JSON.stringify(requestSummary.body) === JSON.stringify(payload) },
        ],
        response: responseValidation,
      });
    });
  });
});

Then('a resposta deve retornar status 201', () => {
  cy.get('@adicionarCarrinhoResponse').then((response) => {
    expect(response.status).to.eq(201);
  });
});

Then('a mensagem deve indicar que o produto foi adicionado com sucesso', () => {
  cy.get('@adicionarCarrinhoResponse').then((response) => {
    expect(response.body).to.have.property('message');
    expect(response.body.message).to.match(/produto adicionado ao carrinho com sucesso/i);
  });
});

Then('o carrinho do usuário 1 deve conter o produto com id 1 e quantidade 2', () => {
  QaCommerceRequest.getCart(1).then((response) => {
    const requestSummary = {
      method: 'GET',
      url: `${Cypress.config('baseUrl') || 'http://localhost:3000'}/api/carrinho/1`,
      headers: response?.request?.headers || {},
      body: null,
    };

    const item = response.body.find((product) => product.productId === 1);
    const responseValidation = [
      { name: 'status', expected: 200, actual: response.status, passed: response.status === 200 },
      { name: 'product found', expected: true, actual: !!item, passed: !!item },
      { name: 'quantity', expected: 2, actual: item?.quantity, passed: item?.quantity === 2 },
    ];

    renderApiEvidence('Evidencia da API: conteudo do carrinho', requestSummary, response, 'api-carrinho-contents-response', {
      request: [
        { name: 'method', expected: 'GET', actual: requestSummary.method, passed: requestSummary.method === 'GET' },
        { name: 'url', expected: '/api/carrinho/1', actual: requestSummary.url, passed: requestSummary.url.includes('/api/carrinho/1') },
      ],
      response: responseValidation,
    });

    cy.visit('/api-evidence.html?file=api-carrinho-contents-response.json');
    cy.get('.status').should('contain', 'PASSOU');
    cy.contains('h3', 'Request enviado').should('be.visible');
    cy.contains('h3', 'Response recebida').should('be.visible');
    cy.get('#jsonContent .io-panel pre').should('contain', '"status"');
    cy.get('#jsonContent').scrollIntoView();
    cy.wait(1000);

    expect(response.status).to.eq(200);
    expect(item).to.not.be.undefined;
    expect(item.quantity).to.eq(2);
  });
});