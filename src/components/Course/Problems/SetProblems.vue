<template>
  <v-container fluid class="pb-16">
    <v-row class="mb-4">
      <div class="text-h5">新增主題</div>
      <v-spacer />
      <PreviewNewProblem :prob="newProb" />
    </v-row>

    <Form :availableTags="tags" :prob.sync="newProb" @submit="submit" />
  </v-container>
</template>

<script>
import PreviewNewProblem from '@/components/Course/Problems/PreviewNewProblem'
import Form from './Form'
import _ from 'lodash'

export default {
  name: 'SetProblems',

  components: { PreviewNewProblem, Form },

  props: {
    prob: {
      type: Object,
      required: true,
    },
    tags: {
      type: Array,
      required: true,
    },
  },

  computed: {
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
