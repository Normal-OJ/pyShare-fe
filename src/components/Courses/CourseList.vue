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
    <template v-slot:[`item.semester`]="{ item }">
      {{ item.year ? `${item.year}-${item.semester}` : '' }}
    </template>
    <template v-slot:[`item.teacher`]="{ item }">
      <router-link :to="{ name: 'profile', params: { username: item.teacher.username } }">
        {{ item.teacher.displayName }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
const headers = [
  { text: '課程', value: 'name' },
  { text: '學期', value: 'semester' },
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

  data: () => ({
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
