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
      <v-btn color="primary" outlined class="mr-3" @click="downloadStats">
        <v-icon>mdi-download</v-icon>
        下載統計資料
      </v-btn>
      <AddStudentModal
        v-permission="[TEACHER, 'COURSE']"
        @submitAddMultipleStudents="submitAddMultipleStudents"
        @submitAddStudent="submitAddStudent"
      />
    </div>

    <v-data-table
      :headers="headers"
      :items="data"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
      class="table"
      @click:row="handleRowClick"
    >
      <!-- <template v-slot:[`item.manage`]="{ item }">
        <v-btn class="ml-3" color="error" small @click="deleteStudent(item.username)">
          <v-icon class="mr-1" small>mdi-trash-can</v-icon>
          移除
        </v-btn>
      </template> -->
      <template v-slot:[`item.detail`]="{ item }">
        <v-btn icon @click.stop="handleClickDetail(item.username)">
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
  </v-container>
</template>

<script>
import AddStudentModal from '@/components/Course/Info/AddStudentModal'
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
const headers = [...statsHeaders, { text: '詳細', value: 'detail' }]

export default {
  components: { AddStudentModal },

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
        const { username, displayName } = stat.info
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
    downloadData() {
      const header = statsHeaders.map(h => h.text).join(',')
      const headerKey = statsHeaders.map(h => h.value)
      const body = this.data.map(d => headerKey.map(hk => d[hk]).join(',')).join('\n')
      return `${header}\n${body}`
    },
  },

  data: () => ({
    headers,
    searchText: '',
    TEACHER,
  }),

  methods: {
    handleRowClick(value) {
      const route = this.$router.resolve({ name: 'profile', params: { username: value.username } })
      window.open(route.href, '_blank')
    },
    handleClickDetail(username) {
      const route = this.$router.resolve({ name: 'profileStats', params: { username: username } })
      window.open(route.href, '_blank')
    },
    submitAddMultipleStudents(file) {
      this.$emit('submit-add-multiple-students', file)
    },
    submitAddStudent(csvString) {
      this.$emit('submit-add-student', csvString)
    },
    downloadStats() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.downloadData
      const link = document.createElement('a')
      link.download = `${this.$route.params.name}_statistics.csv`
      link.href = csvContent
      link.click()
    },
    // TODO: Backend has not finished yet
    // deleteStudent(username) {
    //   const result = window.confirm(`確認要移除 ${username} 嗎？`)
    //   if (result) {
    //     this.$emit('delete-student', username)
    //   }
    // },
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
