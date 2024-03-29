<template>
  <v-container
    fluid
    class="d-flex flex-column mt-4"
  >
    <v-row>
      <v-col cols="auto">
        <v-text-field
          v-model="searchText"
          label="快速搜尋"
          outlined
          hide-details
          append-icon="mdi-magnify"
          single-line
          dense
        />
      </v-col>
      <v-spacer />
      <v-col cols="auto">
        <template v-if="canWriteCourse">
          <v-btn
            color="primary"
            :to="{ name: 'courseManageMembers' }"
            class="mr-3"
            outlined
          >
            管理課程成員
          </v-btn>
          <AddStudentModal @success="getCourseInfo($route.params.id)" />
        </template>
      </v-col>
    </v-row>

    <v-data-table
      :headers="headers"
      :items="members"
      :search="searchText"
      :items-per-page="Number(-1)"
      hide-default-footer
      :loading="loading"
      class="table"
      @click:row="handleRowClick"
    >
      <template
        v-for="slotName in ['no-data', 'no-results']"
        #[slotName]
      >
        <div
          :key="slotName"
          class="d-flex flex-column align-center"
        >
          <div class="text-subtitle-1 my-8">
            這裡還沒有任何成員，或找不到符合條件的成員
          </div>
          <v-img
            :src="require('@/assets/images/noData.svg')"
            max-width="600"
            contain
          />
        </div>
      </template>
    </v-data-table>
  </v-container>
</template>

<script>
import { mapActions } from 'vuex'
import { ActionTypes } from '@/store/action-types'
import { ROLE } from '@/constants/auth'
import { canWriteCourseMixin } from '@/lib/permissionMixin'

const { TEACHER } = ROLE

const headers = [
  { text: '使用者名稱', value: 'username' },
  { text: '顯示名稱', value: 'displayName' },
  { text: '身份', value: 'role' },
]

export default {
  name: 'MemberList',

  mixins: [canWriteCourseMixin],

  props: {
    members: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    headers,
    searchText: '',
    loading: false,
    TEACHER,
  }),

  methods: {
    handleRowClick(value) {
      const route = this.$router.resolve({ name: 'profile', params: { id: value.id } })
      window.open(route.href, '_blank')
    },
    ...mapActions({
      getCourseInfo: ActionTypes.GET_COURSE_INFO,
    }),
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
