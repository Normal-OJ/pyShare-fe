<template>
  <v-app-bar
    app
    color="primary"
    height="56"
    elevate-on-scroll
  >
    <v-btn
      text
      class="text-body-1 text-none py-0 px-1 mr-2"
      :to="{ name: 'home' }"
      color="primary"
    >
      <v-img
        class="mr-2"
        :src="logoImgSource"
        max-width="32"
      />
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

    <v-menu
      v-if="isLogin"
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="text-body-1"
          icon
          v-bind="attrs"
          v-on="on"
        >
          <v-badge
            color="error"
            :value="md5 === EMPTY_EMAIL"
            offset-x="12"
            offset-y="12"
            content="1"
          >
            <v-icon color="white">
              mdi-bell
            </v-icon>
          </v-badge>
        </v-btn>
      </template>
      <v-card
        width="400"
        class="d-flex flex-column pa-5"
      >
        <div class="text-h5 font-weight-medium mb-5">
          <v-icon
            class="mr-1"
            size="32"
          >
            mdi-email
          </v-icon>
          請設定電子信箱
        </div>
        <div>
          <div class="mb-5">
            以利於忘記密碼時使用信箱復原密碼
          </div>
          <a :href="`/profile/${id}`">➡️ 前往設定</a>
        </div>
      </v-card>
    </v-menu>

    <v-menu
      v-if="isLogin"
      offset-y
    >
      <template #activator="{ on, attrs }">
        <v-btn
          class="text-body-1 font-weight-medium text-none"
          color="white"
          text
          v-bind="attrs"
          data-test="logoutMenu"
          v-on="on"
        >
          <Gravatar
            class="mr-2"
            :size="24"
            :md5="md5"
          />
          {{ displayName }}
        </v-btn>
      </template>
      <v-list>
        <v-list-item :to="{ name: 'profile', params: { id } }">
          <v-list-item-title class="text-center">
            個人頁面
          </v-list-item-title>
        </v-list-item>
        <v-list-item
          data-test="logoutBtn"
          @click="handleLogout"
        >
          <v-list-item-title class="text-center">
            登出
          </v-list-item-title>
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
      :is-show="isShowLogoutModal"
      title="連線階段已過期，請再次登入"
      @click="handleClosePopup"
    />
  </v-app-bar>
</template>

<script>
import logoImg from '@/assets/images/logo.png'
import { ROLE } from '@/constants/auth'
import { mapState } from 'vuex'

const navs = [
  {
    label: '課程',
    routeName: 'courses',
  },
  {
    label: '共享資源',
    routeName: 'datasets',
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
const EMPTY_EMAIL = 'd41d8cd98f00b204e9800998ecf8427e'

export default {
  name: 'Header',

  computed: {
    ...mapState({
      isLogin: (state) => state.auth.isAuthenticated,
      id: (state) => state.auth.id,
      role: (state) => state.auth.role,
      displayName: (state) => state.auth.displayName,
      isShowLogoutModal: (state) => state.auth.isShowLogoutModal,
      md5: (state) => state.auth.md5,
    }),
    headerNavs() {
      return navs.filter((nav) => {
        if (nav.authorizedRole && !nav.authorizedRole.includes(this.role)) return false
        return true
      })
    },
    logoImgSource() {
      return logoImg
    },
    EMPTY_EMAIL() {
      return EMPTY_EMAIL
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
