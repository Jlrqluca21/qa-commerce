import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';

// Limpa o carrinho do usuário 1 antes dos testes de API.
Given('que o carrinho do usuário com id 1 está limpo', () => {
  cy.request('POST', '/api/limpar-carrinho', { userId: 1 }).then((response) => {
    expect(response.status).to.be.oneOf([200, 201]);
  });
});

// Validação de listagem de produtos sem parâmetros.
When('eu solicitar a lista de produtos sem parâmetros de paginação', () => {
  cy.request('GET', '/api/produtos').as('produtosResponse').then((response) => {
    cy.writeFile('cypress/evidence/api-produtos-response.json', {
      status: response.status,
      body: response.body,
    });
    // Render response into the page so the video captures it
    cy.visit('/').then(() => {
      cy.document().then((doc) => {
        const pre = doc.createElement('pre');
        pre.id = 'api-produtos-response';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.background = '#111';
        pre.style.color = '#e6e6e6';
        pre.style.padding = '12px';
        pre.style.maxHeight = '70vh';
        pre.style.overflow = 'auto';
        pre.textContent = JSON.stringify({ status: response.status, body: response.body }, null, 2);
        doc.body.appendChild(pre);
      });
      cy.get('#api-produtos-response').should('be.visible').screenshot('api-produtos-response');
      cy.wait(1000);
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

// Adicionar produto ao carrinho via API.
When('eu adicionar o produto com id 1 ao carrinho do usuário 1 com quantidade 2', () => {
  cy.request('POST', '/api/carrinho', {
    userId: 1,
    productId: 1,
    quantity: 2,
  }).as('adicionarCarrinhoResponse').then((response) => {
    cy.writeFile('cypress/evidence/api-carrinho-add-response.json', {
      status: response.status,
      body: response.body,
    });
    // Render add-to-cart response in the page for video evidence
    cy.visit('/').then(() => {
      cy.document().then((doc) => {
        const pre = doc.createElement('pre');
        pre.id = 'api-carrinho-add-response';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.background = '#111';
        pre.style.color = '#e6e6e6';
        pre.style.padding = '12px';
        pre.textContent = JSON.stringify({ status: response.status, body: response.body }, null, 2);
        doc.body.appendChild(pre);
      });
      cy.get('#api-carrinho-add-response').should('be.visible').screenshot('api-carrinho-add-response');
      cy.wait(1000);
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
  cy.request('GET', '/api/carrinho/1').then((response) => {
    cy.writeFile('cypress/evidence/api-carrinho-contents-response.json', {
      status: response.status,
      body: response.body,
    });
    // Render cart contents into the DOM so the video captures the final state
    cy.visit('/').then(() => {
      cy.document().then((doc) => {
        const pre = doc.createElement('pre');
        pre.id = 'api-carrinho-contents-response';
        pre.style.whiteSpace = 'pre-wrap';
        pre.style.background = '#111';
        pre.style.color = '#e6e6e6';
        pre.style.padding = '12px';
        pre.style.maxHeight = '70vh';
        pre.style.overflow = 'auto';
        pre.textContent = JSON.stringify({ status: response.status, body: response.body }, null, 2);
        doc.body.appendChild(pre);
      });
      cy.get('#api-carrinho-contents-response').should('be.visible').screenshot('api-carrinho-contents-response');
      cy.wait(1000);
    });
    expect(response.status).to.eq(200);
    const item = response.body.find((product) => product.productId === 1);
    expect(item).to.not.be.undefined;
    expect(item.quantity).to.eq(2);
  });
});
