<template>
  <v-simple-table>
    <template v-slot:default>
      <thead>
        <tr>
          <th v-for="header in headers" :key="header" class="text-left">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in data" :key="row.name">
          <td v-for="header in headers" :key="header" class="text-left">
            {{ row[header] }}
          </td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  name: 'CourseList',

  props: {
    data: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    headers: ['課程', '學期', '教師'],
  }),
}
</script>

<style>
</style>