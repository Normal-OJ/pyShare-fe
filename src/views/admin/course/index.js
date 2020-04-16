import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
  template: html,
  
  data () {
    return {
      newCourseDialog: false,
      newStudentDialog: false,
      dialog: 0,
      items: [
        { 
          username: 'studentA',
          displayName: 'stA',
          post: 0,
          comment: 3,
          reply: 2,
          starGive: 20,
          star: 5,
          success: 11,
          fail: 3,
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
        },
      ],
      roles: ['Student', 'Teacher'],
    }
  },

  ready () {
  },

  methods: {
  },
});