<template>
  <v-container fluid>
    <div class="text-h5">公開主題</div>
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
    </div>

    <v-data-table
      :headers="headers"
      :items="problems"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
    >
      <template v-slot:[`item.title`]="{ item }">
        <router-link :to="{ name: 'templateProblem', params: { pid: item.pid } }">
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
      <template v-slot:[`item.author.displayName`]="{ item }">
        <router-link :to="{ name: 'profile', params: { id: item.author.id } }">
          {{ item.author.displayName }}
        </router-link>
      </template>
      <template v-slot:item.operation="{ item }">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" icon v-on="on" v-bind="attrs" @click="copyProblem(item.pid)">
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </template>
          <span>複製主題</span>
        </v-tooltip>
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

  data: () => ({
    searchText: '',
    selectedTags: [],
  }),

  computed: {
    headers() {
      return [
        { text: '題號', value: 'pid' },
        { text: '標題', value: 'title', sortable: false },
        { text: '分類', value: 'tags', sortable: false },
        { text: '作者', value: 'author.displayName', sortable: false },
        { text: '操作', value: 'operation', sortable: false, filterable: false },
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
      this.selectedTags = this.selectedTags.filter(t => t !== tag)
    },
    copyProblem(pid) {
      console.log(pid)
    },
  },
}
</script>
