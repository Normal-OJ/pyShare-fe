<template>
  <v-container fluid class="d-flex flex-column py-12">
    <v-row class="mb-4">
      <div class="text-h6">帳號列表</div>
      <v-spacer />
      <v-text-field
        v-model="searchText"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-btn class="ml-6 mt-4" color="primary" @click="showNewUserForm = true">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        新增帳號
      </v-btn>
    </v-row>
    <NewUserForm
      v-if="showNewUserForm"
      :schoolOptions="schoolOptions"
      @submit="submitNewUser"
      @cancel="showNewUserForm = false"
    />
    <div v-else-if="error">載入失敗</div>
    <v-data-table
      v-else
      :loading="!users"
      :headers="userTableHeaders"
      :items="users"
      :search="searchText"
    >
      <template v-slot:item.role="{ value }">{{ roles[value] }}</template>
    </v-data-table>
  </v-container>
</template>

<script>
import NewUserForm from '@/components/Admin/NewUserForm.vue'
import { ref, computed } from '@vue/composition-api'
import useSWRV from 'swrv'
import { fetcher } from '@/api/agent'

const userTableHeaders = [
  { text: '學校', value: 'school' },
  { text: '使用者名稱', value: 'username' },
  { text: '顯示名稱', value: 'displayName' },
  { text: '角色', value: 'role' },
  { text: '電子信箱', value: 'email' },
]
const roles = ['管理員', '教師', '學生']

export default {
  components: { NewUserForm },
  setup() {
    const { data, error, mutate } = useSWRV('/user', fetcher)
    const users = computed(() => data.value?.data.data)
    const searchText = ref('')
    const { data: schools } = useSWRV('/school', fetcher)
    const schoolOptions = computed(() => schools.value?.data.data)
    const showNewUserForm = ref(false)
    return {
      error,
      users,
      userTableHeaders,
      searchText,
      roles,
      schoolOptions,
      showNewUserForm,
      submitNewUser(csvString, resolve) {
        this.$agent.Auth.batchSignup({ csvString })
          .then(() => {
            this.$alertSuccess('新增帳號成功')
            resolve()
            mutate()
            this.showNewUserForm = false
          })
          .catch(error => {
            this.$alertFail('新增帳號失敗' + error.message)
            this.$rollbar.error('[views/AdminUsers/submitNewUser]', error)
          })
      },
    }
  },
}
</script>
