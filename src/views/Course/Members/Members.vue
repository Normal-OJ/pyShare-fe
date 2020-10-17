<template>
  <Members :data="fakeMembersData" />
</template>

<script>
import Members from '@/components/Course/Members/Members'

const fakeMembersData = [
  {
    id: '1',
    username: '1234567890',
    displayName: '一二三',
  },
  {
    id: '2',
    username: '40747024S',
    displayName: '于子緯',
  },
]

export default {
  components: { Members },

  data: () => ({
    fakeMembersData,
  }),
}
</script>
