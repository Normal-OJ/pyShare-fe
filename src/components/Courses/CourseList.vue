<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th v-for="{ label, key } in headers" :key="key" class="text-left">
            {{ label }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.name">
          <td v-for="{ key } in headers" :key="key" class="text-left">
            <router-link v-if="key === 'name'" :to="{ name: 'course', params: { name: row[key] } }">
              {{ row[key] }}
            </router-link>
            <router-link
              v-else-if="key === 'teacher'"
              :to="{ name: 'profile', params: { username: row[key].username } }"
            >
              {{ row[key].displayName }}
            </router-link>
            <span v-else>{{ row[key] }}</span>
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
const headers = [
  { label: '課程', key: 'name' },
  { label: '學期', key: 'semester' },
  { label: '教師', key: 'teacher' },
]

export default {
  name: 'CourseList',

  props: {
    data: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    headers,
  }),
}
</script>
