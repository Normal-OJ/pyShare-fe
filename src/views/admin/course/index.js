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
          role: 'Student',
          star: 5,
        },
        { 
          username: 'studentB',
          displayName: 'stB',
          role: 'Student',
          star: 500,
        },
        { 
          username: 'studentC',
          displayName: 'stC',
          role: 'Teacher',
          star: 5000,
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