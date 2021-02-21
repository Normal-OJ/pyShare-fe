// https://docs.cypress.io/api/introduction/api.html

describe('Hello world', () => {
  it('Visits the app root url', () => {
    cy.visit('/')
    cy.contains('div', '歡迎來到 Python 創作分享平台')
  })
})
