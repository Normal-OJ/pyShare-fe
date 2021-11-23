<template>
  <Profile v-if="!notFound" :id="$route.params.id" :user="user" :stats="stats" />
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

export default {
  components: { Profile },

  data: () => ({
    notFound: false,
    stats: null,
    user: {
      username: null,
      displayName: null,
      school: null,
      email: null,
    },
  }),

  watch: {
    '$route.params.id': {
      handler() {
        this.getUser(this.$route.params.id)
        this.getStats(this.$route.params.id)
      },
      immediate: true,
    },
  },

  methods: {
    async getUser(id) {
      try {
        const { data } = await this.$agent.User.get(id)
        this.user = data.data
      } catch (error) {
        this.notFound = true
        console.log('[views/Profile/getUser] error', error)
        this.$rollbar.error('Failed to getUser!', error)
      }
    },
    async getStats(id) {
      try {
        const { data } = await this.$agent.User.getStats(id)
        this.stats = data.data
      } catch (error) {
        console.log('[views/Profile/getStats] error', error)
        this.$rollbar.error('Failed to getStats!', error)
      }
    },
  },
}
</script>
