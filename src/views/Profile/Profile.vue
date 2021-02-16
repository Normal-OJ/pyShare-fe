<template>
  <Profile
    v-if="!notFound"
    :id="id"
    :username="username"
    :displayName="displayName"
    :stats="stats"
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
    username: null,
    displayName: null,
  }),

  computed: {
    id() {
      return this.$route.params.id
    },
  },

  watch: {
    id: {
      handler() {
        this.getUser(this.id)
        this.getStats(this.id)
      },
      immediate: true,
    },
  },

  methods: {
    async getUser(id) {
      try {
        const { data } = await agent.User.getList()
        const user = data.data.find(user => user.id === id)
        if (!user) {
          this.notFound = true
          return
        }
        this.username = user.username
        this.displayName = user.displayName
      } catch (error) {
        console.log('[views/Profile/getUser] error', error)
        throw error
      }
    },
    async getStats(id) {
      try {
        const { data } = await agent.User.getStats(id)
        this.stats = data.data
      } catch (error) {
        console.log('[views/Profile/getStats] error', error)
        throw error
      }
    },
    async submitNewPassword(passwordInfo, resolve, reject) {
      try {
        await agent.Auth.changePassword(passwordInfo)
        resolve()
      } catch (error) {
        console.log('[views/Profile/getStats] error', error)
        reject(error)
        throw error
      }
    },
  },
}
</script>
