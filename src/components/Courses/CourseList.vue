<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :items-per-page="Number(-1)"
    hide-default-footer
    :loading="loading"
    class="table"
    @click:row="handleRowClick"
  >
    <template v-slot:[`header.status`]="{ header }">
      {{ header.text }}
      <v-tooltip top>
        <template v-slot:activator="{ on, attrs }">
          <v-icon class="ml-1" color="primary" small v-bind="attrs" v-on="on">
            mdi-help-circle
          </v-icon>
        </template>
        <span>開放課程：任何人皆可在此課程進行創作<br />公開課程：任何人皆可檢視內容</span>
      </v-tooltip>
    </template>
    <template v-slot:[`item.semester`]="{ item }">
      {{ item.year ? `${item.year}-${item.semester}` : '' }}
    </template>
    <template v-slot:[`item.status`]="{ item }">
      {{ COURSE_STATUS[`${item.status}`] }}
    </template>
    <template v-slot:[`item.teacher`]="{ item }">
      <router-link :to="{ name: 'profile', params: { username: item.teacher.username } }">
        {{ item.teacher.displayName }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
import { COURSE_STATUS } from '@/constants/course'
import { mapState } from 'vuex'

const headers = [
  { text: '課程', value: 'name' },
  { text: '學期', value: 'semester' },
  { text: '狀態', value: 'status', sortable: false },
  { text: '教師', value: 'teacher' },
]
export default {
  name: 'CourseList',

  props: {
    data: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    ...mapState({
      username: state => state.auth.username,
      role: state => state.auth.role,
    }),
  },

  data: () => ({
    COURSE_STATUS,
    headers,
  }),

  methods: {
    handleRowClick(value) {
      this.$router.push({ name: 'course', params: { name: value.name } })
    },
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
