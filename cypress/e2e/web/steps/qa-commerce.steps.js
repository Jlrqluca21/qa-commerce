import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../../../support/pageObjects/HomePage';
import CartPage from '../../../support/pageObjects/CartPage';
import CheckoutPage from '../../../support/pageObjects/CheckoutPage';

function renderCheckoutEvidence(messages) {
  cy.document().then((doc) => {
    const existing = doc.getElementById('checkout-validation-evidence');
    if (existing) {
      existing.remove();
    }

    const wrapper = doc.createElement('section');
    wrapper.id = 'checkout-validation-evidence';
    wrapper.style.position = 'fixed';
    wrapper.style.inset = '0';
    wrapper.style.padding = '32px';
    wrapper.style.boxSizing = 'border-box';
    wrapper.style.background = 'rgba(11, 16, 32, 0.96)';
    wrapper.style.color = '#e5eefc';
    wrapper.style.fontFamily = 'Consolas, monospace';
    wrapper.style.zIndex = '99999';
    wrapper.style.overflow = 'auto';

    const heading = doc.createElement('h1');
    heading.textContent = 'Evidencia Web: validacao do checkout';
    heading.style.margin = '0 0 12px';
    heading.style.fontSize = '28px';

    const status = doc.createElement('p');
    status.textContent = 'Resultado: PASS';
    status.style.margin = '0 0 20px';
    status.style.fontSize = '18px';
    status.style.color = '#4ade80';

    const list = doc.createElement('ul');
    list.style.margin = '0';
    list.style.padding = '24px 24px 24px 48px';
    list.style.background = '#111827';
    list.style.border = '1px solid #334155';
    list.style.borderRadius = '12px';
    list.style.lineHeight = '1.8';
    list.style.fontSize = '18px';

    messages.forEach((message) => {
      const item = doc.createElement('li');
      item.textContent = message;
      list.appendChild(item);
    });

    wrapper.appendChild(heading);
    wrapper.appendChild(status);
    wrapper.appendChild(list);
    doc.body.appendChild(wrapper);
  });

  cy.get('#checkout-validation-evidence').should('be.visible');
  cy.screenshot('checkout-validation-evidence');
  cy.wait(2000);
}

Given('que eu abra a página inicial do QA-Commerce', () => {
  HomePage.visit();
});

Given('que eu espere a lista de produtos carregar', () => {
  cy.visitHomeAndWaitForProducts();
});

When('eu adicionar o primeiro produto disponível ao carrinho', () => {
  cy.addFirstProductToCartAndConfirm();
});

Then('o contador do carrinho deve mostrar {string}', (count) => {
  HomePage.getCartCount().should('contain', count);
});

Then('o produto deve aparecer na página do carrinho', () => {
  CartPage.visit();
  cy.contains('h1', 'SEU CARRINHO').should('be.visible');
  CartPage.getCartListLegend().first().should('be.visible');
});

Given('que eu tenha pelo menos um produto no meu carrinho', () => {
  cy.ensureCartHasProduct();
});

Given('que eu abra a página de checkout', () => {
  cy.openCheckoutForm();
});

When('eu preencher informações de entrega válidas', () => {
  cy.fillCheckoutShippingWithGeneratedData();
});

When('eu selecionar pagamento com cartão de crédito', () => {
  cy.selectCardPaymentFromCheckoutData();
});

When('eu aceitar os termos e finalizar o pedido', () => {
  CheckoutPage.acceptTermsAndSubmit();
});

Then('eu devo ser redirecionado para a página de status do pedido', () => {
  cy.url({ timeout: 10000 }).should('include', '/status.html');
});

Then('eu devo ver um número de pedido confirmado e o preço total', () => {
  cy.get('#order-status').should('be.visible').and('contain', 'Obrigado pelo seu pedido');
  cy.get('#order-status').should('contain', 'ID do Pedido');
  cy.get('#order-status').should('contain', 'Total:');
});

When('eu enviar o formulário de checkout sem preencher os campos obrigatórios', () => {
  CheckoutPage.visit();
  CheckoutPage.submitEmpty();
});

Then('a página deve mostrar mensagens de validação para os campos obrigatórios', () => {
  CheckoutPage.getValidationMessages().should('have.length.at.least', 1).then(($els) => {
    const messages = Array.from($els).map((el) => el.innerText.trim()).filter(Boolean);

    cy.writeFile('cypress/evidence/checkout-validation-messages.json', { messages });
    CheckoutPage.getValidationMessages().first().should('be.visible').and('contain', 'Este campo é obrigatório.');
    cy.contains('Por favor, preencha todos os campos obrigatório marcados com asteriscos!').should('be.visible');
    cy.wrap(messages, { log: false }).as('checkoutValidationMessages');

    cy.writeFile('cypress/evidence/checkout-validation-result.json', { result: 'pass' });
  });
});

Then('o pedido não deve ser enviado', () => {
  cy.url().should('include', '/checkout.html');
  cy.get('@checkoutValidationMessages').then((messages) => {
    renderCheckoutEvidence(messages);
  });
});