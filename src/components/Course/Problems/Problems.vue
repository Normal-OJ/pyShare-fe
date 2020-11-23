<template>
  <v-container fluid class="d-flex flex-column px-8">
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
    >
      <template v-slot:[`item.title`]="{ item }">
        <router-link :to="{ name: 'courseProblem', params: { id: item.pid } }">
          {{ item.title }}
        </router-link>
      </template>
      <template v-slot:[`item.tags`]="{ item }">
        <v-chip v-for="tag in item.tags" :key="tag" color="primary" small class="mx-1">
          {{ tag }}
        </v-chip>
      </template>
      <template v-slot:[`item.creations`]="{ item }">
        {{ item.comments.length }}
      </template>
      <template v-slot:[`item.author`]="{ item }">
        <router-link :to="{ name: 'profile', params: { username: item.author.username } }">
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
const headers = [
  { text: '題號', value: 'pid' },
  { text: '標題', value: 'title', sortable: false },
  { text: '分類', value: 'tags', sortable: false },
  { text: '累積創作數', value: 'creations' },
  { text: '作者', value: 'author', sortable: false },
]

export default {
  name: 'Problems',

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
      default: false,
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
      this.$emit('getProblemsByTags', paramsWithTags)
    },
  },
}
</script>
