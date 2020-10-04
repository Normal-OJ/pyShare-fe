<template>
  <v-container fluid class="d-flex flex-column align-center login">
    <div class="text-h3 mt-10">
      歡迎回來，請先登入
    </div>
    <LoginForm @submit="handleSubmit(payload)" />
    <NoAccount color="primary" />
  </v-container>
</template>

<script>
import NoAccount from '../../components/Login/NoAccount'
import LoginForm from '../../components/Login/LoginForm'

export default {
  name: 'Login',

  components: { NoAccount, LoginForm },

  methods: {
    handleSubmit() {
      // TODO
    },
  },
}
</script>

<style scoped>
.login {
  color: var(--v-primary-base);
  padding-top: 110px;
  padding-bottom: 166px;
}
</style>
