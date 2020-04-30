import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
  template: html,
  
  data () {
    return {
      courses: [],
      course: '',
      newCourseDialog: false,
      newCourseName: '',
      newStudentDialog: false,
      newStudentFile: null,
      deleteStudentDialog: false,
      deleteStudentName: '',
      studentData: [
        { 
          username: 'studentA',
          displayName: 'stA',
          post: 2,
          comment: 2,
          reply: 2,
          starGive: 2,
          star: 2,
          success: 5,
          fail: 5,
          review: 0,
        },
        { 
          username: 'studentB',
          displayName: 'stB',
          post: 1,
          comment: 1,
          reply: 0,
          starGive: 10,
          star: 500,
          success: 17,
          fail: 30,
          review: 1,
        },
        { 
          username: 'studentC',
          displayName: 'stC',
          post: 0,
          comment: 5,
          reply: 15,
          starGive: 1,
          star: 5000,
          success: 1,
          fail: 2,
          review: 1,
        },
      ],
    }
  },

  methods: {
    createCourse(name) {

    },
    createStudent(file) {

    },
    deleteStudent(username) {

    },
  },
});