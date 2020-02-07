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
    >{{ errMsg }}</v-alert>

    <v-text-field
      v-model="authData.username"
      label="Username / E-mail"
      prepend-icon="mdi-account"
      :rules="usernameRule"
      @keyup.enter="submit"
    ></v-text-field>

    <v-text-field
      v-model="authData.password"
      label="Password"
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
        >Sign in</v-btn>
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
      usernameRule: [val => !!val || 'Please enter your Username.'],
      passwordRule: [val => !!val || 'Please enter your Password.'],
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
        this.$http.post(`${API_BASE_URL}/auth/session`, this.authData)
          .then((response) => {
            // successful sign in
            // console.log(response);
            this.$emit('signin');
          })
          .catch((error) => {
            this.errMsg = 'Login Fail';
            this.errAlert = true;
          });
      }
    },
  }
}
</script>

<style lang="css" scoped>
</style>