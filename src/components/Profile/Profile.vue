<template>
  <v-container class="pb-16">
    <div class="d-flex flex-column align-center mt-4">
      <Gravatar
        :size="120"
        :md5="user.md5 || ''"
      />
      <div class="mt-2 text-body-2">
        若欲更改頭像，請至
        <span>
          <a
            href="https://en.gravatar.com/"
            target="_blank"
            rel="noopener noreferrer"
          >Gravatar</a>
        </span>
        網站使用與平台同樣的 email 進行設定
      </div>
    </div>
    <div class="text-h5">
      基本資訊
    </div>
    <Spinner v-if="!user.username || !user.displayName" />
    <div
      v-else
      class="mt-4"
    >
      <v-simple-table>
        <template #default>
          <tbody>
            <template v-if="$isSelf(user.username) || role === 0">
              <tr>
                <td class="font-weight-medium">
                  學校
                </td>
                <td style="width: 70%">
                  {{ school }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium">
                  使用者名稱
                </td>
                <td style="width: 70%">
                  {{ user.username }}
                </td>
              </tr>
              <tr>
                <td class="font-weight-medium">
                  Email
                </td>
                <td style="width: 70%">
                  {{ user.email }}
                </td>
              </tr>
            </template>
            <tr>
              <td class="font-weight-medium">
                顯示名稱
              </td>
              <td style="width: 70%">
                {{ user.displayName }}
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div class="d-flex align-center mt-8">
      <div class="text-h5">
        統計
      </div>
      <v-spacer />
      <v-btn
        color="primary"
        outlined
        :to="{ name: 'profileStats', params: { id } }"
        replace
      >
        查看詳細統計
      </v-btn>
    </div>
    <Spinner v-if="!stats" />
    <div
      v-else
      class="mt-4 d-flex justify-space-around flex-wrap"
    >
      <div class="d-flex flex-column align-center">
        <div class="text-h6">
          累積主題
        </div>
        <div class="ctext-amount">
          {{ stats.problems.length }}
        </div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">
          累積創作
        </div>
        <div class="ctext-amount">
          {{ stats.comments.length }}
        </div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">
          獲得愛心
        </div>
        <div class="ctext-amount">
          {{ totalLikedAmount }}
        </div>
      </div>
    </div>
    <div
      v-if="$isSelf(user.username)"
      class="text-h5 mt-8"
    >
      更改信箱或密碼
    </div>
    <v-form
      v-if="$isSelf(user.username)"
      ref="form"
      class="mt-4"
    >
      <v-row>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="formValues.email"
            class="mx-1"
            label="請輸入新信箱（不需更改則留空）"
            outlined="outlined"
            :rules="formRules.email"
            @input="emailError = ''"
            @change="validateEmail"
          />
        </v-col>
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="formValues.newPassword"
            class="mx-1"
            label="請輸入新密碼（不需更改則留空）"
            outlined="outlined"
            :type="isShowNewPassword ? 'text' : 'password'"
            :append-icon="isShowNewPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="isShowNewPassword = !isShowNewPassword"
          />
        </v-col>
      </v-row>
      <v-row align="baseline">
        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="formValues.oldPassword"
            class="mx-1"
            label="請輸入原密碼作為確認"
            outlined="outlined"
            :rules="formRules.oldPassword"
            :type="isShowPassword ? 'text' : 'password'"
            :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
            @click:append="isShowPassword = !isShowPassword"
          />
        </v-col>
        <v-btn
          color="primary"
          :disabled="isDisabledSubmit"
          :loading="isLoading"
          @click="submit"
        >
          送出
        </v-btn>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
    user: {
      type: Object,
      required: true,
    },
    stats: {
      type: Object,
    },
  },

  data() {
    return {
      isLoading: false,
      school: '',
      formValues: {
        email: '',
        oldPassword: '',
        newPassword: '',
      },
      emailError: '',
      emailErrorMsg: {
        notUnique: '此 email 已被使用',
        invalid: '錯誤的 email 格式',
      },
      isEmailValidating: false,
      isShowPassword: false,
      isShowNewPassword: false,
    }
  },

  computed: {
    formRules() {
      return {
        email: [() => !this.emailError || this.emailErrorMsg[this.emailError]],
        oldPassword: [(v) => !!v || '請輸入原密碼！'],
      }
    },
    totalLikedAmount() {
      if (!this.stats) return ''
      return this.stats.liked.reduce((a, b) => {
        return a + b.starers.length
      }, 0)
    },
    isDisabledSubmit() {
      return (
        (!this.formValues.newPassword && !this.formValues.email) ||
        !this.formValues.oldPassword ||
        this.isEmailValidating
      )
    },
    ...mapState({
      role: (state) => state.auth.role,
    }),
  },

  watch: {
    user: {
      handler() {
        if (!this.user.school) {
          this.school = '無'
          return
        }
        this.getSchool()
      },
      deep: true,
    },
  },

  methods: {
    getSchool() {
      this.$agent.School.get(this.user.school).then((resp) => (this.school = resp.data.data.abbr))
    },
    validateEmail() {
      this.isEmailValidating = true
      const body = { email: this.formValues.email }
      this.$agent.Auth.validateEmail(body)
        .then(() => {
          this.emailError = ''
        })
        .catch((error) => {
          if (error.message === 'Invalid email') {
            this.emailError = 'invalid'
          } else if (error.message === 'Email has been used') {
            this.emailError = 'notUnique'
          } else {
            this.emailError = '系統發生未知錯誤'
          }
        })
        .finally(() => {
          this.isEmailValidating = false
        })
    },
    submit() {
      if (this.$refs.form.validate()) {
        if (this.formValues.newPassword) {
          this.submitNewPassword()
        }
        if (this.formValues.email) {
          this.submitNewEmail()
        }
      }
    },
    submitNewPassword() {
      this.isLoading = true
      const body = {
        oldPassword: this.formValues.oldPassword,
        newPassword: this.formValues.newPassword,
      }
      this.$agent.Auth.changePassword(body)
        .then(() => {
          this.$alertSuccess('更改密碼成功。')
        })
        .catch(() => {
          this.$alertFail('更改密碼失敗。')
        })
        .finally(() => {
          this.isLoading = false
        })
    },
    submitNewEmail() {
      this.isLoading = true
      const body = {
        password: this.formValues.oldPassword,
        email: this.formValues.email,
      }
      this.$agent.Auth.changeEmail(body)
        .then(() => {
          this.$alertSuccess('更改信箱成功。')
        })
        .catch(() => {
          this.$alertFail('更改信箱失敗。')
        })
        .finally(() => {
          this.isLoading = false
        })
    },
  },
}
</script>
