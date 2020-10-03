<template>
  <v-container fluid class="banner">
    <div class="text-h2 mb-6">
      歡迎來到 Python 創作分享平台
    </div>
    <div class="text-h5 mb-13">
      利用 Python 實做資料科學，發表主題與創作，一起在分享中學習
    </div>
    <v-btn color="secondary" width="140">
      登入
    </v-btn>
    <div class="text-body-1 mt-4 no-account">
      沒有帳號嗎?
      <a class="no-account-link" href="#">以訪客身份登入</a>
      <v-tooltip bottom>
        <template v-slot:activator="{ on, attrs }">
          <v-icon v-bind="attrs" v-on="on" color="white">
            mdi-help-circle-outline
          </v-icon>
        </template>
        <span
          >以訪客身份登入，您可以瀏覽所有公開的課程與主題創作，但僅供檢視。</span
        >
      </v-tooltip>
    </div>
  </v-container>
</template>

<script>
export default {
  name: 'Home',

  data: () => ({}),
}
</script>

<style scoped>
.banner {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  background-color: var(--v-primary-base);
  padding-top: 110px;
  padding-bottom: 110px;
}
.no-account {
  display: flex;
}
.no-account-link {
  color: white;
  margin-left: 8px;
  margin-right: 8px;
}
</style>
