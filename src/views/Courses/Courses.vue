<template>
  <v-container fluid class="d-flex flex-column pt-12 px-16">
    <v-row>
      <div class="text-h5">我的課程</div>

      <v-spacer />

      <v-btn color="success">
        <v-icon>mdi-plus</v-icon>
        新增課程
      </v-btn>
    </v-row>

    <CourseList :data="courses" />

    <v-row class="mt-15">
      <div class="text-h5">其他公開課程</div>
    </v-row>

    <CourseList :data="courses" />
  </v-container>
</template>

<script>
import CourseList from '@/components/Courses/CourseList'
import { mapState } from 'vuex'
import store from '@/store'
import { GET_COURSES } from '@/store/actions.type'

export default {
  name: 'Courses',

  components: { CourseList },

  beforeRouteEnter(to, from, next) {
    store.dispatch(GET_COURSES).then(() => {
      next()
    })
  },

  computed: {
    ...mapState({
      courses: state => state.courses,
    }),
  },

  data: () => ({}),
}
</script>
