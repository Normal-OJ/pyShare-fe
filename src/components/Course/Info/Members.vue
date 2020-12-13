<template>
  <v-container fluid class="d-flex flex-column mt-4">
    <div class="d-flex align-center">
      <v-col cols="10" md="6" class="d-flex">
        <v-text-field
          v-model="searchText"
          label="快速搜尋"
          outlined
          hide-details
          append-icon="mdi-magnify"
          single-line
          dense
        />
      </v-col>
      <v-spacer />
      <AddStudentModal
        v-permission="[TEACHER]"
        @submitAddMultipleStudents="submitAddMultipleStudents"
        @submitAddStudent="submitAddStudent"
      />
    </div>

    <v-data-table
      :headers="headers"
      :items="members"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
      class="table"
      @click:row="handleRowClick"
    >
      <template v-slot:[`item.teacher`]="{ item }">
        {{ item.teacher ? '教師' : '學生' }}
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <div class="d-flex flex-column align-center" :key="slotName">
          <div class="text-subtitle-1 my-8">這裡還沒有任何成員，或找不到符合條件的成員</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import AddStudentModal from './AddStudentModal'
import { ROLE } from '@/constants/auth'

const { TEACHER } = ROLE

const headers = [
  { text: '使用者名稱', value: 'username' },
  { text: '顯示名稱', value: 'displayName' },
  { text: '身份', value: 'teacher' },
]

export default {
  name: 'MemberList',

  components: { AddStudentModal },

  props: {
    members: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    headers,
    searchText: '',
    loading: false,
    TEACHER,
  }),

  methods: {
    handleRowClick(value) {
      const route = this.$router.resolve({ name: 'profile', params: { username: value.username } })
      window.open(route.href, '_blank')
    },
    submitAddMultipleStudents(file) {
      this.$emit('submitAddMultipleStudents', file)
    },
    submitAddStudent(csvString) {
      this.$emit('submitAddStudent', csvString)
    },
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
