<template>
  <v-data-table
    :headers="headers"
    :items="data"
    :items-per-page="Number(-1)"
    hide-default-footer
    :loading="loading"
    :custom-sort="customSort"
    class="table"
    @click:row="handleRowClick"
  >
    <template v-slot:[`header.permission`]>
      {{ permissionHeader }}
      <template v-if="permissionHeader === '權限'">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-icon class="mx-1" color="primary" small v-bind="attrs" v-on="on">
              mdi-help-circle
            </v-icon>
          </template>
          <span>
            可檢視：可以瀏覽課程內的主題與創作<br />
            可參與：可以在課程內建立主題與創作
          </span>
        </v-tooltip>
      </template>
    </template>
    <template v-slot:[`item.semester`]="{ item }">
      {{ item.year ? `${item.year}-${item.semester}` : '' }}
    </template>
    <template v-slot:[`item.permission`]="{ item }">
      {{ permissionText[`${item.permission}`] }}
    </template>
    <template v-slot:[`item.teacher`]="{ item }">
      <router-link :to="{ name: 'profile', params: { id: item.teacher.id } }">
        {{ item.teacher.displayName }}
      </router-link>
    </template>
  </v-data-table>
</template>

<script>
import { mapState } from 'vuex'

const headers = [
  { text: '課程', value: 'name', width: '40%' },
  { text: '學期', value: 'semester', width: '20%' },
  { text: '', value: 'permission', width: '20%', sortable: false },
  { text: '教師', value: 'teacher', width: '20%', sortable: false },
]
const permissionText = {
  teacher: '教師',
  student: '學生',
  read: '可檢視',
  participate: '可參與',
}
export default {
  name: 'CourseList',

  props: {
    data: {
      type: Array,
      required: true,
    },
    loading: {
      type: Boolean,
      required: true,
    },
    permissionHeader: {
      type: String,
      required: true,
    },
  },

  computed: {
    ...mapState({
      username: state => state.auth.username,
      role: state => state.auth.role,
    }),
  },

  data: () => ({
    headers,
    permissionText,
  }),

  methods: {
    handleRowClick(value) {
      this.$router.push({ name: 'course', params: { id: value.id } })
    },
    customSort(items, index, isDesc) {
      items.sort((a, b) => {
        if (index[0] === 'semester') {
          const aStr = `${a.year}-${a.semester}`
          const bStr = `${b.year}-${b.semester}`
          if (!isDesc[0]) {
            return aStr < bStr ? -1 : 1
          } else {
            return aStr > bStr ? -1 : 1
          }
        } else {
          if (!isDesc[0]) {
            return a[index] < b[index] ? -1 : 1
          } else {
            return b[index] < a[index] ? -1 : 1
          }
        }
      })
      return items
    },
  },
}
</script>

<style scoped>
.table >>> tbody tr :hover {
  cursor: pointer;
}
</style>
