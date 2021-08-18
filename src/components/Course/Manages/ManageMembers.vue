<template>
  <v-container fluid>
    <div class="text-h5">管理成員</div>
    <div class="d-flex align-center mt-4">
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

      <div v-if="selected.length > 0">
        <v-btn color="error" text @click="handleClickDelete()" data-test="removeStudentBtn">
          <v-icon class="mr-1">mdi-trash-can</v-icon>
          移除勾選的成員
        </v-btn>
      </div>

      <v-spacer />

      <v-btn color="primary" outlined class="mr-3" @click="downloadMembers">
        <v-icon>mdi-download</v-icon>
        匯出成員名單
      </v-btn>
      <AddStudentModal v-if="canWriteCourse" @success="$emit('success-add-student')" />
    </div>

    <v-data-table
      :headers="headers"
      :items="members"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      v-model="selected"
      show-select
      item-key="username"
      :loading="loading"
      class="table"
      @click:row="handleRowClick"
    >
      <template v-slot:item.data-table-select="{ item, isSelected, select }">
        <v-simple-checkbox
          v-if="item.role !== '教師'"
          :value="isSelected"
          :ripple="false"
          @input="select($event)"
        />
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <div class="d-flex flex-column align-center" :key="slotName">
          <div class="text-subtitle-1 my-8">這裡還沒有任何成員，或找不到符合條件的成員</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
        </div>
      </template>
    </v-data-table>
    <ConfirmDeleteModal
      :isVisible="isShowConfirmDeleteModal"
      :isLoading="isWaitingDeleteStudent"
      :willDeleteMembers="selectedUserInfo"
      :deleteStudentErrorMsg="deleteStudentErrorMsg"
      @delete-student="deleteStudent"
      @close="closeConfirmDeleteModal"
    />
  </v-container>
</template>

<script>
import AddStudentModal from '@/components/Course/AddStudentModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { ROLE } from '@/constants/auth'
import { mapState } from 'vuex'
import { canWriteCourseMixin } from '@/lib/permissionMixin'

const { TEACHER } = ROLE

export default {
  components: { AddStudentModal, ConfirmDeleteModal },

  mixins: [canWriteCourseMixin],

  props: {
    members: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    headers: [
      { text: '使用者名稱', value: 'username' },
      { text: '顯示名稱', value: 'displayName' },
      { text: '身份', value: 'role' },
      { text: 'email', value: 'email' },
    ],
    selected: [],
    searchText: '',
    TEACHER,
    isShowConfirmDeleteModal: false,
    isWaitingDeleteStudent: false,
    deleteStudentErrorMsg: '',
  }),

  computed: {
    selectedUser() {
      return this.selected.map(s => s.id)
    },
    selectedUserInfo() {
      return this.selected.map(s => `${s.username} (${s.displayName})`)
    },
    ...mapState({
      courseName: state => state.course.courseInfo.name,
    }),
  },

  methods: {
    handleRowClick(value) {
      const route = this.$router.resolve({ name: 'profile', params: { id: value.id } })
      window.open(route.href, '_blank')
    },
    downloadData() {
      const header = this.headers.map(h => h.text).join(',')
      const headerKey = this.headers.map(h => h.value)
      const body = this.members.map(d => headerKey.map(hk => d[hk]).join(',')).join('\n')
      return `${header}\n${body}`
    },
    downloadMembers() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.downloadData()
      const link = document.createElement('a')
      link.download = `${this.courseName}_成員名單.csv`
      link.href = csvContent
      link.click()
    },
    handleClickDelete() {
      this.isShowConfirmDeleteModal = true
    },
    closeConfirmDeleteModal() {
      this.isShowConfirmDeleteModal = false
    },
    deleteStudent() {
      this.isWaitingDeleteStudent = true
      new Promise((resolve, reject) =>
        this.$emit('delete-student', this.selectedUser, resolve, reject),
      )
        .then(() => {
          this.closeConfirmDeleteModal()
          this.$alertSuccess('移除學生成功。')
        })
        .catch(error => {
          this.$alertFail('移除學生失敗。')
          this.deleteStudentErrorMsg = error.message
        })
        .finally(() => {
          this.isWaitingDeleteStudent = false
        })
    },
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
