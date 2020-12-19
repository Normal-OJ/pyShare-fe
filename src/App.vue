<template>
  <v-app>
    <Header @logout="handleLogout" />
    <v-main>
      <router-view />
    </v-main>
    <Notification />
  </v-app>
</template>

<script>
import Header from '@/components/UI/Header'
import Notification from '@/components/UI/Notification'
import { mapActions } from 'vuex'
import { LOGOUT } from '@/store/actions.type'

export default {
  name: 'App',

  components: { Header, Notification },

  methods: {
    ...mapActions({
      logout: LOGOUT,
    }),
    async handleLogout() {
      try {
        this.logout()
        if (this.$route.name !== 'home') this.$router.push({ name: 'home' })
      } catch (error) {
        console.log('[App/logout] error', error)
        throw error
      }
    },
  },
}
</script>
