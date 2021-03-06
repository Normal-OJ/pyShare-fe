<template>
  <v-container class="pb-16">
    <div class="d-flex justify-center mt-4">
      <v-avatar class="mr-2" size="120" color="primary">
        <span class="white--text text-h3" v-if="displayName">{{ displayName.slice(0, 1) }}</span>
      </v-avatar>
    </div>
    <div class="text-h5">基本資訊</div>
    <Spinner v-if="!username || !displayName" />
    <div v-else class="mt-4">
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr v-if="$isSelf(username)">
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
    <div class="d-flex align-center mt-8">
      <div class="text-h5">統計</div>
      <v-spacer />
      <v-btn color="primary" outlined :to="{ name: 'profileStats', params: { id } }" replace>
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
        <div class="font-weight-thin text-h1">{{ totalLikedAmount }}</div>
      </div>
    </div>
    <div class="text-h5 mt-8" v-if="$isSelf(username)">更改密碼</div>
    <v-form ref="form" class="mt-4" v-if="$isSelf(username)">
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
      <v-btn color="primary" :loading="isLoading" @click="submitNewPassword">
        送出
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import Spinner from '@/components/UI/Spinner'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    displayName: {
      type: String,
    },
    stats: {
      type: Object,
    },
  },

  components: { Spinner },

  data: () => ({
    isLoading: false,
    passwordInfo: {
      oldPassword: '',
      newPassword: '',
    },
    isShowPassword: false,
    isShowNewPassword: false,
    isShowConfirmPasssword: false,
  }),

  computed: {
    totalLikedAmount() {
      if (!this.stats) return ''
      return this.stats.liked.reduce((a, b) => {
        return a + b.starers.length
      }, 0)
    },
  },

  methods: {
    submitNewPassword() {
      if (this.$refs.form.validate()) {
        this.isLoading = true
        new Promise((resolve, reject) =>
          this.$emit('submit-new-password', this.passwordInfo, resolve, reject),
        )
          .then(() => {
            this.$alertSuccess('更改密碼成功。')
          })
          .catch(() => {
            this.$alertFail('更改密碼失敗。')
          })
          .finally(() => {
            this.isLoading = false
          })
      }
    },
  },
}
</script>
