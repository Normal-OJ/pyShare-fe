<template>
  <ManageTags
    :allTags="allTags || []"
    :removables="removables"
    :errorMsg="errorMsg"
    :courseTags="courseTags || []"
    :submitPatchTags="submitPatchTags"
    :submitNewTags="submitNewTags"
    :deleteTags="deleteTags"
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
    removables: null,
    errorMsg: '',
  }),

  created() {
    this.getAllTags()
    this.getCourseTags({ course: this.courseName })
  },

  methods: {
    ...mapActions({
      getCourseTags: GET_COURSE_TAGS,
    }),
    getAllTags() {
      agent.Tag.getList()
        .then(resp => {
          this.allTags = resp.data.data
          return agent.Tag.check({ tags: this.allTags })
        })
        .then(resp => {
          this.removables = resp.data.data
        })
        .catch(error => {
          console.log('[views/ManageTags/getAllTags] error', error)
          this.errorMsg = '管理分類出現未知錯誤，請稍後再試或聯絡開發人員。'
          throw error
        })
    },
    async submitPatchTags(body) {
      try {
        await agent.Course.patchTags(this.courseName, body)
        this.getCourseTags({ course: this.courseName })
        this.getAllTags(this.courseName)
        return true
      } catch (error) {
        console.log('[components/ManageTags/submitPatchTags] error', error)
        throw error
      }
    },
    async submitNewTags(tags) {
      try {
        await agent.Tag.create({ tags })
        this.getAllTags(this.courseName)
        return true
      } catch (error) {
        console.log('[views/ManageTags/submitNewTags] error', error)
        throw error
      }
    },
    async deleteTags(tags) {
      try {
        await agent.Tag.delete({ tags })
        this.getAllTags(this.courseName)
        return true
      } catch (error) {
        console.log('[views/ManageTags/deleteTags] error', error)
        throw error
      }
    },
  },
}
</script>
