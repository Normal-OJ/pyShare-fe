<template>
  <!-- TODO -->
  <!-- ADD -->
  <!-- SEARCH -->
  <!-- FEATURE -->
  <v-simple-table>
    <template v-slot:default>
      <tbody>
        <!-- TODO: is it needed to show (preview) the entire csv file? -->
        <tr v-for="(row, idx) in csvFile" :key="idx">
          <td v-for="(data, idx2) in row" :key="idx2">{{ data }}</td>
        </tr>
      </tbody>
    </template>
  </v-simple-table>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'string',
    },
    data: {
      required: true,
    },
  },

  computed: {
    csvFile() {
      if (this.type === 'array') return this.data
      return this.data.split('\n').map(row => row.split(','))
    },
  },
}
</script>
