<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6" class="problem">
        <Problem :prob="prob" />
      </v-col>
      <v-col cols="12" md="6">
        <CommentList v-if="!selectedCommentId" :comments="comments" />
        <CommentDetail v-else :comment="selectedComment" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import Problem from '@/components/Course/Problem/Problem'
import CommentList from '@/components/Course/Problem/CommentList'
import CommentDetail from '@/components/Course/Problem/CommentDetail'
const prob = {
  title: '測試 Testing 測試',
  author: {
    username: '407000123A',
    displayName: '陳陳陳',
  },
  tags: ['休閒', '個人專題'],
  content:
    '<h1>H1</h1><h2>H2</h2><h3><strong>研究議題</strong>：Dcard熱門<span style="color: rgb(255, 194, 102);">文章</span>分析</h3><p><strong>說明</strong>：藉由 Dcard<em> 每日 T</em>OP 30 出現<u>在熱</u>門文章看板的文章，分析出哪<span style="background-color: rgb(250, 204, 204);">些看板上熱門</span>的頻率最高、愛心數前三的<s>文章和留</s>言數前三的</p><ul><li>a</li><li>b</li><li>d</li></ul><ul data-checked="false"><li>ja</li><li>bb</li></ul><ol><li>aa</li><li>sdf</li><li class="ql-indent-1">sdf</li><li>s</li></ol><p class="ql-align-center">gg</p><p class="ql-align-right">rr</p><blockquote>iii f sdf a sdf asdfsadfsdfasdfsf</blockquote><pre class="ql-syntax" spellcheck="false">print(\'Hello\'); </pre><p><a href="https:www.noj.tw" target="_blank">sdafasdf</a></p><p><br></p>',
}

const comments = [
  {
    id: '1',
    title: '星爆氣流斬',
    floor: 3,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
  },
  {
    id: '2',
    title: '星爆氣流斬',
    floor: 2,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
  },
  {
    id: '3',
    title: '星爆氣流斬',
    floor: 1,
    author: {
      username: '12345678',
      displayName: '盧昭華',
    },
  },
]

export default {
  name: 'CourseProblem',

  components: { Problem, CommentList, CommentDetail },

  computed: {
    selectedCommentId() {
      const { selectedCommentId } = this.$route.query
      if (!selectedCommentId || !this.comments.find(c => c.id === selectedCommentId)) return null
      return selectedCommentId
    },
    selectedComment() {
      return this.comments.find(c => c.id === this.selectedCommentId)
    },
  },

  data: () => ({
    prob,
    comments,
  }),
}
</script>

<style scoped>
.problem {
  border-right: var(--v-gray-base) 1px solid;
  height: 100%;
}
</style>
