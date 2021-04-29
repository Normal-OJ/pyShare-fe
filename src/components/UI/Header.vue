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
        v-for="{ label, route, role } in headerItems"
        :key="label"
        :to="route"
        v-role="role || []"
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
          data-test="logoutMenu"
        >
          {{ displayName }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item link @click="$emit('logout')" data-test="logoutBtn">
          <v-list-item-title class="text-center">登出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      v-else
      :to="{ name: 'login' }"
      class="text-body-1 font-weight-bold"
      dark
      text
      data-test="loginBtn"
    >
      登入
    </v-btn>
    <Popup
      :isShow="isShowLogoutModal"
      title="連線階段已過期，請再次登入"
      @click="handleClosePopup"
    />
  </v-app-bar>
</template>

<script>
import Popup from './Popup'
import { ROLE } from '@/constants/auth'

export default {
  name: 'Header',

  props: {
    isLogin: {
      type: Boolean,
      required: true,
    },
    id: {
      type: String,
    },
    displayName: {
      type: String,
    },
    isShowLogoutModal: {
      type: Boolean,
      required: true,
    },
  },

  components: { Popup },

  computed: {
    headerItems() {
      return [
        {
          label: '課程',
          route: { path: '/courses' },
        },
        {
          label: '共享資料集',
          route: { path: '/datasets' },
          role: [ROLE.ADMIN, ROLE.TEACHER],
        },
        {
          label: '個人頁面',
          route: this.isLogin ? { name: 'profile', params: { id: this.id } } : { path: '/profile' },
        },
        {
          label: '關於平台',
          route: { path: '/about' },
        },
      ]
    },
  },

  methods: {
    handleClosePopup() {
      this.$emit('logout')
    },
  },
}
</script>
