<template>
  <v-card flat>
    <v-card-text class="text--primary">
      <v-form
        ref="form"
        v-model="validForm"
      >
        <v-select
          v-model="newStudent.school"
          :rules="[val => val !== null || '此欄位為必填']"
          :items="schoolOptions || []"
          :item-text="({ abbr, name }) => `${abbr} ${name}`"
          item-value="abbr"
          label="學校"
          :loading="!schoolOptions"
          outlined
          dense
        >
          <template #selection="{ item }">
            {{ item.abbr || item.name }}
          </template>
        </v-select>
        <v-text-field
          v-model="newStudent.username"
          :rules="[
            val => !!val || '此欄位為必填',
            val => val.length <= 16 || '使用者名稱至多 16 字元',
          ]"
          label="username（使用者名稱）"
          outlined
          dense
        />
        <div class="text-body-1 mb-4">
          若帳號尚未創立，請設定以下資料。
        </div>
        <v-text-field
          v-model="newStudent.displayName"
          label="displayName（顯示名稱）"
          :rules="[v => v.length <= 32 || '顯示名稱至多 32 字元']"
          outlined
          dense
        />
        <v-text-field
          v-model="newStudent.password"
          label="password（密碼）"
          outlined
          dense
          :type="isShowPassword ? 'text' : 'password'"
          :append-icon="isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
          @click:append="isShowPassword = !isShowPassword"
        />
        <v-btn
          class="my-4"
          block
          color="success"
          :disabled="isAddStudentDisabled"
          :loading="isLoading"
          @click="submitAddStudent"
        >
          送出
        </v-btn>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script>
const initNewStudent = {
  school: '',
  username: '',
  displayName: '',
  password: '',
}

export default {
  props: {
    schoolOptions: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    isLoading: false,
    validForm: false,
    newStudent: { ...initNewStudent },
    isShowPassword: false,
  }),

  computed: {
    isAddStudentDisabled() {
      return !this.newStudent.username || !this.validForm
    },
  },

  methods: {
    submitAddStudent() {
      this.isLoading = true
      if (this.$refs.form.validate()) {
        const csv = Object.entries(this.newStudent)
        const csvHeader = csv.map(([k]) => k).join(',')
        const csvBody = csv.map(([, v]) => v).join(',')
        const csvString = `${csvHeader}\n${csvBody}`
        this.$emit('signup', this.$route.params.id, csvString, () => {
          this.newStudent = { ...initNewStudent }
        })
      }
      this.isLoading = false
    },
  },
}
</script>

<style></style>
