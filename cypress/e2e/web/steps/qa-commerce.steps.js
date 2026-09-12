import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../../../support/pageObjects/HomePage';
import CartPage from '../../../support/pageObjects/CartPage';
import CheckoutPage from '../../../support/pageObjects/CheckoutPage';

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
    expect(messages).to.be.an('array').and.not.to.be.empty;
    CheckoutPage.getValidationMessages().should('have.length.at.least', 1).and('be.visible');
    cy.screenshot('checkout-validation-evidence', { capture: 'viewport' });
  });
});