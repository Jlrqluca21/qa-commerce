import QaCommerceRequest from '../requests/QaCommerceRequest';

class HomePage {
  visit() {
    cy.visit('/');
  }

  waitForProducts() {
    cy.get('.add-to-cart', { timeout: 10000 }).first().should('be.visible');
  }

  addFirstProductToCart() {
    QaCommerceRequest.clearCart(1).then(() => {
      cy.get('.add-to-cart').first().click();
      cy.get('#cart-count', { timeout: 10000 }).should('contain', '1');
    });
  }

  assertAddToCartSuccess() {
    cy.contains('Produto adicionado ao carrinho').should('be.visible');
  }

  getCartCount() {
    return cy.get('#cart-count');
  }

  openCartPage() {
    cy.visit('/cart.html');
  }
}

export default new HomePage();