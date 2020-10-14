<template>
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
        v-model="search"
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
</template>

<script>
const tags = ['a', 'b', 'c']

export default {
  name: 'ProblemFilter',

  props: {
    selectedTags: {
      type: Array,
      required: true,
    },
    searchText: {
      type: String,
      required: true,
    },
  },

  computed: {
    search: {
      get() {
        return this.searchText
      },
      set(value) {
        this.$emit('update:searchText', value)
      },
    },
  },

  data: () => ({
    tags,
  }),
}
</script>
