<template>
  <v-container fluid>
    <div class="text-h5">管理主題</div>
    <div class="d-flex align-center">
      <v-col cols="10" md="6" class="d-flex">
        <v-select
          v-model="selectedTags"
          class="mr-3"
          label="選擇分類"
          outlined
          hide-details
          :items="tags"
          multiple
          dense
        />
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
      <v-btn color="primary" :to="{ name: 'courseProblems' }" class="mr-3" outlined>
        回到主題列表
      </v-btn>
      <v-btn color="success" :to="{ name: 'courseSetProblems', params: { operation: 'new' } }">
        <v-icon class="mr-1">mdi-playlist-plus</v-icon>
        新增主題
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="problems"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
      :custom-sort="customSort"
    >
      <template v-slot:[`item.title`]="{ item }">
        <router-link :to="{ name: 'courseProblem', params: { pid: item.pid } }">
          {{ item.title }}
        </router-link>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.status === 0"
              class="ml-2"
              small
              v-bind="attrs"
              v-on="on"
              color="error"
            >
              mdi-minus-circle
            </v-icon>
          </template>
          <span>隱藏的主題</span>
        </v-tooltip>
        <v-tooltip bottom>
          <template v-slot:activator="{ on, attrs }">
            <v-icon
              v-if="item.isTemplate"
              class="ml-2"
              small
              v-bind="attrs"
              v-on="on"
              color="primary"
            >
              mdi-earth
            </v-icon>
          </template>
          <span>已發布於公開資料集</span>
        </v-tooltip>
      </template>
      <template v-slot:[`item.tags`]="{ item }">
        <ColorLabel
          v-for="tag in item.tags"
          :key="tag"
          :tag="tag"
          small
          class="ma-1"
          @click.native="selectTag(tag)"
        />
      </template>
      <template v-slot:[`item.creations`]="{ item }">
        {{ item.comments.length }}
      </template>
      <template v-slot:[`item.manage`]="{ item }">
        <v-menu bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs" class="hidden-lg-and-up">
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item
              link
              :to="{
                name: 'courseSetProblems',
                params: { operation: 'edit' },
                query: { pid: item.pid },
              }"
            >
              <v-list-item-title>編輯</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="openCloneDialog(item.pid)">
              <v-list-item-title>複製</v-list-item-title>
            </v-list-item>
            <v-list-item link @click="deleteProblem(item.pid)">
              <v-list-item-title>刪除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <div class="hidden-md-and-down">
          <v-btn
            :to="{
              name: 'courseSetProblems',
              params: { operation: 'edit' },
              query: { pid: item.pid },
            }"
            class="mx-1"
            color="primary"
            small
          >
            <v-icon class="mr-1" small>mdi-pencil</v-icon>
            <span>編輯</span>
          </v-btn>
          <v-btn class="mx-1" color="primary" small @click="openCloneDialog(item.pid)">
            <v-icon class="mr-1" small>mdi-content-copy</v-icon>
            <span>複製</span>
          </v-btn>
          <v-btn class="mx-1" color="error" small @click="deleteProblem(item.pid)">
            <v-icon class="mr-1" small>mdi-trash-can</v-icon>
            <span>刪除</span>
          </v-btn>
        </div>
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <div class="d-flex flex-column align-center" :key="slotName">
          <div class="text-subtitle-1 my-8">這裡還沒有任何主題，或找不到符合條件的主題</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
        </div>
      </template>
    </v-data-table>
    <CloneProblemModal
      :isOpen="dialog"
      :clonePid="clonePid"
      :defaultCourseId="$route.params.id"
      label="主題"
      @success="handleCloneSuccess"
      @close="dialog = false"
    />
  </v-container>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel'
import CloneProblemModal from '../Problem/CloneProblemModal.vue'

const headers = [
  { text: '題號', value: 'pid' },
  { text: '標題', value: 'title', sortable: false },
  { text: '分類', value: 'tags', sortable: false },
  { text: '累積創作數', value: 'creations' },
  { text: '管理', value: 'manage', sortable: false },
]

export default {
  components: { ColorLabel, CloneProblemModal },

  props: {
    problems: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  data() {
    return {
      searchText: '',
      selectedTags: [],
      dialog: false,
      clonePid: 0,
      isTemplate: false,
      headers: headers,
    }
  },

  watch: {
    selectedTags() {
      const paramsWithTags = {
        tags: this.selectedTags.join(','),
      }
      this.$emit('get-problems-by-tags', paramsWithTags)
    },
  },

  methods: {
    selectTag(tag) {
      this.selectedTags = [...new Set([...this.selectedTags, tag])]
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'creations') {
          if (!isDesc[0]) {
            return a.comments.length - b.comments.length
          } else {
            return b.comments.length - a.comments.length
          }
        } else {
          if (!isDesc[0]) {
            return a[index] < b[index] ? -1 : 1
          } else {
            return b[index] < a[index] ? -1 : 1
          }
        }
      })
      return items
    },
    openCloneDialog(pid) {
      this.clonePid = pid
      this.dialog = true
    },
    handleCloneSuccess() {
      this.$emit('refetch-data')
      this.dialog = false
    },
    deleteProblem(pid) {
      const result = window.confirm('確認要刪除嗎？')
      if (result) {
        this.$emit('delete-problem', pid)
      }
    },
  },
}
</script>
