<template>
  <v-app>
    <Header
      :isLogin="isLogin"
      :username="username"
      :displayName="displayName"
      :isShowLogoutModal="isShowLogoutModal"
      @logout="handleLogout"
    />
    <v-main>
      <router-view />
    </v-main>
    <Notification />
  </v-app>
</template>

<script>
import Header from '@/components/UI/Header'
import Notification from '@/components/UI/Notification'
import { mapState, mapActions } from 'vuex'
import { LOGOUT } from '@/store/actions.type'

export default {
  name: 'App',

  components: { Header, Notification },

  computed: {
    ...mapState({
      isLogin: state => state.auth.isAuthenticated,
      username: state => state.auth.username,
      displayName: state => state.auth.displayName,
      isShowLogoutModal: state => state.auth.isShowLogoutModal,
    }),
  },

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
