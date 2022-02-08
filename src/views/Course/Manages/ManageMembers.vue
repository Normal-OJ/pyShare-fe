<template>
  <ManageMembers
    :members="members"
    :loading="!info"
    @success-add-student="getCourseInfo(courseId)"
    @delete-student="submitDeleteStudent"
  />
</template>

<script>
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'

export default {
  computed: {
    ...mapState({
      info: (state) => state.course.courseInfo,
    }),
    courseId() {
      return this.$route.params.id
    },
    members() {
      if (!this.info) return []
      const items = [{ ...this.info.teacher, role: '教師' }].concat(
        this.info.students.map((s) => ({
          ...s,
          role: '學生',
        })),
      )
      return items
    },
  },

  created() {
    this.getCourseInfo(this.courseId)
  },

  methods: {
    ...mapActions({
      getCourseInfo: ActionTypes.GET_COURSE_INFO,
    }),
    async submitDeleteStudent(users, resolve, reject) {
      try {
        await this.$agent.Course.removeStudent(this.courseId, { users })
        resolve()
      } catch (error) {
        console.log('[views/ManageMembers/submitDeleteStudent] error', error)
        reject(error)
        throw error
      } finally {
        this.getCourseInfo(this.courseId)
      }
    },
  },
}
</script>
