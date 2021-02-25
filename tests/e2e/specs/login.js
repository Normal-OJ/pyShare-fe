const emailRadioId = '[data-test=emailRadio]'
const schoolId = '[data-test=school]'
const usernameId = '[data-test=username]'
const passwordId = '[data-test=password]'
const loginBtnId = '[data-test=loginBtn]'
const emailId = '[data-test=email]'

describe('Login', () => {
  const logout = async () => {
    await cy.request({
      url: 'http://localhost:8080/api/auth/session',
      method: 'GET',
    })
  }

  const selectSchool = selectItem => {
    cy.get(schoolId)
      .parent()
      .click()
    cy.get('.v-menu__content')
      .contains(selectItem)
      .click()
  }

  beforeEach(() => {
    logout()
    cy.visit('/')
    cy.reload()
  })

  it('redirects from auth needed pages and redirects back after login.', () => {
    cy.visit('/courses')

    cy.url().should('include', '/login')
    cy.url().should('include', '?redirectToPath=%2Fcourses')
    // cy.location().should(loc => {
    //   expect(loc.pathname).to.eq('/login')
    //   expect(loc.search).to.eq('?redirectToPath=%2Fcourses')
    // })

    selectSchool('無')
    cy.get(usernameId).type('madoka')
    cy.get(passwordId).type('madoka')
    cy.get(loginBtnId).click()

    cy.url().should('include', '/courses')
    // cy.location().should(loc => {
    //   expect(loc.pathname).to.eq('/courses')
    // })
  })

  it('shows error message with wrong login info.', () => {
    cy.visit('/login')

    selectSchool('無')
    cy.get(usernameId).type('madoka')
    cy.get(passwordId).type('wrong')
    cy.get(loginBtnId).click()

    cy.contains('登入失敗')
  })

  it('can login with tcc by school+username.', () => {
    cy.visit('/login')
    cy.url().should('not.include', '?')
    // cy.location().should(loc => expect(loc.search).to.be.empty)
    selectSchool('無')
    cy.get(usernameId).type('tcchiang')
    cy.get(passwordId).type('tcchiang')
    cy.get(loginBtnId).click()
    cy.contains('登入成功')
    cy.url().should('include', '/courses')
    // cy.location().should(loc => expect(loc.pathname).to.eq('/courses'))
  })

  it('can login with tcc by email.', () => {
    cy.visit('/login')
    cy.get(emailRadioId).check({ force: true })
    cy.get(emailId).type('tcchiang@ntnu.edu.tw')
    cy.get(passwordId).type('tcchiang')
    cy.get(loginBtnId).click()
    cy.contains('登入成功')
    cy.location().should(loc => expect(loc.pathname).to.eq('/'))
  })
})
