class CartPage {
  visit() {
    cy.visit('/cart.html');
  }

  getCartListLegend() {
    return cy.get('#cart-list legend');
  }

  findProductById(productId) {
    return cy.get(`#cart-list [data-product-id="${productId}"]`);
  }
}

export default new CartPage();