<template>
  <v-container fluid style="padding-bottom: 100px">
    <div class="text-h5 mb-2">公開資料集</div>
    <v-row no-gutters align="center">
      <v-col cols="12" md="6" class="d-flex">
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
          <template v-slot:selection="{ item }">
            <ColorLabel :tag="item" small class="mt-2 mr-1" />
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
        <v-switch v-model="onlyShowMine" label="顯示我上傳的資料集" class="mr-3" />
        <CreateDatasetModel :tags="tags" @submit="createAttachment" />
      </template>
    </v-row>

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
      <template v-slot:item.filename="{ item }">
        <div class="d-flex align-center py-3" style="max-width: 400px; word-break: break-all">
          <Gravatar :size="40" :md5="item.author.md5" />
          <div class="ml-4 d-flex flex-column">
            <div class="d-flex text-h6">{{ item.filename }}</div>
            <div class="d-flex text-body-2">
              <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
                {{ item.author.displayName }}
              </router-link>
              &nbsp;·&nbsp;{{ `更新於 ${$timeFromNow($dayjs(item.updated).unix())}` }}
            </div>
          </div>
        </div>
      </template>
      <template v-slot:[`item.tags`]="{ item }">
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
      <template v-slot:item.size="{ item }">
        {{ item.formattedSize }}
      </template>
      <template v-slot:item.operation="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              icon
              v-on="on"
              v-bind="attrs"
              class="mr-2"
              @click="cloneDataset(item)"
            >
              <v-icon>mdi-table-arrow-right</v-icon>
            </v-btn>
          </template>
          <span>引用至主題</span>
        </v-tooltip>
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              icon
              v-on="on"
              v-bind="attrs"
              class="mr-2"
              @click="downloadDataset(item.id)"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>下載檔案</span>
        </v-tooltip>
        <v-menu v-if="item.author.id === userId" bottom right>
          <template v-slot:activator="{ on, attrs }">
            <v-btn icon v-on="on" v-bind="attrs">
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
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-6 px-8">
          <v-row>
            <v-col cols="12" md="8">
              <v-chip class="mb-2 text-body-2" color="primary" label small>資料內容</v-chip>
              <div style="white-space: pre">{{ item.description }}</div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="mb-2">
                <v-chip class="text-body-2" color="primary" label small>版本備註</v-chip>
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="ml-3" color="primary" small v-bind="attrs" v-on="on">
                      mdi-help-circle
                    </v-icon>
                  </template>
                  <span>當資料的上傳者更新此資料時，可以留下更新的備註呈現於此</span>
                </v-tooltip>
              </div>
              <div>
                <ul>
                  <li v-for="(note, index) in item.patchNotes.slice(1).reverse()" :key="index">
                    版本
                    {{
                      `${item.patchNotes.length - index - 1} → ${item.patchNotes.length - index}`
                    }}
                    <span v-if="note" style="white-space: pre">{{ note }}</span>
                    <span v-else class="gray-text">沒有留下備註</span>
                  </li>
                </ul>
                <span v-if="item.patchNotes.length === 1">此資料沒有其他版本</span>
              </div>
              <div>最後更新時間：{{ $formattedTime($dayjs(item.updated).unix()) }}</div>
              <div>資料建立時間：{{ $formattedTime($dayjs(item.created).unix()) }}</div>
            </v-col>
          </v-row>
        </td>
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <div class="d-flex flex-column align-center" :key="slotName">
          <div class="text-subtitle-1 my-8">這裡還沒有任何資料集，或找不到符合條件的資料集</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
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
  </v-container>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel.vue'
import Gravatar from '@/components/UI/Gravatar.vue'
import CreateDatasetModel from '@/components/Datasets/CreateDatasetModal.vue'
import EditDatasetModal from '@/components/Datasets/EditDatasetModal.vue'
import CloneDatasetModal from '@/components/Datasets/CloneDatasetModal.vue'
import { formatBytes } from '@/lib/utils'
import { mapState } from 'vuex'
import { ROLE } from '@/constants/auth'

export default {
  components: { ColorLabel, Gravatar, CreateDatasetModel, EditDatasetModal, CloneDatasetModal },

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
  }),

  computed: {
    ...mapState({
      userId: state => state.auth.id,
      role: state => state.auth.role,
    }),
    filteredAttachments() {
      if (!this.attachments) return []
      const attFilteredByTags = this.attachments.filter(att =>
        this.selectedTags.every(tag => att.tags.includes(tag)),
      )
      if (this.onlyShowMine) {
        return attFilteredByTags.filter(att => att.author.id === this.userId)
      }
      return attFilteredByTags
    },
    headers() {
      return [
        { text: '資料集', value: 'filename', sortable: false },
        { text: '分類', value: 'tags', sortable: false },
        { text: '檔案大小', value: 'size' },
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
        this.attachments = data.data.map(item => ({
          ...item,
          formattedSize: formatBytes(item.size),
        }))
      } catch (error) {
        this.$rollbar('[views/Attachments/getAttachments]', error)
      }
    },
    async getTags() {
      try {
        const { data } = await this.$agent.Tag.getList()
        this.tags = data.data
      } catch (error) {
        this.$rollbar('[views/Attachments/getTags]', error)
      }
    },
    cloneDataset(dataset) {
      this.cloningDatasets = [dataset]
      this.cloneDialog = true
    },
    async downloadDataset(id) {
      try {
        const { href } = this.$router.resolve(`/api/attachment/${id}`)
        window.open(href, '_blank')
      } catch (error) {
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
