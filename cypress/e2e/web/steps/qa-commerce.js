// Importa as definições de passos Gherkin para o Cypress Cucumber preprocessor.
import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import HomePage from '../../../support/pageObjects/home.page';
import CartPage from '../../../support/pageObjects/cart.page';
import CheckoutPage from '../../../support/pageObjects/checkout.page';

// Acessa a página inicial da aplicação QA-Commerce.
Given('que eu abra a página inicial do QA-Commerce', () => {
  HomePage.visit();
});

// Aguarda a lista de produtos carregar antes de continuar.
Given('que eu espere a lista de produtos carregar', () => {
  HomePage.waitForProducts();
});

// Adiciona o primeiro produto disponível ao carrinho e valida a mensagem de sucesso.
When('eu adicionar o primeiro produto disponível ao carrinho', () => {
  HomePage.addFirstProductToCart();
  HomePage.assertAddToCartSuccess();
});

// Verifica se o contador do carrinho está mostrando a quantidade correta.
Then('o contador do carrinho deve mostrar {string}', (count) => {
  HomePage.getCartCount().should('contain', count);
});

// Navega para a página do carrinho e valida que há ao menos um produto listado.
Then('o produto deve aparecer na página do carrinho', () => {
  CartPage.visit();
  CartPage.getCartListLegend().should('have.length.at.least', 1);
});

// Garante que exista um produto no carrinho antes de iniciar o checkout.
Given('que eu tenha pelo menos um produto no meu carrinho', () => {
  HomePage.visit();
  HomePage.waitForProducts();
  HomePage.addFirstProductToCart();
  HomePage.assertAddToCartSuccess();
  CartPage.visit();
  CartPage.getCartListLegend().should('have.length.at.least', 1);
});

// Abre a página de checkout e confere se o formulário está presente.
Given('que eu abra a página de checkout', () => {
  CheckoutPage.visit();
  CheckoutPage.getForm().should('exist');
});

// Preenche as informações de entrega e contato com dados válidos.
When('eu preencher informações de entrega válidas', () => {
  CheckoutPage.fillShipping({
    firstName: 'Maria',
    lastName: 'Silva',
    address: 'Rua das Flores, 123',
    number: '456',
    cep: '12345678',
    phone: '11987654321',
    email: 'maria.silva@example.com',
  });
});

// Seleciona pagamento com cartão de crédito e informa os dados do cartão.
When('eu selecionar pagamento com cartão de crédito', () => {
  CheckoutPage.selectCardPayment();
});

// Aceita os termos e envia o pedido.
When('eu aceitar os termos e finalizar o pedido', () => {
  CheckoutPage.acceptTermsAndSubmit();
});

// Valida se o navegador foi redirecionado para a página de status do pedido.
Then('eu devo ser redirecionado para a página de status do pedido', () => {
  cy.url({ timeout: 10000 }).should('include', '/status.html');
});

// Verifica se o pedido foi confirmado com número e total exibidos.
Then('eu devo ver um número de pedido confirmado e o preço total', () => {
  cy.get('#order-status').should('contain.text', 'Obrigado pelo seu pedido');
  cy.get('#order-status').should('contain.text', 'ID do Pedido');
  cy.get('#order-status').should('contain.text', 'Total:');
});

// Envia o formulário de checkout sem preencher os campos obrigatórios.
When('eu enviar o formulário de checkout sem preencher os campos obrigatórios', () => {
  CheckoutPage.visit();
  CheckoutPage.submitEmpty();
});

// Checa se as mensagens de validação obrigatória são exibidas.
Then('a página deve mostrar mensagens de validação para os campos obrigatórios', () => {
  CheckoutPage.getValidationMessages().should('have.length.at.least', 1).then(($els) => {
    // Collect messages text
    const messages = Array.from($els).map((el) => el.innerText.trim()).filter(Boolean);
    // Persist messages to evidence folder
    cy.writeFile('cypress/evidence/checkout-validation-messages.json', { messages });
    // Ensure the alert text is visible and capture screenshot for video evidence
    cy.contains('Por favor, preencha todos os campos obrigatório marcados com asteriscos!').should('be.visible');
    cy.screenshot('checkout-validation-messages');
    // Inject a clear PASS indicator into the DOM so the video shows the successful check
    cy.document().then((doc) => {
      const div = doc.createElement('div');
      div.id = 'checkout-validation-pass';
      div.textContent = 'VALIDATION CHECK: PASS';
      div.style.position = 'fixed';
      div.style.top = '10px';
      div.style.right = '10px';
      div.style.padding = '10px 14px';
      div.style.background = '#28a745';
      div.style.color = '#fff';
      div.style.zIndex = 99999;
      div.style.borderRadius = '6px';
      doc.body.appendChild(div);
    });
    // Save pass result JSON and capture screenshot of the PASS indicator
    cy.writeFile('cypress/evidence/checkout-validation-result.json', { result: 'pass' });
    cy.get('#checkout-validation-pass').should('be.visible').screenshot('checkout-validation-pass');
    cy.wait(1200);
  });
});

// Garante que o pedido não foi enviado e permanece na página de checkout.
Then('o pedido não deve ser enviado', () => {
  cy.url().should('include', '/checkout.html');
});
