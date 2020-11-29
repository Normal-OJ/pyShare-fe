<template>
  <div class="d-flex flex-column align-center">
    <v-form ref="form">
      <v-text-field
        label="使用者名稱"
        v-model="username"
        :rules="usernameRules"
        class="mt-12"
        style="width: 320px"
        outlined
        @keyup.enter="handleSubmit"
        @input="$emit('clear-error-msg')"
      />

      <v-text-field
        label="密碼"
        v-model="password"
        :rules="passwordRules"
        class="mt-4"
        style="width: 320px"
        outlined
        :type="isShowPassword ? 'text' : 'password'"
        :append-icon="isShowPassword ? 'mdi-eye-off' : 'mdi-eye'"
        @click:append="isShowPassword = !isShowPassword"
        @keyup.enter="handleSubmit"
        :error="!!errorMsg"
        :error-messages="errorMsg"
        @input="$emit('clear-error-msg')"
      />
    </v-form>

    <v-btn
      color="secondary"
      width="140"
      class="my-7"
      :disabled="isInputInvalid"
      :loading="isWaiting"
      @click="handleSubmit"
    >
      登入
    </v-btn>
  </div>
</template>

<script>
export default {
  name: 'LoginForm',

  props: {
    isWaiting: {
      type: Boolean,
      required: true,
    },
    errorMsg: {
      type: String,
      required: true,
    },
  },

  data: () => ({
    username: '',
    usernameRules: [val => !!val || '請輸入您的使用者名稱！'],
    password: '',
    passwordRules: [val => !!val || '請輸入您的密碼！'],
    isShowPassword: false,
  }),

  computed: {
    isInputInvalid() {
      return !this.username || !this.password
    },
  },

  methods: {
    handleSubmit() {
      if (this.$refs.form.validate()) {
        const { username, password } = this
        this.$emit('submit', { username, password })
      }
    },
  },
}
</script>
