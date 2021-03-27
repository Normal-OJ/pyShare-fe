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
const publicCourse = {
  name: 'e2e_course_public',
  status: '開放課程',
  statusCardId: '[data-test=courseStatus2]',
}
const readonlyCourse = {
  name: 'e2e_course_readonly',
  status: '公開課程',
  statusCardId: '[data-test=courseStatus1]',
}
const privateCourse = {
  name: 'e2e_course_private',
  status: '不公開課程',
  statusCardId: '[data-test=courseStatus0]',
}

const deleteCourseByRequest = name => {
  cy.request({
    url: `/api/course`,
    method: 'GET',
  })
    .then(resp => {
      const courseList = resp.body.data
      const id = courseList.find(c => c.name === name).id
      return cy.request({
        url: `/api/course/${id}`,
        method: 'DELETE',
      })
    })
    .then(() => {
      // Assert deleted course should not exist
      cy.visit('/courses')
      // ensure it is not loading
      cy.get('tr > td')
        .contains('讀取中')
        .should('not.exist')
      cy.get('tr > td')
        .contains(name)
        .should('not.exist')
    })
}

describe('Create Course', () => {
  let courseName

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
    deleteCourseByRequest(courseName)
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

  it('can create public course', () => {
    courseName = publicCourse.name
    testCreateCourse(publicCourse)
  })

  it('can create readonly course', () => {
    courseName = readonlyCourse.name
    testCreateCourse(readonlyCourse)
  })

  it('can create private course', () => {
    courseName = privateCourse.name
    testCreateCourse(privateCourse)
  })
})

describe('Add Course Students', () => {
  let courseName
  const teacher = {
    school: '',
    username: 'tcchiang',
    password: 'tcchiang',
  }

  beforeEach(() => {
    cy.visit('/')
    cy.login({ ...teacher })
    courseName = `e2e_${+new Date()}`
    cy.request({
      url: '/api/user',
      method: 'GET',
    })
      .then(resp => resp.body.data)
      .then(users => users.find(u => u.username === teacher.username))
      .then(user => user.id)
      .then(uid =>
        cy.createCourse({
          teacher: uid,
          name: courseName,
          year: 109,
          semester: 2,
          status: 1,
          description: '',
        }),
      )
    cy.visit('/courses')
  })

  afterEach(() => {
    deleteCourseByRequest(courseName)
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
  let courseName
  const teacher = {
    school: '',
    username: 'tcchiang',
    password: 'tcchiang',
  }

  beforeEach(() => {
    cy.visit('/')
    cy.login({ ...teacher })
    courseName = `e2e_${+new Date()}`
    cy.request({
      url: '/api/user',
      method: 'GET',
    })
      .then(resp => resp.body.data)
      .then(users => users.find(u => u.username === teacher.username))
      .then(user => user.id)
      .then(uid =>
        cy.createCourse({
          teacher: uid,
          name: courseName,
          year: 109,
          semester: 2,
          status: 1,
          description: '',
        }),
      )
    cy.visit('/courses')

    // add students, should use request instead
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
    deleteCourseByRequest(courseName)
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
