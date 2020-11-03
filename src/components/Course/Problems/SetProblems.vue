<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <Form :availableTags="availableTags" :prob.sync="newProb" @submit="submit" />
      </v-col>
      <v-col cols="12" class="problem">
        <div class="text-body-1">預覽</div>
        <Problem :prob="newProb" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import Form from './Form'
import _ from 'lodash'

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

  data() {
    return {
      newProb: _.cloneDeep(this.prob),
    }
  },

  methods: {
    submit() {
      this.$emit('submit', this.newProb)
    },
  },
}
</script>
