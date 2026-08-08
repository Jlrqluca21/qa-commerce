// Cypress configuration file for end-to-end tests using the Cucumber preprocessor.
const { defineConfig } = require('cypress');
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');

module.exports = defineConfig({
  video: true,
  videosFolder: 'cypress/videos',
  screenshotsFolder: 'cypress/screenshots',
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: 'cypress/reports',
    overwrite: true,
    html: true,
    json: true,
    charts: true,
    embeddedScreenshots: true,
    inlineAssets: true,
    saveAllAttempts: true,
    ignoreVideos: false,
    videoOnFailOnly: false,
  },
  e2e: {
    // Use feature files for Cucumber BDD scenarios.
    specPattern: 'cypress/e2e/**/*.feature',
    // Load support commands and configuration from this file.
    supportFile: 'cypress/support/e2e.js',
    // Base URL used when tests call cy.visit().
    baseUrl: 'http://localhost:3000',
    async setupNodeEvents(on, config) {
      // Register the cucumber preprocessor plugin.
      await addCucumberPreprocessorPlugin(on, config);
      // Use esbuild as the file preprocessor for Cucumber feature files.
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
