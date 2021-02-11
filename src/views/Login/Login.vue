<template>
  <v-container fluid class="d-flex flex-column align-center login">
    <div class="text-h3">歡迎回來，請先登入</div>
    <v-form ref="form">
      <v-row>
        <v-col cols="4">
          <v-combobox
            v-model="loginForm.school"
            :rules="loginRules.school"
            class="mt-8"
            single-line
            :items="SCHOOLS"
            :item-text="({ alias, name }) => `${alias} ${name}`"
            item-value="alias"
            label="學校"
            outlined
          >
            <template v-slot:selection="{ item }">{{ item.alias }}</template>
          </v-combobox>
        </v-col>
        <v-col cols="8">
          <v-text-field
            label="使用者名稱"
            v-model="loginForm.username"
            :rules="loginRules.username"
            class="mt-8"
            outlined
            @keyup.enter="handleSubmit"
            @input="() => (errorMsg = '')"
          />
        </v-col>
      </v-row>
      <v-text-field
        label="密碼"
        v-model="loginForm.password"
        :rules="loginRules.password"
        outlined
        :type="isShowPassword ? 'text' : 'password'"
        :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
        @click:append="isShowPassword = !isShowPassword"
        @keyup.enter="handleSubmit"
        :error="!!errorMsg"
        :error-messages="errorMsg"
        @input="() => (errorMsg = '')"
      />
      <v-btn color="secondary" block class="my-7" :loading="isLoading" @click="handleSubmit">
        登入
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { LOGIN } from '@/store/actions.type.js'
import { SCHOOLS } from '@/constants/auth.js'

export default {
  name: 'Login',

  data: () => ({
    isLoading: false,
    errorMsg: '',
    SCHOOLS,
    loginForm: {
      school: '',
      username: '',
      password: '',
    },
    loginRules: {
      school: [val => !!val || '請選擇您的學校'],
      username: [val => !!val || '請輸入您的使用者名稱'],
      password: [val => !!val || '請輸入您的密碼'],
    },
    isShowPassword: false,
  }),

  methods: {
    async handleSubmit() {
      if (!this.$refs.form.validate()) return
      this.isLoading = true
      const { username, password } = this
      this.$store
        .dispatch(LOGIN, { username, password })
        .then(() => {
          this.$alertSuccess('登入成功')
          const { redirectToPath } = this.$route.query
          if (redirectToPath === '/profile') {
            this.$router.push({ name: 'profile', params: { username } })
          } else {
            this.$router.push(redirectToPath ? { path: redirectToPath } : { name: 'courses' })
          }
        })
        .catch(error => {
          switch (error.message) {
            case 'Login Failed':
              this.errorMsg = '登入失敗：使用者名稱或密碼有誤'
              break
            default:
              this.errorMsg = '登入失敗：系統異常，請洽管理員'
              throw error
          }
        })
      this.isLoading = false
    },
  },
}
</script>

<style scoped>
.login {
  color: var(--v-primary-base);
  padding-top: 110px;
  padding-bottom: 166px;
}
</style>
