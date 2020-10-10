<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :search="searchText"
    :items-per-page="Number(-1)"
    hide-default-footer
    :loading="loading"
  >
    <template v-slot:[`item.title`]="{ item }">
      <router-link to="#">{{ item.title }}</router-link>
    </template>
    <template v-slot:[`item.tags`]="{ item }">
      <v-chip
        v-for="tag in item.tags"
        :key="tag"
        color="primary"
        small
        class="mx-1"
      >
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
  name: 'ProblemList',

  props: {
    data: {
      type: Array,
      required: true,
    },
    searchText: {
      type: String,
      required: true,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },

  data: () => ({
    headers,
  }),
}
</script>
