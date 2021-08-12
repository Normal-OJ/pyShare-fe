<template>
  <v-container fluid>
    <div class="text-h5">公開資料集</div>
    <div class="d-flex align-center">
      <v-col cols="10" md="6" class="d-flex">
        <v-select
          v-model="selectedTags"
          class="mr-3"
          label="選擇分類"
          outlined
          hide-details
          :items="tags"
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
      <v-btn v-if="canCreateAttachment" color="success">
        <v-icon class="mr-1">mdi-plus</v-icon>
        新增資料集
      </v-btn>
    </div>

    <v-data-table
      v-model="selectedAttachments"
      :headers="headers"
      :items="attachments"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="!attachments"
      show-select
      show-expand
    >
      <template v-slot:item.filename="{ item }">
        <div class="d-flex align-center py-3">
          <Gravatar :size="40" :md5="item.author.md5" />
          <div class="ml-4 d-flex flex-column">
            <div class="d-flex text-h6">{{ item.filename }}</div>
            <div class="d-flex text-body-2">
              <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
                {{ item.author.displayName }}
              </router-link>
              &nbsp;·&nbsp;
              {{ `更新於 ${$timeFromNow($dayjs(item.updated).unix())}` }}
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
            <v-btn color="primary" icon v-on="on" v-bind="attrs" class="mr-3">
              <v-icon>mdi-import</v-icon>
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
              @click="downloadAttachment(item.id)"
            >
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>下載檔案</span>
        </v-tooltip>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length" class="py-6 px-8">
          <v-chip color="primary text-body-2 my-2" label small>詳細資訊</v-chip>
          <div class="ml-3">{{ item.description }}</div>
          <v-chip color="primary text-body-2 my-2" label small>版本備註</v-chip>
          <div class="ml-3 mb-2">
            <ul>
              <li v-for="(note, index) in item.patchNotes.slice().reverse()" :key="index">
                版本 {{ item.patchNotes.length - index }}：
                <span v-if="note">{{ note }}</span>
                <span v-else class="gray-text">沒有留下備註</span>
              </li>
            </ul>
          </div>
          <div class="ml-3">最後更新時間：{{ $formattedTime($dayjs(item.updated).unix()) }}</div>
          <div class="ml-3">資料建立時間：{{ $formattedTime($dayjs(item.created).unix()) }}</div>
        </td>
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <div class="d-flex flex-column align-center" :key="slotName">
          <div class="text-subtitle-1 my-8">這裡還沒有任何資料集，或找不到符合條件的資料集</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import ColorLabel from '@/components/UI/ColorLabel.vue'
import Gravatar from '@/components/UI/Gravatar.vue'
import { formatBytes } from '@/lib/utils'
import { mapState } from 'vuex'
import { ROLE } from '@/constants/auth'

export default {
  components: { ColorLabel, Gravatar },

  data: () => ({
    selectedAttachments: [],
    attachments: undefined,
    searchText: '',
    selectedTags: [],
    tags: undefined,
  }),

  computed: {
    ...mapState({
      role: state => state.auth.role,
    }),
    headers() {
      return [
        { text: '資料集', value: 'filename' },
        { text: '分類', value: 'tags' },
        { text: '檔案大小', value: 'size' },
        { text: '操作', value: 'operation' },
        { text: '', value: 'data-table-expand' },
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
    selectTag(...args) {
      console.log(args)
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
    async downloadAttachment(id) {
      try {
        const { href } = this.$router.resolve(`/api/attachment/${id}`)
        window.open(href, '_blank')
      } catch (error) {
        this.$rollbar('[views/Attachments/downloadAttachment]', error)
      }
    },
  },
}
</script>

<style></style>
