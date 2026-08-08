class HomePage {
  visit() {
    cy.visit('/');
  }

  waitForProducts() {
    cy.get('.add-to-cart', { timeout: 10000 }).should('exist');
  }

  addFirstProductToCart() {
    // Ensure cart is empty before adding to avoid flakiness
    cy.request('POST', '/api/limpar-carrinho', { userId: 1 }).then(() => {
      cy.get('.add-to-cart').first().click();
      // Wait for cart counter to update to 1
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
