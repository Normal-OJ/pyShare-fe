<template>
  <Problems
    :problems="problems"
    :tags="tags"
    :loading="isLoading"
    @get-problems-by-tags="getProblemsByTags"
  />
</template>

<script>
import Problems from '@/components/Datasets/Problems'

export default {
  components: { Problems },

  data: () => ({
    isLoading: true,
    problems: [],
    tags: [],
  }),

  computed: {
    getProblemsParams() {
      return { count: -1, offset: 0, isTemplate: true }
    },
  },

  created() {
    Promise.all([this.getTemplateProblems(this.getProblemsParams), this.getTags()]).then(
      () => (this.isLoading = false),
    )
  },

  methods: {
    async getTemplateProblems(params) {
      try {
        const { data } = await this.$agent.Problem.getList(params)
        this.problems = data.data
      } catch (error) {
        this.$rollbar.error('[views/Datasets/Problems/getTemplateProblems]', error)
      }
    },
    async getTags() {
      try {
        const { data } = await this.$agent.Tag.getList()
        this.tags = data.data
      } catch (error) {
        this.$rollbar.error('[views/Datasets/Problems/getTags]', error)
      }
    },
    getProblemsByTags(paramsWithTags) {
      this.getTemplateProblems({ ...paramsWithTags, ...this.getProblemsParams })
    },
  },
}
</script>
