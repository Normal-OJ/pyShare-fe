<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16 course-list">
    <v-row>
      <div class="text-h5">我的課程</div>

      <v-spacer />

      <v-btn color="primary">
        <v-icon>mdi-plus</v-icon>
        新增課程
      </v-btn>
    </v-row>

    <CourseList :data="fakeCoursesData" />

    <v-row class="mt-15">
      <div class="text-h5">其他公開課程</div>
    </v-row>

    <CourseList :data="fakePublicCoursesData" />
  </v-container>
</template>

<script>
import CourseList from '../../components/Courses/CourseList'

const fakeCoursesData = [
  {
    name: 'DSCP',
    semester: '108-2',
    teacher: '蔣宗哲',
  },
]

const fakePublicCoursesData = [
  {
    name: 'DSCP',
    semester: '108-2',
    teacher: '蔣宗哲',
  },
]

export default {
  name: 'Courses',

  components: { CourseList },

  data: () => ({
    fakeCoursesData,
    fakePublicCoursesData,
  }),
}
</script>

<style scoped>
.course-list {
}
</style>
