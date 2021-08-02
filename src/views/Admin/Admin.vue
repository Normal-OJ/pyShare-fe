<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row>
      <div class="text-h5">管理員介面</div>
    </v-row>
    <div class="mt-8 text-h6">新增帳號</div>
    <v-form ref="newUserForm" v-model="newUserForm.isValidForm">
      <v-row class="mt-4">
        <v-select
          v-model="newUserForm.data.school"
          :rules="[val => val !== null || '此欄位為必填']"
          :items="schoolOptions"
          :item-text="({ abbr, name }) => `${abbr} ${name}`"
          item-value="abbr"
          label="學校 school"
          :loading="isSchoolLoading"
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
          :rules="[
            val => !!val || '此欄位為必填',
            val => val.length <= 32 || '顯示名稱至多 32 字元',
          ]"
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
          @click="submitNewUser"
        >
          送出
        </v-btn>
      </v-row>
    </v-form>

    <div class="mt-8 text-h6">新增學校</div>
    <p>若該縮寫的學校已存在，將會覆寫顯示名稱</p>
    <v-form ref="newSchoolForm" v-model="newSchoolForm.isValidForm">
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
          :rules="[
            val => !!val || '此欄位為必填',
            val => val.length <= 32 || '顯示名稱至多 32 字元',
          ]"
          outlined
          dense
          class="mx-2"
        />
        <v-btn
          color="success"
          :disabled="isAddSchoolDisabled"
          :loading="newSchoolForm.isLoading"
          class="mx-2"
          @click="submitNewSchool"
        >
          送出
        </v-btn>
      </v-row>
    </v-form>
    <div class="mt-8 text-h6">學校列表</div>
    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th>縮寫 abbr</th>
            <th>顯示名稱 name</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="{ abbr, name } in schoolOptions" :key="abbr">
            <td>{{ abbr }}</td>
            <td>{{ name }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <div class="mt-8 text-h6">使用者列表</div>
    <v-data-table
      v-if="users"
      :headers="headers"
      :items="users"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
    />
    <p v-else>error</p>
  </v-container>
</template>

<script>
import { SCHOOLS } from '@/constants/auth'

const initNewUserData = {
  school: '',
  username: '',
  displayName: '',
  password: '',
  role: 1,
  email: '',
}
const initNewSchoolData = {
  abbr: '',
  name: '',
}

export default {
  data: () => ({
    schoolOptions: SCHOOLS,
    isSchoolLoading: true,
    roleOptions: [
      {
        text: '管理員',
        value: 0,
      },
      {
        text: '教師',
        value: 1,
      },
    ],
    newUserForm: {
      isValidForm: false,
      isShowPassword: false,
      data: {
        ...initNewUserData,
      },
      isLoading: false,
    },
    newSchoolForm: {
      isValidForm: false,
      data: {
        ...initNewSchoolData,
      },
      isLoading: false,
    },
    users: [],
    headers: [
      { text: '學校', value: 'school' },
      { text: '使用者名稱', value: 'username' },
      { text: '顯示名稱', value: 'displayName' },
      { text: '角色', value: 'role' },
      { text: '電子信箱', value: 'email' },
    ],
    searchText: '',
  }),

  watch: {
    'newSchoolForm.data.abbr'() {
      this.newSchoolForm.data.abbr = this.newSchoolForm.data.abbr.toUpperCase()
    },
  },

  computed: {
    isAddTeacherDisabled() {
      return !this.newUserForm.data.username || !this.newUserForm.isValidForm
    },
    isAddSchoolDisabled() {
      return !this.newSchoolForm.data.abbr || !this.newSchoolForm.data.name
    },
  },

  created() {
    this.$agent.School.getList()
      .then(resp => (this.schoolOptions = resp.data.data))
      .catch(error => {
        // 備援
        this.schoolOptions = SCHOOLS
        throw error
      })
      .finally(() => (this.isSchoolLoading = false))
    this.$agent.User.getList()
      .then(resp => (this.users = resp.data.data))
      .catch(error => {
        this.users = null
        throw error
      })
  },

  methods: {
    submitNewUser() {
      const { school, username, displayName, password, role, email } = this.newUserForm.data
      const csvHeader = ['school', 'username', 'displayName', 'password', 'role']
      const csvContent = [school, username, displayName, password, role]
      if (email) {
        csvHeader.push('email')
        csvContent.push(email)
      }
      const csvString = `${csvHeader.join(',')}\n${csvContent.join(',')}`
      console.log(csvString)
      this.$agent.Auth.batchSignup({
        csvString,
      })
        .then(() => {
          this.$alertSuccess('新增帳號成功')
          this.newUserForm.data = { ...initNewUserData }
          this.$refs.newUserForm.reset()
        })
        .catch(error => {
          this.$alertFail('新增帳號失敗' + error.message)
          throw error
        })
    },
    submitNewSchool() {
      this.$agent.School.createSchool(this.newSchoolForm.data)
        .then(() => {
          this.$alertSuccess('新增學校成功')
          this.newSchoolForm.data = { ...initNewSchoolData }
          this.$refs.newSchoolForm.reset()
        })
        .catch(error => {
          this.$alertFail('新增學校失敗' + error.message)
          throw error
        })
    },
  },
}
</script>
