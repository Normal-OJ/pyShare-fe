<template>
  <Info
    :info="info"
    @submitAddMultipleStudents="submitAddMultipleStudents"
    @submitAddStudent="submitAddStudent"
  />
</template>

<script>
import Info from '@/components/Course/Info/Info'
import { mapActions, mapState } from 'vuex'
import { GET_COURSE_INFO } from '@/store/actions.type'
import agent from '@/api/agent'

export default {
  components: { Info },

  data: () => ({}),

  computed: {
    ...mapState({
      info: state => state.course.courseInfo,
    }),
  },

  created() {
    this.getCourseInfo(this.$route.params.name)
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
          alert('新增學生成功。')
        } catch (error) {
          console.log('[views/Info/submitAddMultipleStudents error]', error)
          alert('新增學生失敗。')
        }
      }
      r.readAsText(file)
    },
    async submitAddStudent(csvString) {
      try {
        const course = this.$route.params.name
        await agent.Auth.batchSignup({ course, csvString })
        this.getCourseInfo(course)
        alert('新增學生成功。')
      } catch (error) {
        console.log('[views/Info/submitAddStudent error]', error)
        alert('新增學生失敗。')
      }
    },
  },
}
</script>
