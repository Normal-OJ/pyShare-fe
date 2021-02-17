<template>
  <v-container fluid>
    <div class="text-h5">主題列表</div>
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
      <div v-permission="['ALL', 'COURSE']">
        <v-btn color="primary" :to="{ name: 'courseManageProblems' }" class="mr-3" outlined>
          管理我的主題
        </v-btn>
        <v-btn color="success" :to="{ name: 'courseSetProblems', params: { operation: 'new' } }">
          <v-icon class="mr-1">mdi-playlist-plus</v-icon>
          新增主題
        </v-btn>
      </div>
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
        <router-link :to="{ name: 'courseProblem', params: { id: item.pid } }">
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
          style="cursor: pointer"
          @click.native="selectTag(tag)"
        />
      </template>
      <template v-slot:[`item.creations`]="{ item }">
        {{ item.comments.length }}
      </template>
      <template v-slot:[`item.author.displayName`]="{ item }">
        <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
          {{ item.author.displayName }}
        </router-link>
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

const headers = [
  { text: '題號', value: 'pid' },
  { text: '標題', value: 'title', sortable: false },
  { text: '分類', value: 'tags', sortable: false },
  { text: '累積創作數', value: 'creations' },
  { text: '作者', value: 'author.displayName', sortable: false },
]

export default {
  name: 'Problems',

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

  data: () => ({
    headers,
    searchText: '',
    selectedTags: [],
  }),

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
      this.selectedTags = this.selectedTags.filter(t => t !== tag)
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
  },
}
</script>
