<template>
  <Problems :data="problems" />
</template>

<script>
import Problems from '@/components/Course/Problems/Problems'
import { mapActions, mapState } from 'vuex'
import { GET_PROBLEMS } from '@/store/actions.type'

export default {
  // prevent maximum call stack size exceeded
  // https://github.com/vuejs/vue/issues/9081
  // name: 'Problems',

  components: { Problems },

  computed: {
    ...mapState({
      problems: state => state.problem.problems,
    }),
  },

  data: () => ({}),

  mounted() {
    const getCourseAllProblems = {
      offset: 0,
      count: -1,
      course: this.$route.params.name,
    }
    this.getProblems(getCourseAllProblems)
  },

  methods: {
    ...mapActions({
      getProblems: GET_PROBLEMS,
    }),
  },
}
</script>
