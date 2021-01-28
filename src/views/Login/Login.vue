<template>
  <v-container fluid class="d-flex flex-column align-center login">
    <div class="text-h3">
      歡迎回來，請先登入
    </div>
    <LoginForm
      :isWaiting="isWaiting"
      :errorMsg="errorMsg"
      @submit="handleSubmit"
      @clear-error-msg="() => (errorMsg = '')"
    />
    <!-- <NoAccount color="primary" /> -->
  </v-container>
</template>

<script>
import NoAccount from '@/components/Login/NoAccount'
import LoginForm from '@/components/Login/LoginForm'
import agent from '@/api/agent'
import { mapMutations, mapState } from 'vuex'
import { SET_AUTH } from '@/store/mutations.type'

export default {
  name: 'Login',

  // eslint-disable-next-line vue/no-unused-components
  components: { NoAccount, LoginForm },

  data: () => ({
    isWaiting: false,
    errorMsg: '',
  }),

  computed: {
    ...mapState({
      username: state => state.auth.username,
    }),
  },

  methods: {
    async handleSubmit(body) {
      try {
        this.isWaiting = true
        await agent.Auth.login(body)
        this.setAuth()
        this.$alertSuccess('登入成功')
        const { redirectToPath } = this.$route.query
        if (redirectToPath === '/profile') {
          this.$router.push({ name: 'profile', params: { username: this.username } })
        } else {
          this.$router.push(redirectToPath ? { path: redirectToPath } : { name: 'courses' })
        }
        this.isWaiting = false
      } catch (error) {
        switch (error.message) {
          case 'Login Failed':
            this.errorMsg = '登入失敗：使用者名稱或密碼有誤'
            break
          default:
            this.errorMsg = '登入失敗：系統異常，請洽管理員'
        }
        this.isWaiting = false
        throw error
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
