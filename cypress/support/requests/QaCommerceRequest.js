class QaCommerceRequest {
  clearCart(userId) {
    return cy.request('POST', '/api/limpar-carrinho', { userId });
  }

  getProducts() {
    return cy.request('GET', '/api/produtos');
  }

  addToCart(payload) {
    return cy.request('POST', '/api/carrinho', payload);
  }

  getCart(userId) {
    return cy.request('GET', `/api/carrinho/${userId}`);
  }
}

export default new QaCommerceRequest();