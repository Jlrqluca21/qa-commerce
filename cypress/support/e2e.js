// Cypress support file used for every spec.
// Any custom commands or global setup can be imported here.
import './commands';
import 'cypress-mochawesome-reporter/register';

beforeEach(function () {
  cy.log(`Iniciando teste: ${this.currentTest.title}`);
});
