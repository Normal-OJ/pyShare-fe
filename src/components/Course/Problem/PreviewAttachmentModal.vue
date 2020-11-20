<template>
  <v-dialog :value="true" persistent>
    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>預覽附件：{{ filename }}</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="$emit('download')">
            <v-icon>mdi-download</v-icon>
          </v-btn>
          <v-btn icon dark @click="$emit('close')">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>
      <v-card-text class="mt-8" style="overflow: scroll">
        <Spinner v-if="!displayFile" />
        <pre v-else>{{ displayFile }}</pre>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import agent from '@/api/agent'
import Spinner from '@/components/Spinner'

export default {
  props: {
    filename: {
      type: String,
      required: true,
    },
  },

  components: { Spinner },

  data: () => ({
    displayFile: null,
  }),

  async created() {
    await this.getFileData()
  },

  methods: {
    async getFileData() {
      const { data } = await agent.Problem.getAttachment(this.$route.params.id, this.filename)
      this.displayFile = data
    },
  },
}
</script>
