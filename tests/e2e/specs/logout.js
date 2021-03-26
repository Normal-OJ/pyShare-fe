const logoutMenuId = '[data-test=logoutMenu]'
const logoutBtnId = '[data-test=logoutBtn]'

describe('Logout', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login({
      school: '',
      username: 'madoka',
      password: 'madoka',
    })
  })

  it('let user logout after click logout.', () => {
    cy.get(logoutMenuId).click()
    cy.get(logoutBtnId).click()
    cy.contains('登入')
  })

  it('logout from different page.', () => {
    cy.visit('/courses')
    cy.get(logoutMenuId).click()
    cy.get(logoutBtnId).click()
    cy.contains('登入')
  })
})
