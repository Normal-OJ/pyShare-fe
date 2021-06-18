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
            <v-icon class="ml-1" small v-bind="attrs" v-on="on" v-if="item.status === 0">
              mdi-minus-circle
            </v-icon>
          </template>
          <span>隱藏的主題</span>
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
        <v-btn
          :to="{
            name: 'courseSetProblems',
            params: { operation: 'edit' },
            query: { pid: item.pid },
          }"
          color="primary"
          small
        >
          <v-icon class="mr-1" small>mdi-pencil</v-icon>
          編輯
        </v-btn>
        <v-dialog v-model="dialog" width="750">
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="ml-3" color="primary" small v-bind="attrs" v-on="on">
              <v-icon class="mr-1" small>mdi-content-copy</v-icon>
              複製
            </v-btn>
          </template>
          <v-card>
            <v-toolbar dark color="primary" dense>
              <v-toolbar-title>複製主題</v-toolbar-title>
              <v-spacer />
              <v-toolbar-items>
                <v-btn icon dark @click="dialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar-items>
            </v-toolbar>
            <v-card-text class="mt-8 text--primary">
              <v-form ref="form">
                <v-select
                  label="複製至課程"
                  v-model="target"
                  :items="teachingCourses"
                  item-text="name"
                  item-value="id"
                  outlined
                  dense
                />
                <v-radio-group v-model="isTemplate">
                  <v-radio label="複製為主題" :value="false" />
                  <v-radio label="複製為範本" :value="true" />
                </v-radio-group>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                color="success"
                :loading="isLoading"
                :disabled="!target"
                @click="cloneProblem(item.pid)"
              >
                送出
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-btn class="ml-3" color="error" small @click="deleteProblem(item.pid)">
          <v-icon class="mr-1" small>mdi-trash-can</v-icon>
          刪除
        </v-btn>
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <div class="d-flex flex-column align-center" :key="slotName">
          <div class="text-subtitle-1 my-8">這裡還沒有任何主題，或找不到符合條件的主題</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel'
import { mapActions, mapGetters } from 'vuex'
import { GetterTypes } from '@/store/getter-types'
import { ActionTypes } from '@/store/action-types'
import agent from '@/api/agent'

const headers = [
  { text: '題號', value: 'pid' },
  { text: '標題', value: 'title', sortable: false },
  { text: '分類', value: 'tags', sortable: false },
  { text: '累積創作數', value: 'creations' },
  { text: '管理', value: 'manage', sortable: false },
]

export default {
  components: { ColorLabel },

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
      target: this.$route.params.id,
      isTemplate: false,
      isLoading: false,
      headers: headers,
    }
  },

  computed: {
    ...mapGetters({
      teachingCourses: GetterTypes.TEACHING_COURSES,
    }),
  },

  created() {
    this.getCourses()
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
          if (!isDesc) {
            return a.comments.length - b.comments.length
          } else {
            return b.comments.length - a.comments.length
          }
        } else {
          if (!isDesc) {
            return a[index] < b[index] ? -1 : 1
          } else {
            return b[index] < a[index] ? -1 : 1
          }
        }
      })
      return items
    },
    cloneProblem(pid) {
      this.isLoading = true
      console.log(pid, this.target)
      agent.Problem.clone(pid, this.target)
        .then(resp => {
          console.log(resp.data.data)
        })
        .catch(() => this.$alertFail('複製主題失敗'))
        .finally(() => (this.isLoading = false))
    },
    deleteProblem(pid) {
      const result = window.confirm('確認要刪除嗎？')
      if (result) {
        this.$emit('delete-problem', pid)
      }
    },
    ...mapActions({
      getCourses: ActionTypes.GET_COURSES,
    }),
  },
}
</script>
