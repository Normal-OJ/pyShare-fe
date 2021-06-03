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
        <Problem :prob="previewProb" isPreview />
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import { mapGetters } from 'vuex'
import { GetterTypes } from '@/store/getter-types'

export default {
  components: { Problem },

  props: {
    prob: {
      type: Object,
      required: true,
    },
  },

  computed: {
    ...mapGetters({
      userInfo: GetterTypes.USER_INFO,
    }),
    previewProb() {
      return {
        author: this.userInfo,
        ...this.prob,
      }
    },
  },

  data: () => ({
    dialog: false,
  }),
}
</script>
