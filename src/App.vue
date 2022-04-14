<template>
  <v-app>
    <Header @logout="handleLogout" />
    <v-main>
      <transition name="fade">
        <router-view />
      </transition>
    </v-main>
    <Notification />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import { ActionTypes } from './store/action-types'

export default Vue.extend({
  name: 'App',

  created() {
    this.getJwt()
  },

  methods: {
    ...mapActions({
      getJwt: ActionTypes.GET_JWT,
      logout: ActionTypes.LOGOUT,
    }),
    async handleLogout() {
      try {
        await this.logout()
        if (this.$route.name === 'login') {
          this.$router.go(0)
        } else {
          this.$router.replace({ name: 'login' })
        }
      } catch (error) {
        this.$rollbar.error('[App/logout]', error)
      }
    },
  },
})
</script>

<style></style>
