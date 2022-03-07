<template>
  <ManageTags
    :course-problem-tags="courseProblemTags"
    :course-challenge-tags="courseChallengeTags"
    :problem-tags="problemTags"
    :challenge-tags="challengeTags"
    :error-msg="errorMsg"
    @submit-patch-tags="submitPatchTags"
    @submit-new-tags="submitNewTags"
  />
</template>

<script>
import useSWRV from 'swrv'
import { fetcherWithUnpackedResponse } from '@/api/agent'
import { TAG_CATES } from '@/constants/tag'
import { computed } from '@vue/composition-api'

export default {
  setup(props, context) {
    const route = context.root.$route
    const agent = context.root.$agent
    const courseId = route.params.id

    const { data: courseProblemTags, error: e1, mutate: refetchCourseProblemTags } = useSWRV(
      `/tag?course=${courseId}&category=${TAG_CATES.NORMAL_PROBLEM}`,
      fetcherWithUnpackedResponse,
    )

    const { data: courseChallengeTags, error: e2, mutate: refetchCourseChallengeTags } = useSWRV(
      `/tag?course=${courseId}&category=${TAG_CATES.OJ_PROBLEM}`,
      fetcherWithUnpackedResponse,
    )

    const { data: problemTags, error: e3 } = useSWRV(
      `/tag?category=${TAG_CATES.NORMAL_PROBLEM}`,
      fetcherWithUnpackedResponse,
    )

    const { data: challengeTags, error: e4 } = useSWRV(
      `/tag?category=${TAG_CATES.OJ_PROBLEM}`,
      fetcherWithUnpackedResponse,
    )

    const errorMsg = computed(() => {
      if (e1 || e2 || e3 || e4) return '管理分類出現未知錯誤，請稍後再試或聯絡開發人員。'
      return ''
    })

    return {
      courseProblemTags,
      courseChallengeTags,
      problemTags,
      challengeTags,
      errorMsg,
      submitPatchTags: async (body) => {
        try {
          await agent.Course.patchTags(courseId, body)
          if (body.category === TAG_CATES.NORMAL_PROBLEM) refetchCourseProblemTags()
          else refetchCourseChallengeTags()
          context.root.$alertSuccess('新增分類成功。')
        } catch (error) {
          console.log('[components/ManageTags/submitPatchTags] error', error)
          context.root.$alertFail('新增分類失敗。')
          throw error
        }
      },
      submitNewTags: async (body, resolve) => {
        try {
          await agent.Tag.create(body)
          resolve()
        } catch (error) {
          console.log('[views/ManageTags/submitNewTags] error', error)
          context.root.$alertFail('創建新分類失敗。')
          throw error
        }
      },
    }
  },
}
</script>
