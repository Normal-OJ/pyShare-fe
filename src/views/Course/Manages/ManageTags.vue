<template>
  <ManageTags :allTags="allTags || []" :courseTags="courseTags || []" />
</template>

<script>
import ManageTags from '@/components/Course/Manages/ManageTags'
import { mapActions, mapState } from 'vuex'
import { GET_COURSE_TAGS } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { ManageTags },

  computed: {
    ...mapState({
      courseTags: state => state.course.courseTags,
    }),
  },

  data: () => ({
    allTags: [],
  }),

  created() {
    const getTagsInCourse = {
      course: this.courseName,
    }
    this.getTags(getTagsInCourse)
  },

  methods: {
    ...mapActions({
      getTags: GET_COURSE_TAGS,
    }),
    async getAllTags() {
      try {
        const { data } = await agent.Tag.getList()
        this.allTags = data.data
      } catch (error) {
        console.log('[views/ManageTags] error', error)
      }
    },
  },
}
</script>
