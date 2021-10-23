<template>
  <v-form ref="form" v-model="newUserForm.isValid">
    <v-select
      v-model="newUserForm.data.school"
      :rules="[val => val !== null || '此欄位為必填']"
      :items="schoolOptions"
      :item-text="({ abbr, name }) => `${abbr} ${name}`"
      item-value="abbr"
      label="學校 school"
      outlined
      dense
      data-test="school"
    >
      <template v-slot:selection="{ item }">{{ item.abbr || item.name }}</template>
    </v-select>
    <v-text-field
      v-model="newUserForm.data.username"
      :rules="[val => !!val || '此欄位為必填', val => val.length <= 16 || '使用者名稱至多 16 字元']"
      label="使用者名稱 username"
      outlined
      dense
      data-test="username"
    />
    <v-text-field
      v-model="newUserForm.data.displayName"
      label="顯示名稱 displayName"
      :rules="[val => !!val || '此欄位為必填', val => val.length <= 32 || '顯示名稱至多 32 字元']"
      outlined
      dense
      data-test="displayName"
    />
    <v-text-field
      v-model="newUserForm.data.password"
      label="密碼 password"
      :rules="[val => !!val || '此欄位為必填']"
      outlined
      :type="newUserForm.isShowPassword ? 'text' : 'password'"
      :append-icon="newUserForm.isShowPassword ? 'mdi-eye' : 'mdi-eye-off'"
      @click:append="newUserForm.isShowPassword = !newUserForm.isShowPassword"
      dense
      data-test="password"
    />
    <v-select
      v-model="newUserForm.data.role"
      :items="roleOptions"
      label="帳號角色"
      outlined
      dense
      data-test="role"
    />
    <v-text-field
      v-model="newUserForm.data.email"
      label="電子信箱 email，選填"
      outlined
      dense
      data-test="email"
    />
    <v-btn
      color="success"
      :disabled="isSubmitDisabled"
      :loading="newUserForm.isLoading"
      data-test="submit"
      @click="submit"
    >
      送出
    </v-btn>
    <v-btn :disabled="newUserForm.isLoading" data-test="cancel" @click="$emit('cancel')" text>
      取消
    </v-btn>
  </v-form>
</template>

<script>
const initNewUserData = {
  school: '',
  username: '',
  displayName: '',
  password: '',
  role: 1,
  email: '',
}

export default {
  props: {
    schoolOptions: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    newUserForm: {
      isValid: false,
      isShowPassword: false,
      data: { ...initNewUserData },
      isLoading: false,
    },
    roleOptions: [
      { text: '管理員', value: 0 },
      { text: '教師', value: 1 },
    ],
  }),

  computed: {
    isSubmitDisabled() {
      return !this.newUserForm.data.username || !this.newUserForm.isValid
    },
  },

  methods: {
    submit() {
      if (!this.$refs.form.validate()) return
      const { school, username, displayName, password, role, email } = this.newUserForm.data
      const csvHeader = ['school', 'username', 'displayName', 'password', 'role']
      const csvContent = [school, username, displayName, password, role]
      if (email) {
        csvHeader.push('email')
        csvContent.push(email)
      }
      const csvString = `${csvHeader.join(',')}\n${csvContent.join(',')}`
      this.$emit('submit', csvString, () => {
        this.newUserForm.data = { ...initNewUserData }
      })
    },
  },
}
</script>
