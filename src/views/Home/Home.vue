<template>
  <v-container
    fluid
    class="d-flex flex-column align-center"
  >
    <div
      class="d-flex"
      style="padding: 90px 66px; width: 100%"
    >
      <div style="width: 50%">
        <div
          class="text-h2 font-weight-medium"
          style="line-height: 72px"
        >
          歡迎來到<br>
          Python 創作分享平台
        </div>
        <div
          class="text-h5 mt-12"
          style="line-height: 36px"
        >
          利用 Python 實作資料分析應用<br>
          發表主題與創作，一起在分享中學習
        </div>
        <div
          v-if="isLogin"
          class="d-flex flex-column"
          style="margin-top: 88px"
        >
          <div class="mb-4 text-body-1">
            嗨&nbsp;{{ displayName }}，開始分享創作吧！
          </div>
          <v-btn
            color="primary"
            depressed
            width="140"
            :to="'courses'"
          >
            進入課程
          </v-btn>
        </div>
        <div
          v-else
          class="d-flex flex-column"
          style="margin-top: 128px"
        >
          <v-btn
            color="primary"
            depressed
            width="140"
            :to="'login'"
          >
            前往登入
          </v-btn>
        </div>
      </div>
      <div style="width: 50%">
        <v-img
          :src="require('@/assets/images/cover.png')"
          style="width: 100%"
        />
      </div>
    </div>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',

  computed: {
    ...mapState({
      isLogin: (state) => state.auth.isAuthenticated,
      displayName: (state) => state.auth.displayName,
    }),
  },
}
</script>

<style scoped></style>
