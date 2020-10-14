<template>
  <v-container fluid class="d-flex flex-column align-center banner">
    <div class="text-h2 mb-6">
      歡迎來到 Python 創作分享平台
    </div>
    <div class="text-h5 mb-13">
      利用 Python 實作資料科學，發表主題與創作，一起在分享中學習
    </div>
    <v-btn class="mb-7" color="secondary" width="140" :to="'login'">
      前往登入
    </v-btn>
    <NoAccount color="white" />
  </v-container>
</template>

<script>
import NoAccount from '@/components/Login/NoAccount'

export default {
  name: 'Home',

  components: { NoAccount },

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
</style>
