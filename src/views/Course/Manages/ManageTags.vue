<template>
  <ManageTags
    :allTags="allTags || []"
    :removables="removables"
    :errorMsg="errorMsg"
    :courseTags="courseTags || []"
    @submit-patch-tags="submitPatchTags"
    @submit-new-tags="submitNewTags"
    @delete-tags="deleteTags"
  />
</template>

<script>
import ManageTags from '@/components/Course/Manages/ManageTags'
import { mapActions, mapState } from 'vuex'
import { ActionTypes } from '@/store/action-types'

export default {
  components: { ManageTags },

  computed: {
    ...mapState({
      courseTags: state => state.course.courseTags,
    }),
    courseId() {
      return this.$route.params.id
    },
  },

  data: () => ({
    allTags: [],
    removables: null,
    errorMsg: '',
  }),

  created() {
    this.getAllTags()
    this.getCourseTags(this.courseId)
  },

  methods: {
    ...mapActions({
      getCourseTags: ActionTypes.GET_COURSE_TAGS,
    }),
    getAllTags() {
      this.$agent.Tag.getList()
        .then(resp => {
          this.allTags = resp.data.data
          return this.$agent.Tag.check({ tags: this.allTags })
        })
        .then(resp => {
          this.removables = resp.data.data
        })
        .catch(error => {
          console.log('[views/ManageTags/getAllTags] error', error)
          this.errorMsg = '管理分類出現未知錯誤，請稍後再試或聯絡開發人員。'
          throw error
        })
    },
    async submitPatchTags(body) {
      try {
        await this.$agent.Course.patchTags(this.courseId, body)
        this.getCourseTags(this.courseId)
        this.getAllTags(this.courseId)
        this.$alertSuccess('編輯分類成功。')
      } catch (error) {
        console.log('[components/ManageTags/submitPatchTags] error', error)
        this.$alertFail('編輯分類失敗。')
        throw error
      }
    },
    async submitNewTags(tags, resolve, reject) {
      try {
        await this.$agent.Tag.create({ tags })
        resolve()
        this.getAllTags(this.courseId)
        this.$alertSuccess('新增分類成功。')
      } catch (error) {
        console.log('[views/ManageTags/submitNewTags] error', error)
        reject()
        this.$alertFail('新增分類失敗。')
        throw error
      }
    },
    async deleteTags(tags, resolve, reject) {
      try {
        await this.$agent.Tag.delete({ tags })
        this.getAllTags(this.courseId)
        this.$alertSuccess('刪除分類成功。')
        resolve()
      } catch (error) {
        console.log('[views/ManageTags/deleteTags] error', error)
        this.$alertFail('刪除分類失敗。')
        reject()
        throw error
      }
    },
  },
}
</script>
