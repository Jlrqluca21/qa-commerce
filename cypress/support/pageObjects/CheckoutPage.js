class CheckoutPage {
  visit() {
    cy.visit('/checkout.html');
  }

  getForm() {
    return cy.get('#checkout-form');
  }

  fillShipping(data = {}) {
    if (data.firstName) cy.get('#first-name').clear().type(data.firstName);
    if (data.lastName) cy.get('#last-name').clear().type(data.lastName);
    if (data.address) cy.get('#address').clear().type(data.address);
    if (data.number) cy.get('#number').clear().type(data.number);
    if (data.cep) cy.get('#cep').clear().type(data.cep);
    if (data.phone) cy.get('#phone').clear().type(data.phone);
    if (data.email) cy.get('#email').clear().type(data.email);
  }

  selectCardPayment(payment = {}) {
    cy.get('#payment-card').check();
    cy.get('#card-number').should('be.visible').type(payment.cardNumber || '4111111111111111');
    cy.get('#card-expiry').type(payment.expiry || '12/30');
    cy.get('#card-cvc').type(payment.cvc || '123');
  }

  acceptTermsAndSubmit() {
    cy.get('#terms').check();
    cy.get('button[type="submit"]').click();
  }

  submitEmpty() {
    cy.get('button[type="submit"]').click();
  }

  getValidationMessages() {
    return cy.get('.invalid-feedback');
  }
}

export default new CheckoutPage();