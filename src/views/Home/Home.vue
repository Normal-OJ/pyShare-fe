<template>
  <v-container fluid class="d-flex flex-column align-center banner">
    <div class="text-h1 mb-6 font-weight-light">
      歡迎來到 Python 創作分享平台
    </div>
    <div class="text-h2 mb-13">
      利用 Python 實作資料科學，發表主題與創作，一起在分享中學習
    </div>
    <div v-if="isLogin" class="d-flex flex-column align-center">
      <div class="mb-7 text-subtitle-1">嗨&nbsp;{{ displayName }}，開始分享創作吧！</div>
      <v-img :src="require('@/assets/images/freelancer.svg')" />
    </div>
    <v-btn v-else class="my-7" color="secondary" width="140" :to="'login'">
      前往登入
    </v-btn>
    <!-- <NoAccount color="white" /> -->
  </v-container>
</template>

<script>
import NoAccount from '@/components/Login/NoAccount'
import { mapState } from 'vuex'

export default {
  name: 'Home',

  // eslint-disable-next-line vue/no-unused-components
  components: { NoAccount },

  computed: {
    ...mapState({
      isLogin: state => state.auth.isAuthenticated,
      displayName: state => state.auth.displayName,
    }),
  },

  data: () => ({}),
}
</script>

<style scoped>
.banner {
  color: white;
  background-color: var(--v-primary-base);
  padding-top: 110px;
  padding-bottom: 110px;
}
</style>
