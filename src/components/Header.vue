<template>
  <v-app-bar app color="primary" height="56" elevate-on-scroll>
    <v-btn text class="text-body-1 text-none py-0 px-1 mr-2" :to="{ name: 'home' }" color="primary">
      <v-img class="mr-2" :src="require('@/assets/images/logo.png')" max-width="32" />
      <v-toolbar-title style="color: white;" class="font-weight-bold">
        Python 創作分享平台
      </v-toolbar-title>
    </v-btn>

    <v-toolbar-items>
      <v-btn
        v-for="{ label, routeName } in headerItems"
        :key="label"
        :to="{ name: routeName }"
        class="text-body-1 font-weight-bold"
        color="white"
        text
      >
        {{ label }}
      </v-btn>
    </v-toolbar-items>

    <v-spacer />

    <v-btn class="text-body-1" icon>
      <v-icon color="white">mdi-bell</v-icon>
    </v-btn>
    <v-btn
      :to="isLogin ? { name: 'profile', params: { username } } : { name: 'login' }"
      class="text-body-1 font-weight-bold"
      color="white"
      text
    >
      {{ isLogin ? username : '登入' }}
    </v-btn>
  </v-app-bar>
</template>

<script>
import { HEADER_ITEMS } from '@/constants/header'
import { mapState } from 'vuex'

export default {
  name: 'Header',

  computed: {
    ...mapState({
      isLogin: state => state.auth.isAuthenticated,
      username: state => state.auth.username,
    }),
  },

  data: () => ({
    headerItems: HEADER_ITEMS,
  }),
}
</script>
