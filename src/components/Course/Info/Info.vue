<template>
  <v-container fluid>
    <div class="text-h5">基本資訊</div>
    <div class="mt-4">
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="font-weight-bold">學期</td>
              <td>{{ info ? `${info.year}-${info.semester}` : '' }}</td>
            </tr>
            <tr>
              <td class="font-weight-bold">教師</td>
              <td>{{ info.teacher ? info.teacher.displayName : '' }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div class="text-h5 mt-4">統計</div>
    <div class="mt-4 d-flex justify-space-around flex-wrap">
      <div class="d-flex flex-column align-center">
        <div class="text-h6">學生數</div>
        <div class="font-weight-thin text-h1">{{ info ? info.students.length : '' }}</div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">主題數</div>
        <div class="font-weight-thin text-h1">{{ info ? info.numOfProblems : '' }}</div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">創作數</div>
        <div class="font-weight-thin text-h1">{{ info ? info.numOfComments : '' }}</div>
      </div>
    </div>
    <div class="text-h5 mt-4">成員</div>
    <Members
      :members="members"
      @submitAddMultipleStudents="submitAddMultipleStudents"
      @submitAddStudent="submitAddStudent"
    />
  </v-container>
</template>

<script>
import Members from '@/components/Course/Info/Members'

export default {
  name: 'Info',

  components: { Members },

  props: {
    info: {
      type: Object,
      required: true,
    },
  },

  computed: {
    members() {
      if (!this.info) return []
      return this.info ? [{ ...this.info.teacher, teacher: true }].concat(this.info.students) : []
    },
  },

  methods: {
    submitAddMultipleStudents(file) {
      this.$emit('submitAddMultipleStudents', file)
    },
    submitAddStudent(csvString) {
      this.$emit('submitAddStudent', csvString)
    },
  },
}
</script>
