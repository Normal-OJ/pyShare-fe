import Vue from 'vue';
import html from './index.pug';
import { getProfile } from '@/util.js'
// import Vuex file ...

export default Vue.extend({
  template: html,
  
  data () {
    return {
      user: {
        username: '',
        displayName: '',
      },
      form: true,
      err: {
        type: 'info',
        active: false,
        msg: '',
      },
      passwd: {
        newPassword: '',
        oldPassword: '',
      },
    }
  },

  beforeMount() {
    this.user = getProfile();
  },

  methods: {
  	submit() {
      if ( this.$refs.form.validate() ) {
        this.$http.post('/auth/change-password', this.passwd)
          .then((res) => {
            this.err.msg = '密碼更改成功';
            this.err.type = 'success';
            this.err.active = true;
          })
          .catch((err) => {
            this.err.msg = '密碼更改失敗，原密碼錯誤。';
            this.err.type = 'error';
            this.err.active = true;
          })
      }
    }
  },
});