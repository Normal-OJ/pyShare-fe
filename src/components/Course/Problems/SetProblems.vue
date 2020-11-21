<template>
  <v-container fluid class="pb-16">
    <v-row class="mb-4">
      <div class="text-h1">{{ isEdit ? '修改主題' : '新增主題' }}</div>
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
    isEdit: {
      type: Boolean,
      required: true,
    },
  },

  computed: {
    newProb() {
      return _.cloneDeep(this.prob)
    },
  },

  methods: {
    submit(willAddAttachments, willRemoveAttachments) {
      this.$emit('submit', this.newProb, willAddAttachments, willRemoveAttachments)
    },
  },
}
</script>
