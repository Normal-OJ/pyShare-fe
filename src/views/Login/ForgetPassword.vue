<template>
  <v-container
    fluid
    class="d-flex flex-column align-center"
    style="padding-top: 110px"
  >
    <div
      class="text-h3 mb-12"
      data-test="title"
    >
      忘記密碼
    </div>
    <template v-if="!success">
      <div class="mb-12">
        輸入您帳號的電子信箱以寄送密碼復原信
      </div>
      <v-form
        ref="form"
        v-model="validForm"
      >
        <v-text-field
          v-model="email"
          label="電子信箱"
          :rules="emailRules"
          outlined
          style="min-width: 300px"
          :error-messages="errorMsg"
          data-test="email"
          @input="errorMsg = ''"
          @keyup.enter="handleSubmit"
        />
      </v-form>
      <v-btn
        class="mt-8"
        color="primary"
        :loading="isLoading"
        data-test="submit"
        @click="handleSubmit"
      >
        送出
      </v-btn>
    </template>
    <div
      v-else
      class="text-center"
      data-test="success"
    >
      <v-icon
        color="success"
        size="48"
      >
        mdi-check-circle
      </v-icon>
      <div class="mt-3">
        密碼復原信已寄到 {{ email }}！
      </div>
    </div>
  </v-container>
</template>

<script>
import { ref } from '@vue/composition-api'

export default {
  setup() {
    const email = ref('')
    const validForm = ref(false)
    const isLoading = ref(false)
    const success = ref(false)
    const emailRules = [(val) => !!val || '請輸入您的電子信箱']
    const errorMsg = ref('')

    return {
      email,
      validForm,
      isLoading,
      success,
      emailRules,
      errorMsg,
      handleSubmit() {
        if (!this.$refs.form.validate()) return
        this.isLoading = true
        this.$agent.Auth.passwordRecovery(this.email)
          .then(() => (this.success = true))
          .catch((error) => {
            this.errorMsg =
              error.message === 'User Not Exists' ? '查無帳號使用此電子信箱' : '發生未知錯誤'
          })
          .finally(() => (this.isLoading = false))
      },
    }
  },
}
</script>

<style></style>
