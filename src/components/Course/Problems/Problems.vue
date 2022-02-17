<template>
  <v-container fluid>
    <div class="text-h5">
      主題
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
      <template v-if="canParticipateCourse">
        <v-switch
          :value="isManageEnabled"
          color="primary"
          class="mr-3"
          label="開啟管理介面"
          @change="$emit('update:isManageEnabled', !!$event)"
        />
        <v-btn
          color="success"
          :to="{ name: 'courseSetProblems', params: { operation: 'new' } }"
        >
          <v-icon class="mr-1">
            mdi-playlist-plus
          </v-icon>
          新增主題
        </v-btn>
      </template>
    </div>

    <v-data-table
      :headers="headers"
      :items="problems"
      :search="searchText"
      :items-per-page="Number(-1)"
      item-key="pid"
      hide-default-footer
      :loading="loading"
      :custom-sort="customSort"
    >
      <template #item.pid="{ value, item }">
        <div class="d-flex align-center">
          <ProblemStatusIcon :acceptance="item.acceptance" />
          <span class="ml-1">{{ value }}</span>
        </div>
      </template>
      <template #[`item.title`]="{ item }">
        <router-link :to="{ name: 'courseProblem', params: { pid: item.pid } }">
          {{ item.title }}
        </router-link>
        <template v-if="item.status === 0">
          <v-tooltip bottom>
            <template #activator="{ on, attrs }">
              <v-icon
                class="ml-1"
                small
                v-bind="attrs"
                v-on="on"
              >
                mdi-minus-circle
              </v-icon>
            </template>
            <span>隱藏的主題</span>
          </v-tooltip>
        </template>
        <template v-if="item.isTemplate && canWriteCourse">
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
      <template #[`item.creations`]="{ item }">
        {{ item.comments.length }}
      </template>
      <template #[`item.author.displayName`]="{ item }">
        <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
          {{ item.author.displayName }}
        </router-link>
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
            :to="{
              name: 'courseSetProblems',
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
              {{
                isManageEnabled
                  ? '您目前沒有建立任何主題'
                  : '這裡還沒有任何主題，或找不到符合條件的主題'
              }}
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
      :default-course-id="$route.params.id"
      label="主題"
      @success="handleCloneSuccess"
      @close="clonePid = null"
    />
  </v-container>
</template>

<script>
import { canWriteCourseMixin, canParticipateCourseMixin } from '@/lib/permissionMixin'

export default {
  name: 'Problems',

  mixins: [canWriteCourseMixin, canParticipateCourseMixin],

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
    error: {
      type: Boolean,
      required: true,
    },
    isManageEnabled: {
      type: Boolean,
      required: true,
    },
  },

  data: () => ({
    searchText: '',
    selectedTags: [],
    clonePid: null,
  }),

  computed: {
    headers() {
      return [
        { text: '題號', value: 'pid' },
        { text: '標題', value: 'title', sortable: false },
        { text: '分類', value: 'tags', sortable: false },
        { text: '累積創作數', value: 'creations' },
        { text: '作者', value: 'author.displayName', sortable: false },
        ...(
          this.isManageEnabled ?
            [{ text: '管理', value: 'manage', sortable: false }] :
            []
        ),
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
  },
}
</script>
