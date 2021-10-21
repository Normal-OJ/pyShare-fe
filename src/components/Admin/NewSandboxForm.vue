<template>
  <v-form ref="form" v-model="newSandboxForm.isValid">
    <v-text-field
      v-model.trim="newSandboxForm.data.url"
      :rules="[val => !!val || '此欄位為必填', val => val.length <= 2048 || 'URL 過長']"
      :readonly="!populateWith.new"
      label="連線位址 URL"
      outlined
      dense
      class="mx-2"
      data-test="url"
    />
    <v-text-field
      v-model.trim="newSandboxForm.data.alias"
      :rules="[val => !val || val.length <= 32 || '暱稱過長']"
      label="暱稱 Alias (optional)"
      outlined
      dense
      counter="32"
      class="mx-2"
      data-test="alias"
    />
    <v-textarea
      v-if="populateWith.new"
      v-model.trim="newSandboxForm.data.token"
      :rules="[val => !!val || '此欄位為必填']"
      label="Token"
      outlined
      dense
      class="mx-2"
      data-test="token"
    />
    <v-btn
      color="success"
      :disabled="isSubmitDisabled"
      :loading="populateWith.isLoading"
      class="mx-2"
      @click="submit"
      data-test="submit"
    >
      送出
    </v-btn>
    <v-btn
      :disabled="populateWith.isLoading"
      class="mx-2"
      @click="$emit('cancel')"
      text
      data-test="cancel"
    >
      取消
    </v-btn>
  </v-form>
</template>

<script>
export default {
  props: {
    populateWith: { type: Object, required: true },
  },

  data() {
    return {
      newSandboxForm: {
        isValid: false,
        data: { ...this.populateWith.data },
      },
    }
  },

  computed: {
    isSubmitDisabled() {
      return (
        !this.newSandboxForm.data.url ||
        (!!this.populateWith.new && !this.newSandboxForm.data.token)
      )
    },
  },

  methods: {
    submit() {
      if (!this.$refs.form.validate()) return
      this.$emit(this.populateWith.new ? 'submit' : 'modify', this.newSandboxForm.data)
    },
  },
}
</script>
