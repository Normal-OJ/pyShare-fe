<template>
  <Info
    :info="info"
    :submitSuccess="submitSuccess"
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

  data: () => ({
    submitSuccess: false,
  }),

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
    }),
  },

  methods: {
    ...mapActions({
      getCourseInfo: GET_COURSE_INFO,
    }),
    submitAddMultipleStudents(file) {
      const r = new FileReader()
      const course = this.$route.params.name
      r.onload = async e => {
        const csvString = e.target.result
        try {
          await agent.Auth.batchSignup({ course, csvString })
          this.getCourseInfo(course)
          this.submitSuccess = true
          this.submitSuccess = false
          this.$alertSuccess('新增學生成功。')
        } catch (error) {
          console.log('[views/Info/submitAddMultipleStudents error]', error)
          this.$alertFail('新增學生失敗。')
          throw error
        }
      }
      r.readAsText(file)
    },
    async submitAddStudent(csvString) {
      try {
        const course = this.$route.params.name
        await agent.Auth.batchSignup({ course, csvString })
        this.getCourseInfo(course)
        this.submitSuccess = true
        this.$alertSuccess('新增學生成功。')
      } catch (error) {
        console.log('[views/Info/submitAddStudent error]', error)
        this.$alertFail('新增學生失敗。')
        throw error
      }
    },
  },
}
</script>
