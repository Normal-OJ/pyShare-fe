const emailRadioId = '[data-test=emailRadio]'
const schoolId = '[data-test=school]'
const usernameId = '[data-test=username]'
const passwordId = '[data-test=password]'
const loginBtnId = '[data-test=loginBtn]'
const emailId = '[data-test=email]'

describe('Login', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.logout()
    cy.reload()
  })

  after(() => {
    cy.logout()
  })

  it('redirects from auth needed pages and redirects back after login.', () => {
    cy.visit('/courses')

    cy.url().should('include', '/login')
    cy.url().should('include', '?redirectToPath=%2Fcourses')

    cy.vuetifyMenuSelect(schoolId, '無')
    cy.get(usernameId).type('madoka')
    cy.get(passwordId).type('madoka')
    cy.get(loginBtnId).click()

    cy.url().should('include', '/courses')
  })

  it('shows error message with wrong login info.', () => {
    cy.visit('/login')

    cy.vuetifyMenuSelect(schoolId, '無')
    cy.get(usernameId).type('madoka')
    cy.get(passwordId).type('wrong')
    cy.get(loginBtnId).click()

    cy.contains('登入失敗')
  })

  it('can login with tcc by school+username.', () => {
    cy.visit('/login')
    cy.url().should('not.include', '?')
    cy.vuetifyMenuSelect(schoolId, '無')
    cy.get(usernameId).type('tcchiang')
    cy.get(passwordId).type('tcchiang')
    cy.get(loginBtnId).click()
    cy.contains('登入成功')
    cy.url().should('include', '/courses')
  })

  it('can login with tcc by email.', () => {
    cy.visit('/login')
    cy.get(emailRadioId).check({ force: true })
    cy.get(emailId).type('tcchiang@ntnu.edu.tw')
    cy.get(passwordId).type('tcchiang')
    cy.get(loginBtnId).click()
    cy.contains('登入成功')
    cy.url().should('include', '/courses')
  })
})
