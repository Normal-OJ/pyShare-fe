import 'cypress-file-upload'
import { ActionTypes } from '../../../src/store/action-types'

Cypress.Commands.add('login', body => {
  cy.window().should('have.property', '__store__')
  cy.window().then(win => {
    win.__store__.dispatch(ActionTypes.LOGIN, body)
  })
  cy.wait(800)
})

Cypress.Commands.add('logout', () => {
  cy.window().should('have.property', '__store__')
  cy.window().then(win => {
    win.__store__.dispatch(ActionTypes.LOGOUT)
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
