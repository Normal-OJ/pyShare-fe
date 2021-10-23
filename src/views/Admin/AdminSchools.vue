<template>
  <v-container fluid class="d-flex flex-column py-12">
    <v-row class="mb-4">
      <div class="text-h6">學校列表</div>
      <v-spacer />
      <v-text-field
        v-model="searchText"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-btn class="ml-6 mt-4" color="primary" @click="showNewSchoolForm = true">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        新增學校
      </v-btn>
    </v-row>
    <NewSchoolForm
      v-if="showNewSchoolForm"
      @submit="submitNewSchool"
      @cancel="showNewSchoolForm = false"
    />
    <div v-else-if="error">載入失敗</div>
    <v-data-table
      v-else
      :loading="!schools"
      :headers="schoolTableHeaders"
      :items="schools"
      :search="searchText"
    />
  </v-container>
</template>

<script>
import NewSchoolForm from '@/components/Admin/NewSchoolForm.vue'
import { ref, computed } from '@vue/composition-api'
import useSWRV from 'swrv'
import { fetcher } from '@/api/agent'

const schoolTableHeaders = [
  { text: '縮寫', value: 'abbr' },
  { text: '顯示名稱', value: 'name' },
]

export default {
  components: { NewSchoolForm },
  setup() {
    const { data, error, mutate } = useSWRV('/school', fetcher)
    const schools = computed(() => data.value?.data.data)
    const searchText = ref('')
    const showNewSchoolForm = ref(false)
    return {
      error,
      schools,
      schoolTableHeaders,
      searchText,
      showNewSchoolForm,
      submitNewSchool(data, resolve) {
        this.$agent.School.createSchool(data)
          .then(() => {
            this.$alertSuccess('新增學校成功')
            mutate()
            resolve()
            this.showNewSchoolForm = false
          })
          .catch(error => {
            this.$alertFail('新增學校失敗' + error.message)
            this.$rollbar.error('[views/AdminSchool/submitNewSchool]', error)
          })
      },
    }
  },
}
</script>
