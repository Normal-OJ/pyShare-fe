// TODO: separate tests
const newCourseBtnId = '[data-test=newCourseBtn]'
const courseNameId = '[data-test=courseName]'
const courseYearId = '[data-test=courseYear]'
const courseSemesterId = '[data-test=courseSemester]'
const courseSubmitId = '[data-test=courseSubmit]'
const fileInputId = '[data-test=fileInput]'
const submitFileBtnId = '[data-test=submitFileBtn]'
const manageMemberCardId = '[data-test=manageMemberCard]'
const removeStudentBtnId = '[data-test=removeStudentBtn]'
const confirmDeleteInputId = '[data-test=confirmDeleteInput]'
const confirmDeleteBtnId = '[data-test=confirmDeleteBtn]'
// TODO: setup a DB in frontend to manage these pre-defined resourse
const publicCourse = {
  description: 'public course',
  name: 'e2e_course_public',
  status: '開放課程',
  statusCardId: '[data-test=courseStatus2]',
}
const readonlyCourse = {
  description: 'readonly course',
  name: 'e2e_course_readonly',
  status: '公開課程',
  statusCardId: '[data-test=courseStatus1]',
}
const privateCourse = {
  description: 'private course',
  name: 'e2e_course_private',
  status: '不公開課程',
  statusCardId: '[data-test=courseStatus0]',
}
const teacher = {
  school: '',
  username: 'tcchiang',
  password: 'tcchiang',
}

const createCourseWithCurrentUser = name => {
  return cy
    .window()
    .then(win => {
      const userId = win.__store__.state.auth.id
      return cy.createCourse({
        teacher: userId,
        name,
        year: 109,
        semester: 2,
        status: 1,
        description: '',
      })
    })
    .then(resp => resp.body.data.id)
}

describe('Create Course', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.login({
      school: '',
      username: 'tcchiang',
      password: 'tcchiang',
    })
    cy.visit('/courses')
  })

  afterEach(() => {
    cy.location('pathname').then(pathname => {
      cy.deleteCourse(pathname.split('/')[2])
    })
  })

  const testCreateCourse = courseInfo => {
    // create course
    cy.get(newCourseBtnId).click()
    cy.contains('課程資訊可在日後修改。')
    cy.get(courseNameId).type(courseInfo.name)
    cy.vuetifyMenuSelect(courseYearId, '109')
    cy.vuetifyMenuSelect(courseSemesterId, '2')
    cy.get(courseInfo.statusCardId).click()
    cy.get(courseSubmitId).click()

    // assert course is successfully created and appear in course list
    cy.contains('新增課程成功。')
    cy.contains('課程資訊可在日後修改。').should('not.visible')
    cy.contains(courseInfo.name)
    cy.contains('109-2')
    cy.contains(courseInfo.status)
    cy.contains('tcchiang')

    // access course
    cy.contains(courseInfo.name)
      .parent()
      .click()

    // visit course info panel and inspect the course info
    cy.contains('總覽').click()
    cy.contains(courseInfo.name)
    cy.contains('109-2')
    cy.contains(courseInfo.status)
    cy.contains('tcchiang')
  }

  ;[publicCourse, readonlyCourse, privateCourse].forEach(course => {
    it(`can create ${course.description}`, () => {
      testCreateCourse(course)
    })
  })
})

describe('Add Course Students', () => {
  let courseName, courseId

  beforeEach(() => {
    cy.visit('/')
    cy.login({ ...teacher })
    courseName = `e2e_${+new Date()}`
    createCourseWithCurrentUser(courseName).then(id => (courseId = id))
    cy.visit('/courses')
  })

  afterEach(() => {
    cy.deleteCourse(courseId)
  })

  it('can add students by csv from Info panel.', () => {
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

    // modal is close
    cy.contains('批量新增學生').should('not.visible')

    // added students appear in info member list
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')

    // added students appear in manage member list
    cy.contains('管理').click()
    cy.get(manageMemberCardId).click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
  })

  it('can add students by csv from ManageStudent panel.', () => {
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

    // added students appear in manage member list
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')

    // added students appear in info member list
    cy.contains('總覽').click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
  })
})

describe('Delete Course Students', () => {
  let courseName, courseId

  beforeEach(() => {
    cy.visit('/')
    cy.login({ ...teacher })
    courseName = `e2e_${+new Date()}`
    createCourseWithCurrentUser(courseName).then(id => (courseId = id))
    cy.visit('/courses')

    // TODO: should use request instead
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
  })

  afterEach(() => {
    cy.deleteCourse(courseId)
  })

  it('can remove all students.', () => {
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

    // type random word and assert is submit button enabled
    cy.get(confirmDeleteInputId).type('helloworld')
    cy.get(confirmDeleteBtnId).should('be.disabled')
    cy.get(confirmDeleteInputId).clear()

    // submit
    cy.get(confirmDeleteInputId).type(courseName)
    cy.get(confirmDeleteBtnId).should('not.be.disabled')
    cy.get(confirmDeleteBtnId).click()
    cy.contains('移除學生成功。')
    cy.contains('這裡還沒有任何成員，或找不到符合條件的成員')
  })

  it('can remove partial students.', () => {
    cy.contains(courseName)
      .parent()
      .click()
    cy.wait(500)
    cy.contains('管理').click()
    cy.get(manageMemberCardId).click()
    cy.contains('tcc_stu_1')
    cy.contains('tcc_stu_2')
    cy.get('tbody > tr:first-child > td > .v-data-table__checkbox').click()
    cy.get(removeStudentBtnId).click()
    cy.contains('請注意以下成員創作的主題、創作、留言將會一併移除')
    cy.contains('tcc_stu_1 (測試1)')
    cy.contains(`在此輸入課程名稱：${courseName} 以執行刪除`)
    cy.get(confirmDeleteBtnId).should('be.disabled')

    // submit
    cy.get(confirmDeleteInputId).type(courseName)
    cy.get(confirmDeleteBtnId).should('not.be.disabled')
    cy.get(confirmDeleteBtnId).click()
    cy.contains('移除學生成功。')
    cy.contains('tcc_stu_1').should('not.visible')
    cy.contains('tcc_stu_2')
  })
})
