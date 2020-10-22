<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6" class="problem">
        <Problem :prob="prob" />
      </v-col>
      <v-col cols="12" md="6">
        <Form :availableTags="availableTags" :prob.sync="prob" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import Form from './Form'

export default {
  name: 'SetProblems',

  components: { Problem, Form },

  props: {
    prob: {
      type: Object,
      required: true,
    },
  },

  computed: {
    availableTags() {
      return ['A', 'B', 'C']
    },
    operation() {
      return this.$route.params.operation
    },
  },

  data: () => ({}),
}
</script>
