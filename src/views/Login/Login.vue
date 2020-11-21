<template>
  <v-container fluid class="d-flex flex-column align-center login">
    <div class="text-h1">
      歡迎回來，請先登入
    </div>
    <LoginForm @submit="handleSubmit" />
    <!-- <NoAccount color="primary" /> -->
  </v-container>
</template>

<script>
import NoAccount from '@/components/Login/NoAccount'
import LoginForm from '@/components/Login/LoginForm'
import agent from '@/api/agent'
import { mapMutations } from 'vuex'
import { SET_AUTH } from '@/store/mutations.type'

export default {
  name: 'Login',

  // eslint-disable-next-line vue/no-unused-components
  components: { NoAccount, LoginForm },

  methods: {
    async handleSubmit(body) {
      try {
        await agent.Auth.login(body)
        // TODO: give feedback for successfully login
        this.setAuth()
        const { redirect } = this.$route.query
        if (!redirect) {
          this.$router.push({ name: 'courses' })
        } else {
          this.$router.push({ path: redirect })
        }
      } catch (error) {
        // setError for login form
      }
    },
    ...mapMutations({
      setAuth: SET_AUTH,
    }),
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
