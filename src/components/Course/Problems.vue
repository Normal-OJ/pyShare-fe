<template>
  <v-container fluid class="d-flex flex-column pt-4 px-8">
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
      <v-btn color="success">
        <v-icon>mdi-plus</v-icon>
        新增主題
      </v-btn>
    </div>

    <v-data-table
      :headers="headers"
      :items="data"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
    >
      <template v-slot:[`item.title`]="{ item }">
        <router-link :to="{ name: 'courseProblem', params: { id: item.id } }">
          {{ item.title }}
        </router-link>
      </template>
      <template v-slot:[`item.tags`]="{ item }">
        <v-chip v-for="tag in item.tags" :key="tag" color="primary" small class="mx-1">
          {{ tag }}
        </v-chip>
      </template>
      <template v-slot:[`item.author`]="{ item }">
        <router-link to="#">{{ item.author.displayName }}</router-link>
      </template>
      <template v-slot:[slotName] v-for="slotName in ['no-data', 'no-results']">
        <v-row justify="center" :key="slotName">
          <v-col cols="6">
            <v-img src="http://fakeimg.pl/400x300?text=No Result" />
          </v-col>
        </v-row>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
const headers = [
  { text: '題號', value: 'id' },
  { text: '標題', value: 'title', sortable: false },
  { text: '分類', value: 'tags', sortable: false },
  { text: '累積創作數', value: 'creations' },
  { text: '作者', value: 'author', sortable: false },
]

export default {
  name: 'Problems',

  props: {
    data: {
      type: Array,
      required: true,
    },
    tags: {
      type: Array,
      default: () => ['趕快串 API', '喔喔喔'],
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
}
</script>
