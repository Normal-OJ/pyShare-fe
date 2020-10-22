<template>
  <v-container fluid class="d-flex flex-column align-center banner">
    <div class="text-h2 mb-6 thin-font">
      歡迎來到 Python 創作分享平台
    </div>
    <div class="text-h5 mb-13">
      利用 Python 實作資料科學，發表主題與創作，一起在分享中學習
    </div>
    <div v-if="isLogin" class="mt-4 d-flex flex-column align-center">
      <div class="mb-7 text-h6">您已登入，開始分享創作吧！</div>
      <v-img :src="require('@/assets/images/freelancer.svg')" />
    </div>
    <v-btn v-else class="mb-7" color="secondary" width="140" :to="'login'">
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
  padding-bottom: 166px;
}

.thin-font {
  font-family: 'Noto Sans TC' !important;
  font-weight: 300;
}
</style>
