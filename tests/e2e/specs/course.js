const newCourseBtnId = '[data-test=newCourseBtn]'
const courseNameId = '[data-test=courseName]'
const courseYearId = '[data-test=courseYear]'
const courseSemesterId = '[data-test=courseSemester]'
const courseStatusReadonlyId = '[data-test=courseStatus1]'
const courseSubmitId = '[data-test=courseSubmit]'
const fileInputId = '[data-test=fileInput]'
const submitFileBtnId = '[data-test=submitFileBtn]'
const manageMemberCardId = '[data-test=manageMemberCard]'
const removeStudentBtnId = '[data-test=removeStudentBtn]'
const confirmDeleteInputId = '[data-test=confirmDeleteInput]'
const confirmDeleteBtnId = '[data-test=confirmDeleteBtn]'

const courseName = `e2e_${+new Date()}`

describe('Course', () => {
  const deleteCourse = async id => {
    await cy.request({
      url: `http://localhost:8080/api/course/${id}`,
      method: 'DELETE',
    })
  }

  beforeEach(() => {
    cy.visit('/')
    cy.login({
      school: '',
      username: 'tcchiang',
      password: 'tcchiang',
    })
    cy.visit('/courses')
  })

  after(() => {
    cy.location('pathname').then(pathname => {
      deleteCourse(pathname.split('/')[2])
    })
    cy.visit('/courses')
    cy.get('tr > td')
      .contains(courseName)
      .should('not.exist')
  })

  it('lets tcc create readonly course.', () => {
    cy.get(newCourseBtnId).click()
    cy.contains('課程資訊可在日後修改。')
    cy.get(courseNameId).type(courseName)
    cy.vuetifyMenuSelect(courseYearId, '109')
    cy.vuetifyMenuSelect(courseSemesterId, '2')
    cy.get(courseStatusReadonlyId).click()
    cy.get(courseSubmitId).click()
    cy.contains('新增課程成功。')
    cy.contains('課程資訊可在日後修改。').should('not.visible')
    cy.contains(courseName)
    cy.contains('109-2')
    cy.contains('公開課程')
    cy.contains('tcchiang')
  })

  it('lets tcc add students by csv from Info panel.', () => {
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

  it('lets tcc remove students.', () => {
    cy.contains(courseName)
      .parent()
      .click()
    cy.wait(500)
    cy.contains('管理').click()
    cy.get(manageMemberCardId).click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
    cy.get('td > .v-data-table__checkbox').click({ multiple: true })
    cy.get(removeStudentBtnId).click()
    cy.contains('請注意以下成員創作的主題、創作、留言將會一併移除')
    cy.contains('tcc_stu_1 (測試1)')
    cy.contains('tcc_stu_2 (測試2)')
    cy.contains(`在此輸入課程名稱：${courseName} 以執行刪除`)
    cy.get(confirmDeleteBtnId).should('be.disabled')
    cy.get(confirmDeleteInputId).type('helloworld')
    cy.get(confirmDeleteBtnId).should('be.disabled')
    cy.get(confirmDeleteInputId).clear()
    cy.get(confirmDeleteInputId).type(courseName)
    cy.get(confirmDeleteBtnId).should('not.be.disabled')
    cy.get(confirmDeleteBtnId).click()
    cy.contains('移除學生成功。')
    cy.contains('這裡還沒有任何成員，或找不到符合條件的成員')
  })

  it('lets tcc add students by csv from ManageStudent panel.', () => {
    cy.contains(courseName)
      .parent()
      .click()
    cy.wait(500)
    cy.contains('管理').click()
    cy.get(manageMemberCardId).click()
    cy.contains('這裡還沒有任何成員，或找不到符合條件的成員')
    cy.contains('新增學生').click()
    cy.contains('批量新增學生')
    cy.get(fileInputId).attachFile('test.csv')
    cy.get(submitFileBtnId).click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
    cy.contains('確認').click()
    cy.contains('新增學生成功。')
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
  })
})
