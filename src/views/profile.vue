<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <v-card height="100%" elevation="12">
      <v-card-title>個人頁面</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-card-text class="text--primary">
        <v-row>
          <v-col cols="auto" md="4">
            <v-icon>mdi-account</v-icon>使用者名稱：
          </v-col>
          <v-col cols="auto" md="8">Username</v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" md="4">
            <v-icon>mdi-account-badge</v-icon>暱稱（網頁顯示名稱）：
          </v-col>
          <v-col cols="auto" md="8">displayName</v-col>
        </v-row>
        <v-row>
          <v-col cols="auto" md="4">
            <v-icon>mdi-heart</v-icon>獲得愛心總數：
          </v-col>
          <v-col cols="auto" md="8">LIKES</v-col>
        </v-row>
      </v-card-text>

      <v-form v-model="form" ref="form">
        <v-card-title>更改密碼</v-card-title>
        <v-divider class="mt-0"></v-divider>
        <v-card-text>
          <v-alert
            v-model="errAlert"
            dense
            dismissible
            :type="errType"
            transition="slide-y-transition"
          >{{ errMsg }}</v-alert>
          <v-row>
            <v-text-field
              v-model="passwd.new"
              label="請輸入新密碼"
              class="mx-1"
              type="password"
              :rules="[v => !!v || '請輸入欲設置的新密碼！']"
              outlined
            ></v-text-field>
            <v-text-field
              label="請再次輸入新密碼"
              class="mx-1"
              type="password"
              :rules="[v => !!v && v===passwd.new || '確認密碼與新密碼不相符。']"
              outlined
            ></v-text-field>
            <v-text-field
              v-model="passwd.old"
              label="請輸入原密碼"
              type="password"
              :rules="[v => !!v || '請輸入原密碼！']"
              class="mx-1"
              outlined
            ></v-text-field>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn 
            block
            dark
            color="#4B8BBE"
            @click="submit"
          ><v-icon>mdi-send</v-icon>送出</v-btn>
        </v-card-actions>
      </v-form>
    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'profile',

  data () {
    return {
      form: true,
      errType: undefined,
      errAlert: false,
      errMsg: '',
      passwd: {
        new: '',
        old: '',
      },
    }
  },

  methods: {
    submit() {
      if ( this.$refs.form.validate() ) {
        // this.$http.post(`${API_BASE_URL}/auth/change-password`, this.passwd)
          // .then((res) => {
            // this.errMsg = '密碼更改成功';
            // this.errType = 'success';
            // this.errAlert = true;
            // console.log(res);
          // })
          // .catch((err) => {
            this.errMsg = '密碼更改失敗，原密碼錯誤。';
            this.errType = 'error';
            this.errAlert = true;
            // console.log(err);
          // })
      }
    }
  }
}
</script>

<style lang="css" scoped>
</style>