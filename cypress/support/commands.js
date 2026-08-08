// Custom Cypress commands are declared here to reuse logic across tests.
// This file is imported automatically by cypress/support/e2e.js.

import HomePage from './pageObjects/HomePage';
import CartPage from './pageObjects/CartPage';
import CheckoutPage from './pageObjects/CheckoutPage';
import { buildCheckoutData } from './factories/checkoutDataFactory';

Cypress.Commands.add('visitHomeAndWaitForProducts', () => {
  HomePage.visit();
  HomePage.waitForProducts();
});

Cypress.Commands.add('addFirstProductToCartAndConfirm', () => {
  HomePage.addFirstProductToCart();
  HomePage.assertAddToCartSuccess();
});

Cypress.Commands.add('ensureCartHasProduct', () => {
  cy.visitHomeAndWaitForProducts();
  cy.addFirstProductToCartAndConfirm();
  CartPage.visit();
  cy.contains('h1', 'SEU CARRINHO').should('be.visible');
  CartPage.getCartListLegend().first().should('be.visible');
});

Cypress.Commands.add('openCheckoutForm', () => {
  CheckoutPage.visit();
  cy.contains('h1', 'CHECKOUT').should('be.visible');
  CheckoutPage.getForm().should('be.visible');
});

Cypress.Commands.add('prepareCheckoutData', () => {
  const checkoutData = buildCheckoutData();

  cy.wrap(checkoutData, { log: false }).as('checkoutData');
  cy.writeFile('cypress/evidence/checkout-generated-data.json', checkoutData);

  return cy.wrap(checkoutData, { log: false });
});

Cypress.Commands.add('fillCheckoutShippingWithGeneratedData', () => {
  return cy.prepareCheckoutData().then((checkoutData) => {
    CheckoutPage.fillShipping(checkoutData.shipping);
  });
});

Cypress.Commands.add('selectCardPaymentFromCheckoutData', () => {
  cy.get('@checkoutData').then((checkoutData) => {
    CheckoutPage.selectCardPayment(checkoutData.payment);
  });
});
