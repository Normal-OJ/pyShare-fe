<template>
  <v-container class="pb-16">
    <div class="d-flex justify-center mt-4">
      <v-avatar class="mr-2" size="120" color="primary">
        <span class="white--text text-h3">{{ displayName.slice(0, 1) }}</span>
      </v-avatar>
    </div>
    <div class="text-h5">基本資訊</div>
    <div class="mt-4">
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="font-weight-bold">使用者名稱</td>
              <td style="width: 70%">{{ username }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">顯示名稱</td>
              <td style="width: 70%">{{ displayName }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div class="d-flex align-center mt-4">
      <div class="text-h5">統計</div>
      <v-spacer />
      <v-btn color="primary" outlined :to="{ name: 'profileStats', params: { username } }">
        查看詳細統計
      </v-btn>
    </div>
    <Spinner v-if="!stats" />
    <div v-else class="mt-4 d-flex justify-space-around flex-wrap">
      <div class="d-flex flex-column align-center">
        <div class="text-h6">累積主題</div>
        <div class="font-weight-thin text-h1">{{ stats.problems.length }}</div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">累積創作</div>
        <div class="font-weight-thin text-h1">{{ stats.comments.length }}</div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">獲得愛心</div>
        <div class="font-weight-thin text-h1">{{ stats.likes.length }}</div>
      </div>
    </div>
    <div class="text-h5 mt-4" v-if="$isSelf(username)">更改密碼</div>
    <v-form ref="form" v-if="$isSelf(username)">
      <v-row>
        <v-col cols="auto" lg="4">
          <v-text-field
            class="mx-1"
            label="請輸入原密碼"
            outlined="outlined"
            v-model="passwordInfo.oldPassword"
            :rules="[v => !!v || '請輸入原密碼！']"
            :type="isShowPassword ? 'text' : 'password'"
            :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="isShowPassword = !isShowPassword"
          />
        </v-col>
        <v-col cols="auto" lg="4">
          <v-text-field
            class="mx-1"
            label="請輸入新密碼"
            outlined="outlined"
            v-model="passwordInfo.newPassword"
            :rules="[v => !!v || '請輸入欲設置的新密碼！']"
            :type="isShowNewPassword ? 'text' : 'password'"
            :append-icon="isShowNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="isShowNewPassword = !isShowNewPassword"
          />
        </v-col>
        <v-col cols="auto" lg="4">
          <v-text-field
            class="mx-1"
            label="請再次輸入新密碼"
            :rules="[v => (!!v && v === passwordInfo.newPassword) || '確認密碼與新密碼不相符。']"
            outlined="outlined"
            :type="isShowConfirmPasssword ? 'text' : 'password'"
            :append-icon="isShowConfirmPasssword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="isShowConfirmPasssword = !isShowConfirmPasssword"
          />
        </v-col>
      </v-row>
      <v-btn color="primary" :loading="loading" @click="submitNewPassword">
        送出
      </v-btn>
    </v-form>
    <v-snackbar v-model="snackbar.value" :color="snackbar.color" :timeout="3500">
      {{ snackbar.text }}
    </v-snackbar>
  </v-container>
</template>

<script>
import Spinner from '@/components/UI/Spinner'

export default {
  props: {
    username: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
    },
    stats: {
      type: Object,
    },
    snackbar: {
      type: Object,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  components: { Spinner },

  data: () => ({
    passwordInfo: {
      oldPassword: '',
      newPassword: '',
    },
    isShowPassword: false,
    isShowNewPassword: false,
    isShowConfirmPasssword: false,
  }),

  methods: {
    submitNewPassword() {
      if (this.$refs.form.validate()) {
        this.$emit('submit-new-password', this.passwordInfo)
      }
    },
  },
}
</script>
