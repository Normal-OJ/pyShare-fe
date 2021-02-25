const schoolId = '[data-test=school]'
const usernameId = '[data-test=username]'
const passwordId = '[data-test=password]'
const loginBtnId = '[data-test=loginBtn]'
const newCourseBtnId = '[data-test=newCourseBtn]'
const courseNameId = '[data-test=courseName]'
const courseYearId = '[data-test=courseYear]'
const courseSemesterId = '[data-test=courseSemester]'
const courseTeacherId = '[data-test=courseTeacher]'
const courseStatusReadonlyId = '[data-test=courseStatus1]'
const courseSubmitId = '[data-test=courseSubmit]'
const fileInputId = '[data-test=fileInput]'
const submitFileBtnId = '[data-test=submitFileBtn]'
const manageMemberCardId = '[data-test=manageMemberCard]'

const courseName = `e2e_${+new Date()}`

describe('Create Course', () => {
  const select = (element, selectItem) => {
    cy.get(element)
      .parent()
      .click()
    cy.get('.v-menu__content')
      .contains(selectItem)
      .click()
  }

  beforeEach(() => {
    cy.visit('/courses')
    select(schoolId, '無')
    cy.get(usernameId).type('tcchiang')
    cy.get(passwordId).type('tcchiang')
    cy.get(loginBtnId).click()
  })

  it('lets tcc create readonly course.', () => {
    cy.get(newCourseBtnId).click()
    cy.contains('除教師無法更改外，其他資訊可在日後修改。')
    cy.get(courseNameId).type(courseName)
    select(courseYearId, '109')
    select(courseSemesterId, '2')
    cy.get(courseTeacherId).should('have.value', 'tcchiang')
    cy.get(courseStatusReadonlyId).click()
    cy.get(courseSubmitId).click()
    cy.contains('新增課程成功。')
    cy.contains('除教師無法更改外，其他資訊可在日後修改。').should('not.visible')
    cy.contains(courseName)
    cy.contains('109-2')
    cy.contains('公開課程')
    cy.contains('tcchiang')
  })

  it('lets tcc add students by csv.', () => {
    cy.contains(courseName)
      .parent()
      .click()
    cy.wait(500)
    cy.contains('總覽').click()
    cy.contains('新增學生').click()
    cy.contains('批量新增學生')
    cy.get(fileInputId).attachFile('test.csv')
    cy.get(submitFileBtnId).click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
    cy.contains('確認').click()
    cy.contains('新增學生成功。')
    cy.contains('管理').click()
    cy.get(manageMemberCardId).click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
  })
})
