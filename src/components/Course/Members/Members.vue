<template>
  <v-container fluid class="d-flex flex-column pt-4 px-8">
    <div class="d-flex align-center">
      <v-col cols="10" md="6" class="d-flex">
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
        新增學生
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
  // { text: '編號', value: 'id' },
  { text: '使用者名稱', value: 'username' },
  { text: '暱稱', value: 'displayName' },
]

export default {
  name: 'MemberList',

  props: {
    data: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    headers,
    searchText: '',
    loading: false,
  }),
}
</script>
