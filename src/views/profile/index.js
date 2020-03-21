import Vue from 'vue';
import html from './index.pug';
// import Vuex file ...

export default Vue.extend({
  template: html,
  
  data () {
    return {
      user: {
        username: 'Username',
        displayName: 'Diaplay Name',
        likes: 'LIKES',
      },
      form: true,
      errType: undefined,
      errAlert: false,
      errMsg: '',
      passwd: {
        new: '',
        old: '',
      },
    }
  },

  ready () {
  },

  methods: {
  	submit() {
      if ( this.$refs.form.validate() ) {
        // this.$http.post(`${API_BASE_URL}/auth/change-password`, this.passwd)
          // .then((res) => {
            // this.errMsg = '密碼更改成功';
            // this.errType = 'success';
            // this.errAlert = true;
            // console.log(res);
          // })
          // .catch((err) => {
            this.errMsg = '密碼更改失敗，原密碼錯誤。';
            this.errType = 'error';
            this.errAlert = true;
            // console.log(err);
          // })
      }
    }
  },
});