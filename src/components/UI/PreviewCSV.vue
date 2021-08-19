<template>
  <v-data-table
    v-if="headers"
    :headers="headers"
    :items="items"
    :search="searchText"
    :items-per-page="Number(-1)"
    hide-default-footer
  />
  <pre v-else>
    {{ errors }}
  </pre>
</template>

<script>
import Papa from 'papaparse'

export default {
  props: {
    data: {
      required: true,
    },
  },
  data: () => ({
    headers: null,
    items: null,
    searchText: '',
    errors: '',
  }),
  watch: {
    data: {
      handler() {
        if (!this.data) {
          this.headers = null
          return
        }
        Papa.parse(this.data, {
          header: true,
          complete: results => {
            this.headers = results.meta.fields.map(col => ({
              text: col,
              value: col,
            }))
            this.items = results.data
          },
          error: errors => {
            this.headers = null
            this.errors = JSON.stringify(errors, null, 2)
            this.$rollbar.error('[components/PreviewCSV/Papa.parse]', errors)
          },
        })
      },
      immediate: true,
    },
  },
}
</script>
