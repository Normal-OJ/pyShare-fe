<template>
  <v-form v-model="newSchoolForm.isValid">
    <v-row class="mt-4">
      <v-text-field
        v-model="newSchoolForm.data.abbr"
        :rules="[
          val => !!val || '此欄位為必填',
          val => val.length <= 16 || '使用者名稱至多 16 字元',
        ]"
        label="學校縮寫 abbr，此欄位固定大寫"
        outlined
        dense
        class="mx-2"
      />
      <v-text-field
        v-model="newSchoolForm.data.name"
        label="學校顯示名稱"
        :rules="[val => !!val || '此欄位為必填', val => val.length <= 32 || '顯示名稱至多 32 字元']"
        outlined
        dense
        class="mx-2"
      />
      <v-btn
        color="success"
        :disabled="isAddSchoolDisabled"
        :loading="newSchoolForm.isLoading"
        class="mx-2"
        @click="submit"
      >
        送出
      </v-btn>
      <v-btn :disabled="newSchoolForm.isLoading" class="mx-2" @click="$emit('cancel')" text>
        取消
      </v-btn>
    </v-row>
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
    isAddSchoolDisabled() {
      return !this.newSchoolForm.data.abbr || !this.newSchoolForm.data.name
    },
  },

  methods: {
    submit() {
      this.$emit('submit', this.newSchoolForm, () => {
        this.newSchoolForm.data = { ...initNewSchoolData }
      })
    },
  },
}
</script>
