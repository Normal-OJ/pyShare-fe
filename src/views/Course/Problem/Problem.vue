<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="6" class="problem">
        <!-- Problem Display START -->
        <div class="text-h4 title">{{ prob.title }}</div>
        <div class="d-flex flex-row mt-4">
          <v-avatar class="mr-2" size="48">
            <img src="http://fakeimg.pl/48x48" />
          </v-avatar>
          <div class="d-flex flex-column">
            <router-link :to="{ name: 'about' }">
              {{ prob.author.displayName }}
            </router-link>
            <div class="text-body-2 d-flex">
              Jul 12, 2020
              <div
                v-if="prob.tags && prob.tags.length > 0"
                style="white-space: pre"
              >
                &nbsp;·&nbsp;
                <v-chip
                  class="text-caption mr-1"
                  v-for="tag in prob.tags"
                  :key="tag"
                  small
                >
                  {{ tag }}
                </v-chip>
              </div>
            </div>
          </div>
        </div>
        <div class="text-body-1 mt-6" v-html="prob.content" />
        <!-- Problem Display END -->
      </v-col>
      <v-col cols="12" md="6">
        <div />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
const prob = {
  title: 'Dcard 熱門文章分析',
  author: {
    username: '407000123A',
    displayName: '陳孜旻',
  },
  tags: ['休閒', '個人專題'],
  content: '<p><strong>研究議題</strong>：Dcard熱門文章分析</p><p><strong>說明</strong>：藉由 Dcard 每日 TOP 30 出現在熱門文章看板的文章，分析出哪些看板上熱門的頻率最高、愛心數前三的文章和留言數前三的文章又分別屬於什麼看板。(可再加入 Matplotlib 圖表) 藉此得知學生族群活躍用戶多屬於什麼屬性。此專題可以再延伸分析師大校版的熱門趨勢以及贊助抽獎活動熱門趨勢作為行銷人員參考。分析方式：以下提供範例程式碼，可讀出前三熱門看板、前三多愛心數文章及所屬看板、前三多留言數文章及所屬看板。</p><p><strong>資料來源</strong>：自行蒐集，以附檔為例</p>',
}

export default {
  name: 'CourseProblem',

  data: () => ({
    prob,
  }),
}
</script>

<style scoped>
.problem {
  border-right: var(--v-gray-base) 1px solid;
  height: 100%;
}

.title {
  font-family: 'Noto Sans TC' !important;
  text-align: center;
}
</style>
