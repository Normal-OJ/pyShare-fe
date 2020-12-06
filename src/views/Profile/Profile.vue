<template>
  <Profile
    v-if="!notFound"
    :username="username"
    :displayName="displayName"
    :stats="stats"
    :snackbar="snackbar"
    :loading="loading"
    @submit-new-password="submitNewPassword"
  />
  <div v-else class="d-flex flex-column align-center">
    <div class="text-h2 mt-16">
      查無此人 😢
    </div>
    <v-btn class="mt-10" color="primary" @click="$router.go(-1)">
      回上一頁
    </v-btn>
  </div>
</template>

<script>
import Profile from '@/components/Profile/Profile'
import agent from '@/api/agent'

export default {
  components: { Profile },

  data: () => ({
    notFound: false,
    stats: null,
    displayName: '',
    snackbarType: {
      success: {
        color: 'success',
        text: '更改密碼成功。',
      },
      fail: {
        color: 'error',
        text: '更改密碼失敗。',
      },
    },
    snackbar: {
      value: false,
      color: '',
      text: '',
    },
    loading: false,
  }),

  computed: {
    username() {
      return this.$route.params.username
    },
  },

  watch: {
    username: {
      handler() {
        this.getUser(this.username)
        this.getStats(this.username)
      },
      immediate: true,
    },
  },

  methods: {
    async getUser(username) {
      try {
        const { data } = await agent.User.getList()
        const user = data.data.find(user => user.username === username)
        if (!user) {
          this.notFound = true
          return
        }
        this.displayName = user.displayName
      } catch (error) {
        console.log('[views/Profile/getUser] error', error)
      }
    },
    async getStats(username) {
      try {
        const { data } = await agent.User.getStats(username)
        this.stats = data.data
      } catch (error) {
        console.log('[views/Profile/getStats] error', error)
      }
    },
    async submitNewPassword(passwordInfo) {
      this.loading = true
      try {
        await agent.Auth.changePassword(passwordInfo)
        this.snackbar = {
          value: true,
          ...this.snackbarType.success,
        }
      } catch (error) {
        console.log('[views/Profile/getStats] error', error)
        this.snackbar = {
          value: true,
          ...this.snackbarType.fail,
        }
      }
      this.loading = false
    },
  },
}
</script>
