<template>
  <Info
    :info="info"
    @submit-add-multiple-students="submitAddMultipleStudents"
    @submit-add-student="submitAddStudent"
  />
</template>

<script>
import Info from '@/components/Course/Info/Info'
import { mapActions, mapState } from 'vuex'
import { GET_COURSE_INFO } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { Info },

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
    }),
  },

  methods: {
    ...mapActions({
      getCourseInfo: GET_COURSE_INFO,
    }),
    submitAddMultipleStudents(file, resolve, reject) {
      const r = new FileReader()
      const course = this.$route.params.id
      r.onload = async e => {
        const csvString = e.target.result
        try {
          await agent.Auth.batchSignup({ course, csvString })
          this.getCourseInfo(course)
          resolve()
        } catch (error) {
          console.log('[views/Info/submitAddMultipleStudents error]', error)
          reject(error)
          throw error
        }
      }
      r.readAsText(file)
    },
    async submitAddStudent(csvString, resolve, reject) {
      try {
        const course = this.$route.params.id
        await agent.Auth.batchSignup({ course, csvString })
        this.getCourseInfo(course)
        resolve()
      } catch (error) {
        console.log('[views/Info/submitAddStudent error]', error)
        reject(error)
        throw error
      }
    },
  },
}
</script>
