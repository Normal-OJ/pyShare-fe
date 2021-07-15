<template>
  <v-container fluid>
    <div class="d-flex align-center">
      <div class="text-h5">基本資訊</div>
      <EditCourseModal v-if="canWriteCourse" :info="info" />
    </div>
    <Spinner v-if="!info" />
    <div class="mt-4" v-else>
      <v-simple-table>
        <template v-slot:default>
          <tbody>
            <tr>
              <td class="font-weight-medium">課程名稱</td>
              <td>{{ info.name }}</td>
            </tr>
            <tr>
              <td class="font-weight-medium">學期</td>
              <td>{{ `${info.year}-${info.semester}` }}</td>
            </tr>
            <tr>
              <td class="font-weight-medium">教師</td>
              <td>{{ info.teacher.displayName }}</td>
            </tr>
            <tr>
              <td class="font-weight-medium">課程狀態</td>
              <td>
                {{ COURSE_STATUS_LABEL[`${info.status}`] }}
                <v-tooltip right>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon class="ml-1" color="primary" small v-bind="attrs" v-on="on">
                      mdi-help-circle
                    </v-icon>
                  </template>
                  <span>
                    {{
                      [
                        '僅課程內成員可使用此課程',
                        '任何人皆可檢視內容',
                        '任何人皆可在此課程進行創作',
                      ][info.status]
                    }}
                  </span>
                </v-tooltip>
              </td>
            </tr>
            <tr>
              <td class="font-weight-medium">課程簡介</td>
              <td style="width: 85%">{{ info.description }}</td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </div>
    <div class="text-h5 mt-4">統計</div>
    <Spinner v-if="!info" />
    <div class="mt-4 d-flex justify-space-around flex-wrap" v-else>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">學生數</div>
        <div class="display-amount">{{ info.students.length }}</div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">主題數</div>
        <div class="display-amount">{{ info.numOfProblems }}</div>
      </div>
      <div class="d-flex flex-column align-center">
        <div class="text-h6">創作數</div>
        <div class="display-amount">{{ info.numOfComments }}</div>
      </div>
    </div>
    <template v-if="canParticipateCourse">
      <div class="text-h5 mt-4">成員</div>
      <Spinner v-if="!info" />
      <Members v-else :members="members" />
    </template>
  </v-container>
</template>

<script>
import EditCourseModal from './EditCourseModal'
import Members from '@/components/Course/Info/Members'
import { COURSE_STATUS_LABEL } from '@/constants/course'
import Spinner from '@/components/UI/Spinner'
import { canWriteCourseMixin, canParticipateCourseMixin } from '@/lib/permissionMixin'

export default {
  name: 'Info',

  mixins: [canWriteCourseMixin, canParticipateCourseMixin],

  components: { EditCourseModal, Members, Spinner },

  props: {
    info: {
      type: Object,
    },
  },

  data: () => ({
    COURSE_STATUS_LABEL,
  }),

  computed: {
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
}
</script>
