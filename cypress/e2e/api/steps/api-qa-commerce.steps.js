import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import QaCommerceRequest from '../../../support/requests/QaCommerceRequest';

function renderApiEvidence(title, response, screenshotName) {
  cy.visit('/api-evidence.html').then(() => {
    cy.document().then((doc) => {
      doc.body.innerHTML = '';
      doc.body.style.margin = '0';
      doc.body.style.background = '#0b1020';
      doc.body.style.fontFamily = 'Consolas, monospace';

      const wrapper = doc.createElement('section');
      wrapper.id = screenshotName;
      wrapper.style.minHeight = '100vh';
      wrapper.style.padding = '32px';
      wrapper.style.boxSizing = 'border-box';
      wrapper.style.color = '#e5eefc';

      const heading = doc.createElement('h1');
      heading.textContent = title;
      heading.style.margin = '0 0 12px';
      heading.style.fontSize = '28px';

      const status = doc.createElement('p');
      status.textContent = `Status HTTP: ${response.status}`;
      status.style.margin = '0 0 20px';
      status.style.fontSize = '18px';
      status.style.color = '#7dd3fc';

      const pre = doc.createElement('pre');
      pre.style.margin = '0';
      pre.style.padding = '24px';
      pre.style.background = '#111827';
      pre.style.border = '1px solid #334155';
      pre.style.borderRadius = '12px';
      pre.style.whiteSpace = 'pre-wrap';
      pre.style.wordBreak = 'break-word';
      pre.style.maxHeight = '75vh';
      pre.style.overflow = 'auto';
      pre.textContent = JSON.stringify({
        status: response.status,
        headers: response.headers,
        body: response.body,
      }, null, 2);

      wrapper.appendChild(heading);
      wrapper.appendChild(status);
      wrapper.appendChild(pre);
      doc.body.appendChild(wrapper);
    });

    cy.get(`#${screenshotName}`).should('be.visible');
    cy.screenshot(screenshotName);
    cy.wait(2000);
  });
}

Given('que o carrinho do usuário com id 1 está limpo', () => {
  QaCommerceRequest.clearCart(1).then((response) => {
    expect(response.status).to.be.oneOf([200, 201]);
  });
});

When('eu solicitar a lista de produtos sem parâmetros de paginação', () => {
  QaCommerceRequest.getProducts().as('produtosResponse').then((response) => {
    cy.writeFile('cypress/evidence/api-produtos-response.json', {
      status: response.status,
      body: response.body,
    });

    renderApiEvidence('Evidencia da API: listagem de produtos', response, 'api-produtos-response');
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
      cy.writeFile('cypress/evidence/api-carrinho-add-response.json', {
        status: response.status,
        body: response.body,
      });

      renderApiEvidence('Evidencia da API: adicionar produto ao carrinho', response, 'api-carrinho-add-response');
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
    cy.writeFile('cypress/evidence/api-carrinho-contents-response.json', {
      status: response.status,
      body: response.body,
    });

    renderApiEvidence('Evidencia da API: conteudo do carrinho', response, 'api-carrinho-contents-response');

    expect(response.status).to.eq(200);
    const item = response.body.find((product) => product.productId === 1);
    expect(item).to.not.be.undefined;
    expect(item.quantity).to.eq(2);
  });
});