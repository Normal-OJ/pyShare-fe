<template>
  <v-container fluid>
    <div class="text-h5 mb-2">
      公開主題
    </div>
    <v-row
      no-gutters
      align="center"
    >
      <v-col
        cols="12"
        md="6"
        class="d-flex"
      >
        <v-select
          v-model="selectedTags"
          class="mr-3"
          label="選擇分類"
          outlined
          hide-details
          :items="tags || []"
          :loading="!tags"
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
      <v-switch
        v-model="onlyShowMine"
        label="只顯示我的主題"
        class="mr-3"
      />
    </v-row>

    <div class="text-body-2">
      使用勾選可以一次複製多個主題
    </div>

    <v-data-table
      v-model="selectedProblems"
      :headers="headers"
      :items="filteredProblems"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="!problems"
      item-key="pid"
      style="width: 100%"
      show-select
      show-expand
    >
      <template #item.title="{ item }">
        <div class="d-flex align-center py-3">
          <Gravatar
            :size="40"
            :md5="item.author.md5"
          />
          <div class="ml-4 d-flex flex-column">
            <div class="d-flex text-h6">
              {{ item.title }}
            </div>
            <div class="d-flex text-body-2">
              <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
                {{ item.author.displayName }}
              </router-link>
              &nbsp;·&nbsp;{{ $formattedTime(item.timestamp) }}
            </div>
          </div>
        </div>
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
      <template #item.operation="{ item }">
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              icon
              v-bind="attrs"
              v-on="on"
              @click="clonePid = item.pid"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>複製主題</span>
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              v-if="item.author.id === userId"
              color="primary"
              icon
              class="ml-1"
              :to="{
                name: 'courseSetProblems',
                params: { id: item.course, operation: 'edit' },
                query: { pid: item.pid },
              }"
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
          </template>
          <span>編輯</span>
        </v-tooltip>
      </template>
      <template #expanded-item="{ headers, item }">
        <td
          :colspan="headers.length"
          class="py-6 px-8"
        >
          <v-row>
            <v-col
              cols="12"
              md="8"
            >
              <v-chip
                class="mb-2 text-body-2"
                color="primary"
                label
                small
              >
                主題說明
              </v-chip>
              <div v-html="item.description" />
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <v-chip
                class="mb-2 text-body-2"
                color="primary"
                label
                small
              >
                附件
              </v-chip>
              <div>
                <AttachmentCard
                  v-for="{ filename } in item.attachments"
                  :key="filename"
                  :name="filename"
                  class="mr-1 mb-1"
                  @preview="preview = { dialog: true, pid: item.pid, filename }"
                  @download="$agent.Problem.downloadAttachment(item.pid, filename)"
                />
              </div>
            </v-col>
          </v-row>
        </td>
      </template>
      <template
        v-for="slotName in ['no-data', 'no-results']"
        #[slotName]
      >
        <div
          :key="slotName"
          class="d-flex flex-column align-center"
        >
          <div class="text-subtitle-1 my-8">
            這裡還沒有任何主題，或找不到符合條件的主題
          </div>
          <v-img
            :src="require('@/assets/images/noData.svg')"
            max-width="600"
            contain
          />
        </div>
      </template>
    </v-data-table>

    <PreviewAttachmentModal
      v-model="preview.dialog"
      :pid="preview.pid"
      :filename="preview.filename"
      @close="preview = { dialog: false, pid: null, filename: null }"
    />

    <CloneProblemModal
      :is-open="!!clonePid"
      :clone-pid="clonePid"
      label="主題"
      @success="clonePid = null"
      @close="clonePid = null"
    />

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            v-show="selectedProblems.length > 0"
            class="mb-12"
            absolute
            bottom
            fab
            dark
            v-bind="attrs"
            color="primary"
            style="left: 50%"
            v-on="on"
            @click="clonePid = selectedProblems.map((p) => p.pid)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>複製已選擇的主題</span>
    </v-tooltip>
  </v-container>
</template>

<script>
import { mapState } from 'vuex'
import { TAG_CATES } from '@/constants/tag'

export default {
  data: () => ({
    problems: null,
    selectedProblems: [],
    searchText: '',
    selectedTags: [],
    tags: null,
    clonePid: null,
    onlyShowMine: false,
    editingAttachment: null,
    preview: {
      dialog: false,
      pid: null,
      filename: null,
    },
  }),

  computed: {
    getProblemsParams() {
      return { count: -1, offset: 0, isTemplate: true }
    },
    ...mapState({
      userId: (state) => state.auth.id,
    }),
    filteredProblems() {
      if (!this.problems) return []
      const attFilteredByTags = this.problems.filter((att) =>
        this.selectedTags.every((tag) => att.tags.includes(tag)),
      )
      if (this.onlyShowMine) {
        return attFilteredByTags.filter((att) => att.author.id === this.userId)
      }
      return attFilteredByTags
    },
    headers() {
      return [
        { text: '題號', value: 'pid' },
        { text: '主題', value: 'title', sortable: false },
        { text: '分類', value: 'tags', sortable: false },
        { text: '操作', value: 'operation', sortable: false, filterable: false },
        { text: '', value: 'data-table-expand', sortable: false, filterable: false },
      ]
    },
  },

  watch: {
    selectedTags() {
      this.getProblemsByTags({ tags: this.selectedTags.join(',') })
    },
  },

  created() {
    Promise.all([this.getTemplateProblems(this.getProblemsParams), this.getTags()]).then(
      () => (this.isLoading = false),
    )
  },

  methods: {
    selectTag(tag) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
    },
    async getTemplateProblems(params) {
      try {
        const { data } = await this.$agent.Problem.getList(params)
        this.problems = data.data.filter((p) => p.extra._cls !== 'OJProblem')
      } catch (error) {
        this.$rollbar.error('[views/Datasets/Problems/getTemplateProblems]', error)
      }
    },
    async getTags() {
      try {
        const { data } = await this.$agent.Tag.getList({ category: TAG_CATES.NORMAL_PROBLEM })
        this.tags = data.data
      } catch (error) {
        this.$rollbar.error('[views/Datasets/Problems/getTags]', error)
      }
    },
    getProblemsByTags(paramsWithTags) {
      this.getTemplateProblems({ ...paramsWithTags, ...this.getProblemsParams })
    },
  },
}
</script>
