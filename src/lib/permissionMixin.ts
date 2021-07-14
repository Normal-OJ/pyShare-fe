import Vue from 'vue'

export const canWriteCourseMixin = Vue.extend({
  data() {
    return {
      canWriteCourse: null as null | boolean,
    }
  },
  async created() {
    this.canWriteCourse = await this.$hasPermission('course', this.$route.params.name, ['w'])
  },
})

export const canParticipateCourseMixin = Vue.extend({
  data() {
    return {
      canParticipateCourse: null as null | boolean,
    }
  },
  async created() {
    this.canParticipateCourse = await this.$hasPermission('course', this.$route.params.name, ['p'])
  },
})
