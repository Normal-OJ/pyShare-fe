<template>
  <Problems :problems="problems" :tags="tags" :selectedTags.sync="selectedTags" />
</template>

<script>
import Problems from '@/components/Course/Problems/Problems'
import { mapActions, mapGetters, mapState } from 'vuex'
import { PROBLEMS } from '@/store/getters.type'
import { GET_PROBLEMS, GET_COURSE_TAGS } from '@/store/actions.type'

export default {
  // prevent maximum call stack size exceeded
  // https://github.com/vuejs/vue/issues/9081
  // name: 'Problems',

  components: { Problems },

  computed: {
    ...mapState({
      tags: state => state.course.courseTags,
    }),
    ...mapGetters({
      problems: PROBLEMS,
    }),
    courseName() {
      return this.$route.params.name
    },
  },

  data: () => ({
    selectedTags: [],
  }),

  created() {
    const paramsWithCourse = {
      course: this.courseName,
    }
    this.getProblems(paramsWithCourse)

    const getTagsInCourse = {
      course: this.courseName,
    }
    this.getTags(getTagsInCourse)
  },

  watch: {
    selectedTags() {
      const paramsWithTags = {
        course: this.courseName,
        tags: this.selectedTags,
      }
      this.getProblems(paramsWithTags)
    },
  },

  methods: {
    ...mapActions({
      getProblems: GET_PROBLEMS,
      getTags: GET_COURSE_TAGS,
    }),
  },
}
</script>
