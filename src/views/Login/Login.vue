<template>
  <v-container
    fluid
    class="d-flex flex-column align-center login"
  >
    <div
      class="text-h3"
      data-test="title"
    >
      歡迎回來，請先登入
    </div>
    <v-radio-group
      v-model="loginMethod"
      row
      class="mt-8"
      hide-details
    >
      <v-radio
        label="透過學校和使用者名稱登入"
        :value="LOGIN_BY.USERNAME"
      />
      <v-radio
        label="透過電子信箱登入"
        :value="LOGIN_BY.EMAIL"
        data-test="emailRadio"
      />
    </v-radio-group>
    <v-form
      ref="form"
      class="mt-4"
      style="width: min(460px, 80%)"
    >
      <v-row v-if="loginMethod === LOGIN_BY.USERNAME">
        <v-col cols="4">
          <v-select
            v-model="loginForm.school"
            :rules="loginRules.school"
            :items="schoolOptions"
            :item-text="({ abbr, name }) => `${abbr} ${name}`"
            item-value="abbr"
            label="學校"
            outlined
            no-data-text="載入中"
            :loading="isSchoolLoading"
            :error="!!errorMsg"
            data-test="school"
            @input="() => (errorMsg = '')"
          >
            <template #selection="{ item }">
              {{ item.abbr || item.name }}
            </template>
          </v-select>
        </v-col>
        <v-col cols="8">
          <v-text-field
            v-model.trim="loginForm.username"
            label="使用者名稱"
            :rules="loginRules.username"
            outlined
            :error="!!errorMsg"
            data-test="username"
            @keyup.enter="handleSubmit"
            @input="() => (errorMsg = '')"
          />
        </v-col>
      </v-row>
      <v-text-field
        v-else
        v-model="loginForm.email"
        label="電子信箱"
        :rules="loginRules.email"
        class="mt-3 mb-3"
        outlined
        :error="!!errorMsg"
        data-test="email"
        @keyup.enter="handleSubmit"
        @input="() => (errorMsg = '')"
      />
      <v-text-field
        v-model="loginForm.password"
        label="密碼"
        :rules="loginRules.password"
        outlined
        :type="isShowPassword ? 'text' : 'password'"
        :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
        :error="!!errorMsg"
        :error-messages="errorMsg"
        data-test="password"
        @click:append="isShowPassword = !isShowPassword"
        @keyup.enter="handleSubmit"
        @input="() => (errorMsg = '')"
      />
      <v-btn
        color="secondary"
        block
        class="mt-4"
        :loading="isLoading"
        data-test="submitLoginBtn"
        @click="handleSubmit"
      >
        登入
      </v-btn>
      <div
        style="margin-top: 100px"
        class="text-center"
      >
        <router-link :to="{ name: 'forgetPassword' }">
          忘記密碼
        </router-link>
      </div>
    </v-form>
  </v-container>
</template>

<script>
import { ActionTypes } from '@/store/action-types'
import { mapState } from 'vuex'
import { SCHOOLS } from '@/constants/auth'

const LOGIN_BY = {
  USERNAME: 0,
  EMAIL: 1,
}

export default {
  name: 'Login',

  data: () => ({
    isLoading: false,
    isSchoolLoading: true,
    errorMsg: '',
    LOGIN_BY,
    loginMethod: LOGIN_BY.USERNAME,
    schoolOptions: [],
    loginForm: {
      school: null,
      username: null,
      email: null,
      password: null,
    },
    loginRules: {
      school: [(val) => val !== null || '請選擇您的學校'],
      email: [(val) => !!val || '請輸入您的電子信箱'],
      username: [(val) => !!val || '請輸入您的使用者名稱'],
      password: [(val) => !!val || '請輸入您的密碼'],
    },
    isShowPassword: false,
  }),

  computed: {
    ...mapState({
      id: (state) => state.auth.id,
    }),
  },

  created() {
    this.$agent.School.getList()
      .then((resp) => (this.schoolOptions = resp.data.data))
      .catch((error) => {
        // 備援
        this.schoolOptions = SCHOOLS
        this.$rollbar.error('Failed to fetch school list!', error)
      })
      .finally(() => (this.isSchoolLoading = false))
  },

  methods: {
    async handleSubmit() {
      if (!this.$refs.form.validate()) return
      this.$rollbar.info('LoginBy', this.loginMethod)
      this.isLoading = true
      const { email, school, username, password } = this.loginForm
      const body =
        this.loginMethod === LOGIN_BY.USERNAME ?
          { school, username, password } :
          { email, password }
      this.$store
        .dispatch(ActionTypes.LOGIN, body)
        .then(() => {
          this.$alertSuccess('登入成功')
          const { redirectToPath } = this.$route.query
          this.$router.push(redirectToPath ? { path: redirectToPath } : { name: 'courses' })
        })
        .catch((error) => {
          switch (error.message) {
          case 'Login Failed':
            this.errorMsg =
                this.loginMethod === LOGIN_BY.USERNAME ?
                  '登入失敗：學校、使用者名稱或密碼有誤' :
                  '登入失敗：信箱或密碼有誤'
            break
          default:
            this.errorMsg = '登入失敗：系統異常，請洽管理員'
            this.$rollbar.error('Failed to login with unknown reason!', error)
          }
        })
        .finally(() => (this.isLoading = false))
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
