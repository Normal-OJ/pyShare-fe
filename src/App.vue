<template>
  <v-app>
    <Header
      :isLogin="isLogin"
      :id="id"
      :displayName="displayName"
      :isShowLogoutModal="isShowLogoutModal"
      @logout="handleLogout"
    />
    <v-main>
      <transition name="fade">
        <router-view />
      </transition>
    </v-main>
    <Notification />
  </v-app>
</template>

<script>
import Header from '@/components/UI/Header'
import Notification from '@/components/UI/Notification'
import { mapState, mapActions } from 'vuex'
import { ActionTypes } from './store/action-types'

export default {
  name: 'App',

  components: { Header, Notification },

  created() {
    this.getJwt()
  },

  computed: {
    ...mapState({
      isLogin: state => state.auth.isAuthenticated,
      id: state => state.auth.id,
      displayName: state => state.auth.displayName,
      isShowLogoutModal: state => state.auth.isShowLogoutModal,
    }),
  },

  methods: {
    ...mapActions({
      getJwt: ActionTypes.GET_JWT,
      logout: ActionTypes.LOGOUT,
    }),
    async handleLogout() {
      try {
        await this.logout()
        this.$router.replace({ name: 'home' })
      } catch (error) {
        console.log('[App/logout] error', error)
        throw error
      }
    },
  },
}
</script>
