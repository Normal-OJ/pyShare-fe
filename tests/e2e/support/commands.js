import 'cypress-file-upload'
import { LOGIN, LOGOUT } from '../../../src/store/actions.type.js'

Cypress.Commands.add('login', body => {
  cy.window().should('have.property', '__store__')
  cy.window().then(win => {
    win.__store__.dispatch(LOGIN, body)
  })
  cy.wait(800)
})

Cypress.Commands.add('logout', () => {
  cy.window().should('have.property', '__store__')
  cy.window().then(win => {
    win.__store__.dispatch(LOGOUT)
  })
  cy.wait(800)
})

Cypress.Commands.add('vuetifyMenuSelect', (element, selection) => {
  cy.get(element)
    .parent()
    .click()
  cy.get('.v-menu__content')
    .contains(selection)
    .click()
})
