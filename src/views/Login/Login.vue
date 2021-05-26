<template>
  <v-container fluid class="d-flex flex-column align-center login">
    <div class="text-h3" data-test="title">歡迎回來，請先登入</div>
    <v-radio-group v-model="loginMethod" row class="mt-8" hide-details>
      <v-radio label="透過學校和使用者名稱登入" :value="USERNAME" />
      <v-radio label="透過電子信箱登入" :value="EMAIL" data-test="emailRadio" />
    </v-radio-group>
    <v-form ref="form" class="mt-4" style="width: min(460px, 80%)">
      <v-row v-if="loginMethod === USERNAME">
        <v-col cols="4">
          <v-select
            v-model="loginForm.school"
            :rules="loginRules.school"
            :items="schoolOptions"
            :item-text="({ alias, name }) => `${alias} ${name}`"
            item-value="alias"
            label="學校"
            outlined
            :error="!!errorMsg"
            @input="() => (errorMsg = '')"
            data-test="school"
          >
            <template v-slot:selection="{ item }">{{ item.alias || item.name }}</template>
          </v-select>
        </v-col>
        <v-col cols="8">
          <v-text-field
            label="使用者名稱"
            v-model.trim="loginForm.username"
            :rules="loginRules.username"
            outlined
            @keyup.enter="handleSubmit"
            :error="!!errorMsg"
            @input="() => (errorMsg = '')"
            data-test="username"
          />
        </v-col>
      </v-row>
      <v-text-field
        v-else
        label="電子郵件"
        v-model="loginForm.email"
        :rules="loginRules.email"
        class="mt-3 mb-3"
        outlined
        @keyup.enter="handleSubmit"
        :error="!!errorMsg"
        @input="() => (errorMsg = '')"
        data-test="email"
      />
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
        data-test="password"
      />
      <v-btn
        color="secondary"
        block
        class="mt-4"
        :loading="isLoading"
        @click="handleSubmit"
        data-test="submitLoginBtn"
      >
        登入
      </v-btn>
    </v-form>
  </v-container>
</template>

<script>
import { LOGIN } from '@/store/actions.type.js'
import { SCHOOLS } from '@/constants/auth'
import { mapState } from 'vuex'

const USERNAME = 0
const EMAIL = 1

export default {
  name: 'Login',

  data: () => ({
    isLoading: false,
    errorMsg: '',
    USERNAME,
    EMAIL,
    loginMethod: USERNAME,
    schoolOptions: SCHOOLS,
    loginForm: {
      school: null,
      username: null,
      email: null,
      password: null,
    },
    loginRules: {
      school: [val => val !== null || '請選擇您的學校'],
      email: [val => !!val || '請輸入您的電子信箱'],
      username: [val => !!val || '請輸入您的使用者名稱'],
      password: [val => !!val || '請輸入您的密碼'],
    },
    isShowPassword: false,
  }),

  methods: {
    async handleSubmit() {
      if (!this.$refs.form.validate()) return
      this.isLoading = true
      const { email, school, username, password } = this.loginForm
      const body =
        this.loginMethod === this.USERNAME ? { school, username, password } : { email, password }
      this.$store
        .dispatch(LOGIN, body)
        .then(async () => {
          this.$alertSuccess('登入成功')
          await this.$nextTick()
          const { redirectToPath } = this.$route.query
          if (redirectToPath === '/profile') {
            this.$router.push({ name: 'profile', params: { id: this.id } })
          } else {
            this.$router.push(redirectToPath ? { path: redirectToPath } : { name: 'courses' })
          }
        })
        .catch(error => {
          switch (error.message) {
            case 'Login Failed':
              this.errorMsg = '登入失敗：學校、使用者名稱或密碼有誤'
              break
            default:
              this.errorMsg = '登入失敗：系統異常，請洽管理員'
              throw error
          }
        })
        .finally(() => (this.isLoading = false))
    },
  },

  computed: {
    ...mapState({
      id: state => state.auth.id,
    }),
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
