<template>
  <ManageTags
    :allTags="allTags || []"
    :courseTags="courseTags || []"
    :submitPatchTags="submitPatchTags"
    :submitNewTags="submitNewTags"
  />
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
    courseName() {
      return this.$route.params.name
    },
  },

  data: () => ({
    allTags: [],
  }),

  created() {
    this.getAllTags()
    this.getCourseTags({ course: this.courseName })
  },

  methods: {
    ...mapActions({
      getCourseTags: GET_COURSE_TAGS,
    }),
    async getAllTags() {
      try {
        const { data } = await agent.Tag.getList()
        this.allTags = data.data
      } catch (error) {
        console.log('[views/ManageTags/getAllTags] error', error)
      }
    },
    async submitPatchTags(body) {
      try {
        await agent.Course.patchTags(this.courseName, body)
        this.getCourseTags({ course: this.courseName })
        return true
      } catch (error) {
        console.log('[components/ManageTags/submitPatchTags] error', error)
        return false
      }
    },
    async submitNewTags(tags) {
      try {
        await agent.Tag.create({ tags })
        this.getAllTags(this.courseName)
        return true
      } catch (error) {
        console.log('[views/ManageTags/submitNewTags] error', error)
        return false
      }
    },
  },
}
</script>
