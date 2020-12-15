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
        v-for="{ label, route } in headerItems"
        :key="label"
        :to="route"
        class="text-body-1 font-weight-bold"
        color="white"
        text
      >
        {{ label }}
      </v-btn>
    </v-toolbar-items>

    <v-spacer />

    <!-- Notification -->
    <v-menu offset-y v-if="isLogin">
      <template v-slot:activator="{ on, attrs }">
        <v-btn class="text-body-1" icon v-bind="attrs" v-on="on">
          <v-icon color="white">mdi-bell</v-icon>
        </v-btn>
      </template>
      <v-card width="400" class="d-flex flex-column align-center py-5">
        <div class="text-h5 font-weight-black mb-5">🚧 功能建置中</div>
        <v-img :src="require('@/assets/images/underConstruction.svg')" max-width="300" contain />
      </v-card>
    </v-menu>

    <!-- Auth -->
    <v-menu offset-y v-if="isLogin">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="text-body-1 font-weight-bold text-none"
          color="white"
          text
          v-bind="attrs"
          v-on="on"
        >
          {{ displayName }}
        </v-btn>
      </template>
      <v-list>
        <!-- <v-list-item link :to="{ name: 'profile', params: { username: username } }">
          <v-list-item-title class="text-center">個人頁面</v-list-item-title>
        </v-list-item> -->
        <v-list-item link @click="$emit('logout')">
          <v-list-item-title class="text-center">登出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn v-else :to="{ name: 'login' }" class="text-body-1 font-weight-bold" dark text>
      登入
    </v-btn>
  </v-app-bar>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Header',

  computed: {
    ...mapState({
      isLogin: state => state.auth.isAuthenticated,
      username: state => state.auth.username,
      displayName: state => state.auth.displayName,
    }),
    headerItems() {
      return [
        {
          label: '課程',
          route: { name: 'courses' },
        },
        {
          label: '個人頁面',
          route: { name: 'profile', params: { username: this.username } },
        },
        {
          label: '關於平台',
          route: { name: 'about' },
        },
      ]
    },
  },
}
</script>
