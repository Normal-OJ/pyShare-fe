<template>
  <v-container fluid>
    <div class="text-h5">主題統計</div>
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

      <v-btn color="primary" class="mr-3" @click="downloadStats">
        <v-icon class="mr-1">mdi-download</v-icon>
        匯出統計資料
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="stats"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
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
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { downloadFile } from '@/lib/utils'

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
    ...mapState({
      courseName: state => state.course.courseInfo.name,
    }),
    courseId() {
      return this.$route.params.id
    },
  },

  data: () => ({
    headers,
    searchText: '',
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
    downloadData() {
      const header = statsHeaders.map(h => h.text).join(',')
      const headerKey = statsHeaders.map(h => h.value)
      const body = this.stats.map(d => headerKey.map(hk => d[hk]).join(',')).join('\n')
      return `${header}\n${body}`
    },
    downloadStats() {
      const csvContent = 'data:text/csv;charset=utf-8,' + this.downloadData()
      downloadFile(`${this.courseName}_主題統計.csv`, csvContent)
    },
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
