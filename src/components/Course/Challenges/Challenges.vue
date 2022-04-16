<template>
  <v-container fluid>
    <div class="text-h5">
      測驗
    </div>
    <div class="d-flex align-center">
      <v-col
        cols="10"
        md="6"
        class="d-flex"
      >
        <v-select
          v-model="selectedTags"
          class="mr-3"
          label="選擇分類"
          outlined
          hide-details
          :items="tags"
          multiple
          dense
        >
          <template #selection="{ item }">
            <ColorLabel
              :tag="item"
              small
              class="mt-2 mr-1"
            />
          </template>
        </v-select>
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
      <template v-if="canWriteCourse">
        <v-switch
          v-model="isManageEnabled"
          color="primary"
          class="mr-3"
          label="開啟管理介面"
        />
        <v-btn
          color="success"
          :to="{ name: 'courseSetChallenges', params: { operation: 'new' } }"
        >
          <v-icon class="mr-1">
            mdi-plus
          </v-icon>
          新增測驗
        </v-btn>
      </template>
    </div>

    <v-data-table
      :headers="headers"
      :items="challenges"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
    >
      <template #item.pid="{ value, item }">
        <div class="d-flex align-center">
          <ProblemStatusIcon :acceptance="item.acceptance" />
          <span class="ml-1">{{ value }}</span>
        </div>
      </template>
      <template #item.title="{ item }">
        <router-link :to="{ name: 'courseChallenge', params: { pid: item.pid } }">
          {{ item.title }}
        </router-link>
        <v-tooltip bottom>
          <template #activator="{ on, attrs }">
            <v-icon
              class="ml-1"
              small
              v-bind="attrs"
              v-on="on"
            >
              {{ isOffline(item) ? 'mdi-eye-off' : 'mdi-eye' }}
            </v-icon>
          </template>
          <span>{{ isOffline(item) ? '對學生隱藏中' : '對學生顯示中' }}</span>
        </v-tooltip>
        <template v-if="canWriteCourse && item.isTemplate">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-icon
                class="ml-2"
                small
                v-bind="attrs"
                color="primary"
                v-on="on"
              >
                mdi-earth
              </v-icon>
            </template>
            <span>已發布於共享資源</span>
          </v-tooltip>
        </template>
      </template>
      <template #[`item.tags`]="{ item }">
        <ColorLabel
          v-for="tag in item.tags"
          :key="tag"
          :tag="tag"
          small
          class="ma-1"
          style="cursor: pointer"
          @click.native="selectTag(tag)"
        />
      </template>
      <template #[`item.manage`]="{ item }">
        <v-menu
          bottom
          right
        >
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              class="hidden-lg-and-up"
              v-on="on"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="toggleStatus(item.pid, isOffline(item) ? 1 : 0)">
              <v-list-item-title>{{ isOffline(item) ? '顯示' : '隱藏' }}</v-list-item-title>
            </v-list-item>
            <v-list-item
              :to="{
                name: 'courseSetChallenges',
                params: { operation: 'edit' },
                query: { pid: item.pid },
              }"
            >
              <v-list-item-title>編輯</v-list-item-title>
            </v-list-item>
            <v-list-item @click="openCloneDialog(item.pid)">
              <v-list-item-title>複製</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteProblem(item.pid)">
              <v-list-item-title>刪除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
        <div class="hidden-md-and-down">
          <v-btn
            class="mx-1"
            color="primary"
            small
            :loading="isToggling === item.pid"
            @click="toggleStatus(item.pid, isOffline(item) ? 1 : 0)"
          >
            <span>{{ isOffline(item) ? '顯示' : '隱藏' }}</span>
          </v-btn>
          <v-btn
            :to="{
              name: 'courseSetChallenges',
              params: { operation: 'edit' },
              query: { pid: item.pid },
            }"
            class="mx-1"
            color="primary"
            small
          >
            <v-icon
              class="mr-1"
              small
            >
              mdi-pencil
            </v-icon>
            <span>編輯</span>
          </v-btn>
          <v-btn
            class="mx-1"
            color="primary"
            small
            @click="openCloneDialog(item.pid)"
          >
            <v-icon
              class="mr-1"
              small
            >
              mdi-content-copy
            </v-icon>
            <span>複製</span>
          </v-btn>
          <v-btn
            class="mx-1"
            color="error"
            small
            @click="deleteProblem(item.pid)"
          >
            <v-icon
              class="mr-1"
              small
            >
              mdi-trash-can
            </v-icon>
            <span>刪除</span>
          </v-btn>
        </div>
      </template>
      <template
        v-for="slotName in ['no-data', 'no-results']"
        #[slotName]
      >
        <div
          :key="slotName"
          class="d-flex flex-column align-center"
        >
          <template v-if="error">
            <div class="text-subtitle-1 my-8">
              載入測驗失敗
            </div>
            <v-btn
              color="error"
              text
              @click="$emit('refetch-problems')"
            >
              重試
            </v-btn>
          </template>
          <template v-else>
            <div class="text-subtitle-1 my-8">
              這裡還沒有任何測驗，或找不到符合條件的測驗
            </div>
            <v-img
              :src="require('@/assets/images/noData.svg')"
              max-width="600"
              contain
            />
          </template>
        </div>
      </template>
    </v-data-table>

    <CloneProblemModal
      :is-open="!!clonePid"
      :clone-pid="clonePid"
      label="測驗"
      :default-course-id="$route.params.id"
      @success="handleCloneSuccess"
      @close="clonePid = null"
    />
  </v-container>
</template>

<script>
import { canWriteCourseMixin } from '@/lib/permissionMixin'

export default {
  name: 'Challenges',

  mixins: [canWriteCourseMixin],

  props: {
    challenges: {
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
    error: {
      type: Boolean,
      required: true,
    },
    isToggling: {
      type: Number,
      default: null,
    },
  },

  data: () => ({
    searchText: '',
    clonePid: null,
    selectedTags: [],
    isManageEnabled: false,
  }),

  computed: {
    headers() {
      return [
        { text: '題號', value: 'pid' },
        { text: '標題', value: 'title', sortable: false },
        { text: '分類', value: 'tags', sortable: false },
        ...(this.isManageEnabled ? [{ text: '管理', value: 'manage', sortable: false }] : []),
      ]
    },
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
    unselectTag(tag) {
      this.selectedTags = this.selectedTags.filter((t) => t !== tag)
    },
    openCloneDialog(pid) {
      this.clonePid = pid
    },
    handleCloneSuccess() {
      this.$emit('refetch-problems')
      this.clonePid = null
    },
    deleteProblem(pid) {
      const result = window.confirm('確認要刪除嗎？')
      if (result) {
        this.$emit('delete-problem', pid)
      }
    },
    isOffline(problem) {
      return problem.hidden
    },
    toggleStatus(pid, status) {
      this.$emit('toggle-status', pid, status)
    },
  },
}
</script>
