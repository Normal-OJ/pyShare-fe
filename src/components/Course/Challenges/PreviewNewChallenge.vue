<template>
  <v-dialog v-model="dialog" persistent width="80vw">
    <template v-slot:activator="{ on, attrs }">
      <v-btn color="primary" outlined v-bind="attrs" v-on="on">
        <v-icon class="mr-1">mdi-eye</v-icon>
        預覽
      </v-btn>
    </template>

    <v-card>
      <v-toolbar dark color="primary" dense>
        <v-toolbar-title>預覽</v-toolbar-title>
        <v-spacer />
        <v-toolbar-items>
          <v-btn icon dark @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar-items>
      </v-toolbar>

      <v-card-text class="mt-8 text--primary">
        <Challenge :prob="prob" isPreview />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Challenge from '@/components/Course/Challenge/Challenge'

export default {
  components: { Challenge },

  props: {
    prob: {
      type: Object,
      required: true,
    },
  },

  data: () => ({
    dialog: false,
  }),
}
</script>
