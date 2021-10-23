<template>
  <v-form ref="form" v-model="newSchoolForm.isValid">
    <v-text-field
      v-model="newSchoolForm.data.abbr"
      :rules="[val => !!val || '此欄位為必填', val => val.length <= 16 || '使用者名稱至多 16 字元']"
      label="學校縮寫 abbr，此欄位固定大寫"
      counter="16"
      outlined
      dense
      data-test="abbr"
    />
    <v-text-field
      v-model="newSchoolForm.data.name"
      :rules="[val => !!val || '此欄位為必填', val => val.length <= 32 || '顯示名稱至多 32 字元']"
      label="學校顯示名稱"
      counter="32"
      outlined
      dense
      data-test="name"
    />
    <v-btn
      color="success"
      class="mr-3"
      :disabled="isSubmitDisabled"
      :loading="newSchoolForm.isLoading"
      @click="submit"
      data-test="submit"
    >
      送出
    </v-btn>
    <v-btn :disabled="newSchoolForm.isLoading" @click="$emit('cancel')" text data-test="cancel">
      取消
    </v-btn>
  </v-form>
</template>

<script>
const initNewSchoolData = {
  abbr: '',
  name: '',
}

export default {
  data: () => ({
    newSchoolForm: {
      isValid: false,
      isLoading: false,
      data: {
        ...initNewSchoolData,
      },
    },
  }),

  watch: {
    'newSchoolForm.data.abbr'() {
      this.newSchoolForm.data.abbr = this.newSchoolForm.data.abbr.toUpperCase()
    },
  },

  computed: {
    isSubmitDisabled() {
      return !this.newSchoolForm.data.abbr || !this.newSchoolForm.data.name
    },
  },

  methods: {
    submit() {
      if (!this.$refs.form.validate()) return
      this.$emit('submit', this.newSchoolForm.data, () => {
        this.newSchoolForm.data = { ...initNewSchoolData }
      })
    },
  },
}
</script>
