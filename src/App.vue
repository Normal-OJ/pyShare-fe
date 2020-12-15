<template>
  <v-app>
    <Header @logout="handleLogout" />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script>
import Header from '@/components/Header'
import { mapActions } from 'vuex'
import { LOGOUT } from '@/store/actions.type'

export default {
  name: 'App',

  components: { Header },

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
