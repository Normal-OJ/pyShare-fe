<template>
  <v-app-bar app color="primary" height="56" elevate-on-scroll>
    <v-btn text class="text-body-1 text-none py-0 px-1 mr-2" :to="{ name: 'home' }" color="primary">
      <v-img class="mr-2" :src="logoImgSource" max-width="32" />
      <v-toolbar-title class="white--text font-weight-medium">
        Python 創作分享平台
      </v-toolbar-title>
    </v-btn>

    <v-toolbar-items>
      <template v-for="{ label, routeName } in headerNavs">
        <v-btn
          :key="label"
          :to="{ name: routeName }"
          class="text-body-1 font-weight-medium"
          dark
          text
        >
          {{ label }}
        </v-btn>
      </template>
    </v-toolbar-items>

    <v-spacer />

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

    <v-menu offset-y v-if="isLogin">
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          class="text-body-1 font-weight-medium text-none"
          color="white"
          text
          v-bind="attrs"
          v-on="on"
          data-test="logoutMenu"
        >
          <Gravatar class="mr-2" :size="24" :md5="md5" />
          {{ displayName }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item link :to="{ name: 'profile', params: { id } }">
          <v-list-item-title class="text-center">個人頁面</v-list-item-title>
        </v-list-item>
        <v-list-item link @click="handleLogout" data-test="logoutBtn">
          <v-list-item-title class="text-center">登出</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <v-btn
      v-else
      :to="{ name: 'login' }"
      class="text-body-1 font-weight-medium"
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
import logoImg from '@/assets/images/logo.png'
import Popup from './Popup'
import Gravatar from './Gravatar.vue'
import { ROLE } from '@/constants/auth'
import { mapState } from 'vuex'

const navs = [
  {
    label: '課程',
    routeName: 'courses',
  },
  {
    label: '公開資料集',
    routeName: 'datasets',
    authorizedRole: [ROLE.ADMIN, ROLE.TEACHER, ROLE.STUDENT],
  },
  {
    label: '管理員介面',
    routeName: 'admin',
    authorizedRole: [ROLE.ADMIN],
  },
  {
    label: '關於平台',
    routeName: 'about',
  },
]

export default {
  name: 'Header',

  components: { Popup, Gravatar },

  computed: {
    ...mapState({
      isLogin: state => state.auth.isAuthenticated,
      id: state => state.auth.id,
      role: state => state.auth.role,
      displayName: state => state.auth.displayName,
      isShowLogoutModal: state => state.auth.isShowLogoutModal,
      md5: state => state.auth.md5,
    }),
    headerNavs() {
      return navs.filter(nav => {
        if (nav.authorizedRole && !nav.authorizedRole.includes(this.role)) return false
        return true
      })
    },
    logoImgSource() {
      return logoImg
    },
  },

  methods: {
    handleClosePopup() {
      this.$emit('logout')
    },
    handleLogout() {
      if (confirm('確認是否要登出？')) {
        this.$emit('logout')
      }
    },
  },
}
</script>
