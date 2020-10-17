<template>
  <Problems :data="fakeProblemsData" />
</template>

<script>
import Problems from '@/components/Course/Problems/Problems'

const fakeProblemsData = [
  {
    id: '1',
    title: 'GGGG',
    tags: ['交通', '遊戲'],
    creations: 55,
    author: {
      username: '40747024S',
      displayName: '于子緯',
    },
  },
  {
    id: '2',
    title: 'ABCDE',
    tags: ['交通', '遊戲'],
    creations: 55,
    author: {
      username: '40747024S',
      displayName: '于子緯',
    },
  },
]

export default {
  // prevent maximum call stack size exceeded
  // https://github.com/vuejs/vue/issues/9081
  // name: 'Problems',

  components: { Problems },

  data: () => ({
    fakeProblemsData,
  }),
}
</script>
