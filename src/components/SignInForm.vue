<template>
  <v-form
    v-model="validForm"
    ref="form"
  >
    <v-alert
      v-model="errAlert"
      dense
      dismissible
      type="error"
      transition="slide-y-transition"
    >{{ errMsg }}</v-alert>

    <v-text-field
      v-model="authData.username"
      label="使用者名稱或電子郵件地址"
      prepend-icon="mdi-account"
      :rules="usernameRule"
      @keyup.enter="submit"
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="密碼"
      prepend-icon="mdi-lock"
      :rules="passwordRule"
      :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
      :type="showPassword ? 'text' : 'password'"
      @click:append="showPassword = !showPassword"
      @keyup.enter="submit"
    ></v-text-field>

    <v-row>
      <v-spacer></v-spacer>
      <v-col cols="auto">
        <v-btn
          dark
          color="#4B8BBE"
          @click="submit"
        >登入</v-btn>
      </v-col>
    </v-row>

  </v-form>
</template>

<script>
const API_BASE_URL = '/api';

export default {

  name: 'SignInForm',

  data () {
    return {
      validForm: false,
      authData: {
        'username': '',
        'password': ''
      },
      usernameRule: [val => !!val || '請輸入您的使用者名稱或電子郵件地址！'],
      passwordRule: [val => !!val || '請輸入您的密碼！'],
      showPassword: false,
      errAlert: false,
      errMsg: '',
    }
  },

  beforeMount() {
    this.authData.username = '';
    this.authData.password = '';
  },

  methods: {
    submit() {
      if ( this.$refs.form.validate() ) {
        // this.$http.post(`${API_BASE_URL}/auth/session`, this.authData)
          // .then((response) => {
            // successful sign in
            // console.log(response);
            // this.$emit('signin');
          // })
          // .catch((error) => {
            this.errMsg = '登入失敗，請檢查資訊是否有誤。';
            this.errAlert = true;
          // });
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>