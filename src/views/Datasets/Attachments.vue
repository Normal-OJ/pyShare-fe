<template>
  <v-container
    fluid
    style="padding-bottom: 100px"
  >
    <div class="text-h5 mb-2">
      公開資料集
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
      <template v-if="canCreateAttachment">
        <v-switch
          v-model="onlyShowMine"
          label="顯示我上傳的資料集"
          class="mr-3"
        />
        <CreateDatasetModel
          :tags="tags"
          @submit="createAttachment"
        />
      </template>
    </v-row>

    <div class="text-body-2">
      使用勾選可以一次複製多個資料集
    </div>

    <v-data-table
      v-model="selectedDatasets"
      :headers="headers"
      :items="filteredAttachments"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="!attachments"
      item-key="id"
      show-select
      show-expand
    >
      <template #item.size="{ item }">
        <div
          class="d-flex align-center py-3"
          style="max-width: 400px; word-break: break-all"
        >
          <Gravatar
            :size="40"
            :md5="item.author.md5"
          />
          <div class="ml-4 d-flex flex-column">
            <div class="d-flex text-h6">
              {{ item.filename }}
            </div>
            <div class="d-flex text-body-2">
              <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
                {{ item.author.displayName }}
              </router-link>
              &nbsp;·&nbsp;{{ `更新於 ${$timeFromNow(item.updated)}` }}&nbsp;·&nbsp;{{
                item.formattedSize
              }}
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
              class="mr-2"
              v-on="on"
              @click="preview = { dialog: true, id: item.id, filename: item.filename }"
            >
              <v-icon>mdi-eye</v-icon>
            </v-btn>
          </template>
          <span>預覽資料</span>
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              icon
              v-bind="attrs"
              class="mr-2"
              v-on="on"
              @click="cloneDataset([item])"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>複製這份資料</span>
        </v-tooltip>
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn
              color="primary"
              icon
              v-bind="attrs"
              class="mr-2"
              v-on="on"
              @click="downloadDataset(item.id)"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>下載檔案</span>
        </v-tooltip>
        <v-menu
          v-if="item.author.id === userId"
          bottom
          right
        >
          <template #activator="{ on, attrs }">
            <v-btn
              icon
              v-bind="attrs"
              v-on="on"
            >
              <v-icon>mdi-dots-horizontal</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item @click="editingDataset = item">
              <v-list-item-title>編輯</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteDataset(item.id)">
              <v-list-item-title>刪除</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
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
                資料內容
              </v-chip>
              <div style="white-space: pre">
                {{ item.description }}
              </div>
            </v-col>
            <v-col
              cols="12"
              md="4"
            >
              <div class="mb-2">
                <v-chip
                  class="text-body-2"
                  color="primary"
                  label
                  small
                >
                  版本備註
                </v-chip>
                <v-tooltip right>
                  <template #activator="{ on, attrs }">
                    <v-icon
                      class="ml-3"
                      color="primary"
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-help-circle
                    </v-icon>
                  </template>
                  <span>當資料的上傳者更新此資料時，可以留下更新的備註呈現於此</span>
                </v-tooltip>
              </div>
              <div>
                <ul>
                  <li
                    v-for="(note, index) in item.patchNotes.slice(1).reverse()"
                    :key="index"
                  >
                    版本
                    {{
                      `${item.patchNotes.length - index - 1} → ${item.patchNotes.length - index}`
                    }}
                    <span
                      v-if="note"
                      style="white-space: pre"
                    >{{ note }}</span>
                    <span
                      v-else
                      class="gray-text"
                    >沒有留下備註</span>
                  </li>
                </ul>
                <span v-if="item.patchNotes.length === 1">此資料沒有其他版本</span>
              </div>
              <div>最後更新時間：{{ $formattedTime(item.updated) }}</div>
              <div>資料建立時間：{{ $formattedTime(item.created) }}</div>
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
            這裡還沒有任何資料集，或找不到符合條件的資料集
          </div>
          <v-img
            :src="require('@/assets/images/noData.svg')"
            max-width="600"
            contain
          />
        </div>
      </template>
    </v-data-table>

    <EditDatasetModal
      :open="!!editingDataset"
      :tags="tags"
      :dataset="editingDataset"
      @close="editingDataset = null"
      @submit="editAttachment"
    />

    <CloneDatasetModal
      :open="cloneDialog"
      :datasets="cloningDatasets"
      @close="cloneDialog = false"
    />

    <v-tooltip top>
      <template #activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            v-show="selectedDatasets.length > 0"
            class="mb-12"
            absolute
            bottom
            fab
            dark
            v-bind="attrs"
            color="primary"
            style="left: 50%"
            v-on="on"
            @click="cloneDataset(selectedDatasets)"
          >
            <v-icon>mdi-content-copy</v-icon>
          </v-btn>
        </v-fab-transition>
      </template>
      <span>複製已選擇的資料</span>
    </v-tooltip>
    <PreviewDatasetModal
      :id="preview.id"
      v-model="preview.dialog"
      :filename="preview.filename"
      @close="preview = { dialog: false, id: null, filename: null }"
    />
  </v-container>
</template>

<script>
import CreateDatasetModel from '@/components/Datasets/CreateDatasetModal.vue'
import { formatBytes } from '@/lib/utils'
import { mapState } from 'vuex'
import { ROLE } from '@/constants/auth'
import { TAG_CATES } from '@/constants/tag'

export default {
  components: { CreateDatasetModel },

  data: () => ({
    selectedDatasets: [],
    attachments: null,
    searchText: '',
    selectedTags: [],
    tags: null,
    onlyShowMine: false,
    editingDataset: null,
    cloneDialog: false,
    cloningDatasets: [],
    preview: {
      dialog: false,
      id: null,
      filename: null,
    },
  }),

  computed: {
    ...mapState({
      userId: (state) => state.auth.id,
      role: (state) => state.auth.role,
    }),
    filteredAttachments() {
      if (!this.attachments) return []
      const attFilteredByTags = this.attachments.filter((att) =>
        this.selectedTags.every((tag) => att.tags.includes(tag)),
      )
      if (this.onlyShowMine) {
        return attFilteredByTags.filter((att) => att.author.id === this.userId)
      }
      return attFilteredByTags
    },
    headers() {
      return [
        { text: '資料集', value: 'size' },
        { text: '分類', value: 'tags', sortable: false },
        { text: '複製次數', value: 'quoteCount' },
        { text: '操作', value: 'operation', sortable: false, filterable: false },
        { text: '', value: 'data-table-expand', sortable: false, filterable: false },
      ]
    },
    canCreateAttachment() {
      return this.role === ROLE.ADMIN || this.role === ROLE.TEACHER
    },
  },

  created() {
    this.getAttachments()
    this.getTags()
  },

  methods: {
    selectTag(tag) {
      if (!this.selectedTags.includes(tag)) {
        this.selectedTags.push(tag)
      }
    },
    async getAttachments() {
      try {
        const { data } = await this.$agent.Dataset.getList()
        this.attachments = data.data.map((item) => ({
          ...item,
          formattedSize: formatBytes(item.size),
        }))
      } catch (error) {
        this.$rollbar('[views/Attachments/getAttachments]', error)
      }
    },
    async getTags() {
      try {
        const { data } = await this.$agent.Tag.getList({ category: TAG_CATES.NORMAL_PROBLEM })
        this.tags = data.data
      } catch (error) {
        this.$rollbar('[views/Attachments/getTags]', error)
      }
    },
    cloneDataset(datasets) {
      this.cloningDatasets = datasets
      this.cloneDialog = true
    },
    async downloadDataset(id) {
      try {
        this.$agent.Dataset.downloadFile(id)
      } catch (error) {
        this.$alertSuccess('下載過程發生錯誤')
        this.$rollbar('[views/Attachments/downloadDataset]', error)
      }
    },
    async createAttachment(body, resolve, reject) {
      try {
        await this.$agent.Dataset.create(body)
        resolve()
        this.getAttachments()
      } catch (error) {
        reject()
        this.$rollbar('[views/Attachments/createAttachment]', error)
      }
    },
    async editAttachment(id, body, resolve, reject) {
      try {
        await this.$agent.Dataset.modify(id, body)
        resolve()
        this.getAttachments()
      } catch (error) {
        reject()
        this.$rollbar('[views/Attachments/createAttachment]', error)
      }
    },
    async deleteDataset(id) {
      try {
        const result = window.confirm('確認要刪除嗎？')
        if (result) {
          await this.$agent.Dataset.delete(id)
          this.$alertSuccess('刪除資料集成功')
          this.getAttachments()
        }
      } catch (error) {
        this.$rollbar('[views/Attachments/deleteDataset]', error)
        this.$alertSuccess('刪除資料集失敗')
      }
    },
  },
}
</script>

<style></style>
