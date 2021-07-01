<template>
  <ManageMembers :members="members" :loading="!info" @delete-student="submitDeleteStudent" />
</template>

<script>
import ManageMembers from '@/components/Course/Manages/ManageMembers'
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import agent from '@/api/agent'

export default {
  components: { ManageMembers },

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
    }),
    courseId() {
      return this.$route.params.id
    },
    members() {
      if (!this.info) return []
      const items = [{ ...this.info.teacher, role: '教師' }].concat(
        this.info.students.map(s => ({
          ...s,
          role: '學生',
        })),
      )
      return items
    },
  },

  watch: {
    courseId: {
      handler() {
        this.getCourseInfo(this.courseId)
      },
      immediate: true,
    },
  },

  methods: {
    ...mapActions({
      getCourseInfo: ActionTypes.GET_COURSE_INFO,
    }),
    async submitDeleteStudent(users, resolve, reject) {
      try {
        await agent.Course.removeStudent(this.courseId, { users })
        this.getCourseStats(this.courseId)
        resolve()
      } catch (error) {
        console.log('[views/ManageMembers/submitDeleteStudent] error', error)
        reject(error)
        throw error
      }
    },
  },
}
</script>
