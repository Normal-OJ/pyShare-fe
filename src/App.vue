<template>
  <v-app>
    <Header @logout="logout" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import agent from '@/api/agent'
import { mapActions } from 'vuex'
import { LOGOUT } from '@/store/actions.type'

export default {
  name: 'App',

  components: { Header },

  methods: {
    ...mapActions({
      clearAuth: LOGOUT,
    }),
    async logout() {
      try {
        await agent.Auth.logout()
        this.clearAuth()
        this.$router.push({ name: 'home' })
      } catch (error) {
        console.log('[App/logout] error', error)
      }
    },
  },
}
</script>
