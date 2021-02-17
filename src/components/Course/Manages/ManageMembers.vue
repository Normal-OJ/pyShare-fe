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
        <v-btn icon class="mr-3" color="error" @click="handleClickDelete()">
          <v-icon>mdi-trash-can</v-icon>
        </v-btn>
        <v-btn color="primary" outlined class="mr-3" @click="downloadStats">
          <v-icon>mdi-download</v-icon>
          下載勾選的資料
        </v-btn>
      </div>
      <v-btn color="primary" outlined class="mr-3" @click="downloadStats">
        <v-icon>mdi-download</v-icon>
        下載統計資料
      </v-btn>
      <AddStudentModal
        v-permission="[TEACHER, 'COURSE']"
        @submit-add-multiple-students="submitAddMultipleStudents"
        @submit-add-student="submitAddStudent"
      />
    </div>

    <v-data-table
      :headers="headers"
      :items="data"
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
      <template v-slot:[`item.detail`]="{ item }">
        <v-btn icon small @click.stop="handleClickDetail(item.id)">
          <v-icon>mdi-format-list-bulleted</v-icon>
        </v-btn>
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
      :willDeleteMembers="selectedUsername"
      :deleteStudentErrorMsg="deleteStudentErrorMsg"
      @delete-student="deleteStudent"
      @close="closeConfirmDeleteModal"
    />
  </v-container>
</template>

<script>
import AddStudentModal from '@/components/Course/Info/AddStudentModal'
import ConfirmDeleteModal from './ConfirmDeleteModal'
import { ROLE } from '@/constants/auth'

const { TEACHER } = ROLE
const statsHeaders = [
  { text: '使用者名稱', value: 'username' },
  { text: '顯示名稱', value: 'displayName' },
  { text: '主題數', value: 'numOfProblems' },
  { text: '創作數', value: 'numOfComments' },
  { text: '留言數', value: 'numOfReplies' },
  { text: '獲得愛心', value: 'numOfLiked' },
  { text: '給予愛心', value: 'numOfLikes' },
  { text: '執行成功', value: 'execSuccess' },
  { text: '執行失敗', value: 'execFail' },
  { text: 'AC 創作數', value: 'numOfAcceptedComments' },
]
const headers = [...statsHeaders, { text: '詳細', value: 'detail', sortable: false }]

export default {
  components: { AddStudentModal, ConfirmDeleteModal },

  props: {
    stats: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    data() {
      return this.stats.map(stat => {
        const { username, displayName, id } = stat.info
        const numOfProblems = stat.problems.length
        const numOfComments = stat.comments.length
        const numOfReplies = stat.replies.length
        const numOfLiked = stat.liked.reduce((a, b) => {
          return a + b.starers.length
        }, 0)
        const numOfLikes = stat.likes.length
        const numOfAcceptedComments = stat.comments.filter(c => c.accepted).length
        const [execSuccess, execFail] = stat.execInfo.reduce(
          (a, b) => {
            return [a[0] + b.success, a[1] + b.fail]
          },
          [0, 0],
        )
        return {
          username,
          displayName,
          id,
          numOfProblems,
          numOfComments,
          numOfReplies,
          numOfLiked,
          numOfLikes,
          numOfAcceptedComments,
          execSuccess,
          execFail,
        }
      })
    },
    selectedUser() {
      return this.selected.map(s => s.id)
    },
    selectedUsername() {
      return this.selected.map(s => `${s.username} (${s.displayName})`)
    },
  },

  data: () => ({
    headers,
    selected: [],
    searchText: '',
    TEACHER,
    isShowConfirmDeleteModal: false,
    isWaitingDeleteStudent: false,
    deleteStudentErrorMsg: '',
  }),

  methods: {
    handleRowClick(value) {
      const route = this.$router.resolve({ name: 'profile', params: { id: value.id } })
      window.open(route.href, '_blank')
    },
    handleClickDetail(id) {
      const route = this.$router.resolve({ name: 'profileStats', params: { id } })
      window.open(route.href, '_blank')
    },
    submitAddMultipleStudents(file, resolve, reject) {
      this.$emit('submit-add-multiple-students', file, resolve, reject)
    },
    submitAddStudent(csvString, resolve, reject) {
      this.$emit('submit-add-student', csvString, resolve, reject)
    },
    downloadData() {
      const header = statsHeaders.map(h => h.text).join(',')
      const headerKey = statsHeaders.map(h => h.value)
      const body = this.data
        .filter(d => this.selected.length === 0 || this.selectedUser.includes(d.username))
        .map(d => headerKey.map(hk => d[hk]).join(','))
        .join('\n')
      return `${header}\n${body}`
    },
    downloadStats() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.downloadData()
      const link = document.createElement('a')
      link.download = `${this.$route.params.name}_statistics.csv`
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
