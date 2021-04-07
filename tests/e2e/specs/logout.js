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

  const pages = ['/', '/courses', '/about']
  pages.forEach(page => {
    it(`makes user loging out & redirect to home after clicking logout button from ${page}.`, () => {
      cy.visit(page)
      cy.get(logoutMenuId).click()
      cy.get(logoutBtnId).click()
      cy.contains('登入')
    })
  })
})
