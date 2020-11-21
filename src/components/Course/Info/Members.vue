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
      <AddStudentModal />
    </div>

    <v-data-table
      :headers="headers"
      :items="members"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
    >
      <template v-slot:[`item.author`]="{ item }">
        <router-link :to="{ name: 'profile', params: { username: item.author.username } }">
          {{ item.author.displayName }}
        </router-link>
      </template>
      <template v-slot:[`no-data`]>
        <div class="d-flex flex-column align-center">
          <div class="text-subtitle-1 my-8">這裡還沒有任何成員</div>
          <v-img :src="require('@/assets/images/noData.svg')" max-width="600" contain />
        </div>
      </template>
      <template v-slot:[`no-results`]>
        <div class="d-flex flex-column align-center">
          <div class="text-subtitle-1 my-8">找不到符合條件的成員</div>
          <v-img :src="require('@/assets/images/noResults.svg')" max-width="600" contain />
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import AddStudentModal from './AddStudentModal'

const headers = [
  { text: '使用者名稱', value: 'username' },
  { text: '暱稱', value: 'displayName' },
]

export default {
  name: 'MemberList',

  components: { AddStudentModal },

  props: {
    members: {
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
