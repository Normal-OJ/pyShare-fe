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
import Header from '@/components/UI/Header.vue'
import Notification from '@/components/UI/Notification.vue'
import { mapActions } from 'vuex'
import { ActionTypes } from './store/action-types'

export default Vue.extend({
  name: 'App',

  components: { Header, Notification },

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
        if (this.$route.name === 'home') {
          this.$router.go(0)
        } else {
          this.$router.replace({ name: 'home' })
        }
      } catch (error) {
        this.$rollbar.error('[App/logout]', error)
      }
    },
  },
})
</script>

<style></style>
