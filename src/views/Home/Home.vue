<template>
  <v-container
    fluid
    class="d-flex flex-column align-center"
  >
    <v-row
      :style="{ padding: $vuetify.breakpoint.mdAndUp ? '90px 66px' : '30px 10px', width: '100%' }"
    >
      <v-col
        cols="12"
        md="6"
      >
        <div
          :class="[$vuetify.breakpoint.lgAndUp ? 'text-h2' : 'text-h3', 'font-weight-medium']"
          :style="{ lineHeight: $vuetify.breakpoint.lgAndUp ? '72px' : '52px' }"
        >
          歡迎來到<br>
          Python 創作分享平台
        </div>
        <div
          :class="[$vuetify.breakpoint.lgAndUp ? 'text-h5 mt-12' : 'text-h6 mt-8']"
          style="line-height: 36px"
        >
          利用 Python 實作資料分析應用<br>
          發表主題與創作，一起在分享中學習
        </div>
        <div
          v-if="isLogin"
          class="d-flex flex-column"
          :style="{ marginTop: $vuetify.breakpoint.lgAndUp ? '88px' : '48px' }"
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
      </v-col>
      <v-col
        cols="12"
        md="6"
      >
        <v-img
          :src="require('@/assets/images/cover.png')"
          style="width: 100%"
        />
      </v-col>
    </v-row>

    <v-row style="width: 100%">
      <v-divider class="mt-4 mb-16" />
    </v-row>

    <h2>
      三分鐘了解平台功能
    </h2>
    <v-row
      :style="{ padding: $vuetify.breakpoint.mdAndUp ? '66px' : '30px 10px', width: '100%' }"
      justify="center"
    >
      <iframe
        width="1424"
        :height="$vuetify.breakpoint.mdAndUp ? '595' : '300'"
        src="https://www.youtube.com/embed/Qm7WqnfuIg0"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      />
    </v-row>
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
