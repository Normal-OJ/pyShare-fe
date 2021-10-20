<template>
  <v-form v-model="newUserForm.isValid">
    <v-row class="mt-4">
      <v-select
        v-model="newUserForm.data.school"
        :rules="[val => val !== null || '此欄位為必填']"
        :items="schoolOptions"
        :item-text="({ abbr, name }) => `${abbr} ${name}`"
        item-value="abbr"
        label="學校 school"
        outlined
        dense
        class="mx-2"
      >
        <template v-slot:selection="{ item }">{{ item.abbr || item.name }}</template>
      </v-select>
      <v-text-field
        v-model="newUserForm.data.username"
        :rules="[
          val => !!val || '此欄位為必填',
          val => val.length <= 16 || '使用者名稱至多 16 字元',
        ]"
        label="使用者名稱 username"
        outlined
        dense
        class="mx-2"
      />
      <v-text-field
        v-model="newUserForm.data.displayName"
        label="顯示名稱 displayName"
        :rules="[val => !!val || '此欄位為必填', val => val.length <= 32 || '顯示名稱至多 32 字元']"
        outlined
        dense
        class="mx-2"
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
        class="mx-2"
      />
    </v-row>
    <v-row align="start">
      <v-select
        v-model="newUserForm.data.role"
        :items="roleOptions"
        label="帳號角色"
        outlined
        dense
        class="mx-2"
      />
      <v-text-field
        v-model="newUserForm.data.email"
        label="電子信箱 email，選填"
        outlined
        dense
        class="mx-2"
      />
      <v-btn
        color="success"
        :disabled="isAddTeacherDisabled"
        :loading="newUserForm.isLoading"
        class="mx-2"
        @click="submit"
      >
        送出
      </v-btn>
      <v-btn :disabled="newUserForm.isLoading" class="mx-2" @click="$emit('cancel')" text>
        取消
      </v-btn>
    </v-row>
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
    isAddTeacherDisabled() {
      return !this.newUserForm.data.username || !this.newUserForm.isValid
    },
  },

  methods: {
    submit() {
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
