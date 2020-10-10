<template>
  <v-container fluid class="d-flex flex-column pt-4 px-8">
    <ProblemFilter :selectedTags="selectedTags" :searchText.sync="searchText" />
    <ProblemList :data="fakeProblemsData" :searchText="searchText" />
  </v-container>
</template>

<script>
import ProblemFilter from '@/components/Course/ProblemFilter'
import ProblemList from '@/components/Course/ProblemList'

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
  name: 'Problems',

  components: { ProblemList, ProblemFilter },

  data: () => ({
    selectedTags: [],
    searchText: '',
    fakeProblemsData,
  }),
}
</script>
