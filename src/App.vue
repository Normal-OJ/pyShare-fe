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

<script>
import Header from '@/components/UI/Header'
import Notification from '@/components/UI/Notification'
import { mapActions } from 'vuex'
import { ActionTypes } from './store/action-types'

export default {
  name: 'App',

  components: { Header, Notification },

  async created() {
    await this.getJwt()
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
        console.log('[App/logout] error', error)
        throw error
      }
    },
  },
}
</script>

<style>
a {
  text-decoration-line: none;
  color: var(--v-primary-base);
}
.display-amount {
  font-family: 'Montserrat';
  font-size: 6rem;
  line-height: 6rem;
}
</style>
