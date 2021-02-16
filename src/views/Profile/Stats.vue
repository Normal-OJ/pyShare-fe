<template>
  <v-container fluid class="px-4">
    <v-card class="my-3 pb-6" elevation="0" v-if="statistic.problems">
      <v-card-title>
        {{ `${displayName} 的統計資料` }}
        <v-spacer />
        <v-btn color="primary" outlined :to="{ name: 'profile', params: { id } }" replace exact>
          查看個人頁面
        </v-btn>
      </v-card-title>
      <v-divider />
      <v-expansion-panels flat="flat" multiple="multiple">
        <v-expansion-panel>
          <v-expansion-panel-header class="title font-weight-bold">
            發布的主題: {{ statistic.problems.length }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="subtitle-1 text--primary" style="width: 20%">主題所在課程</th>
                  <th class="subtitle-1 text--primary" style="width: 80%">超連結</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="statistic.problems &amp;&amp; statistic.problems.length == 0">
                  <td colspan="2">No data available.</td>
                </tr>
                <tr v-for="(problem, idx) in statistic.problems" :key="idx">
                  <td class="subtitle-1">{{ problem.course }}</td>
                  <td class="subtitle-1">
                    <router-link
                      target="_blank"
                      :to="{
                        name: 'courseProblem',
                        params: { name: problem.course, id: problem.pid },
                      }"
                    >
                      {{ '主題' + problem.pid }}
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title font-weight-bold">
            發布的創作: {{ statistic.comments.length }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="subtitle-1 text--primary" style="width: 20%">創作所在課程</th>
                  <th class="subtitle-1 text--primary" style="width: 30%">超連結</th>
                  <th class="subtitle-1 text--primary" style="width: 50%">創作是否 Accepted</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="statistic.comments &amp;&amp; statistic.comments.length == 0">
                  <td colspan="3">No data available.</td>
                </tr>
                <tr v-for="(comment, idx) in statistic.comments" :key="idx">
                  <td class="subtitle-1">{{ comment.course }}</td>
                  <td class="subtitle-1">
                    <router-link
                      target="_blank"
                      :to="{
                        name: 'courseProblem',
                        params: { name: comment.course, id: comment.pid },
                        query: { floor: comment.floor },
                      }"
                    >
                      {{ '主題' + comment.pid + '-' + comment.floor + '樓' }}
                    </router-link>
                  </td>
                  <td class="subtitle-1">
                    <v-icon v-if="comment.accepted" color="success">mdi-check-bold</v-icon>
                    <v-icon v-else color="error">mdi-close-thick</v-icon>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title font-weight-bold">
            發布的留言: {{ statistic.replies.length }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="subtitle-1 text--primary" style="width: 20%">創作所在課程</th>
                  <th class="subtitle-1 text--primary" style="width: 80%">留言的超連結</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="statistic.replies &amp;&amp; statistic.replies.length == 0">
                  <td colspan="2">No data available.</td>
                </tr>
                <tr v-for="(reply, idx) in statistic.replies" :key="idx">
                  <td class="subtitle-1">{{ reply.course }}</td>
                  <td class="subtitle-1">
                    <router-link
                      target="_blank"
                      :to="{
                        name: 'courseProblem',
                        params: { name: reply.course, id: reply.pid },
                        query: { floor: reply.floor },
                      }"
                    >
                      {{ '主題' + reply.pid + '-' + reply.floor + '樓' }}
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title font-weight-bold">
            獲得愛心: {{ totalLikedAmount }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="subtitle-1 text--primary" style="width: 20%">創作所在課程</th>
                  <th class="subtitle-1 text--primary" style="width: 30%">超連結</th>
                  <th class="subtitle-1 text--primary" style="width: 50%">給予愛心的人</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="statistic.liked &amp;&amp; statistic.liked.length == 0">
                  <td colspan="3">No data available.</td>
                </tr>
                <tr v-for="(liked, idx) in statistic.liked" :key="idx">
                  <td class="subtitle-1">{{ liked.course }}</td>
                  <td class="subtitle-1">
                    <router-link
                      target="_blank"
                      :to="{
                        name: 'courseProblem',
                        params: { name: liked.course, id: liked.pid },
                        query: { floor: liked.floor },
                      }"
                    >
                      {{ '主題' + liked.pid + '-' + liked.floor + '樓' }}
                    </router-link>
                  </td>
                  <td class="subtitle-1 py-1">
                    <v-expansion-panels flat="flat">
                      <v-expansion-panel>
                        <v-expansion-panel-header>{{
                          liked.starers.length
                        }}</v-expansion-panel-header>
                        <v-expansion-panel-content v-if="liked.starers.length > 0">
                          <p v-for="(starer, i) in liked.starers" :key="i">{{ starer }}</p>
                        </v-expansion-panel-content>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title font-weight-bold">
            給予愛心: {{ totalLikesAmount }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="subtitle-1 text--primary" style="width: 20%">創作所在課程</th>
                  <th class="subtitle-1 text--primary" style="width: 30%">超連結</th>
                  <th class="subtitle-1 text--primary" style="width: 50%">獲得愛心的人</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="statistic.likes &amp;&amp; statistic.likes.length == 0">
                  <td colspan="3">No data available.</td>
                </tr>
                <tr v-for="(likes, idx) in statistic.likes" :key="idx">
                  <td class="subtitle-1">{{ likes.course }}</td>
                  <td class="subtitle-1">
                    <router-link
                      target="_blank"
                      :to="{
                        name: 'courseProblem',
                        params: { name: likes.course, id: likes.pid },
                        query: { floor: likes.floor },
                      }"
                    >
                      {{ '主題' + likes.pid + '-' + likes.floor + '樓' }}
                    </router-link>
                  </td>
                  <td class="subtitle-1">{{ likes.staree }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
        <v-expansion-panel>
          <v-expansion-panel-header class="title font-weight-bold">
            創作執行結果: {{ statistic.execInfo.length }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-simple-table>
              <thead>
                <tr>
                  <th class="subtitle-1 text--primary" style="width: 20%">創作所在課程</th>
                  <th class="subtitle-1 text--primary" style="width: 30%">超連結</th>
                  <th class="subtitle-1 text--primary" style="width: 25%">執行成功次數</th>
                  <th class="subtitle-1 text--primary" style="width: 25%">執行失敗次數</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="statistic.execInfo &amp;&amp; statistic.execInfo.length == 0">
                  <td colspan="4">No data available.</td>
                </tr>
                <tr v-for="(info, idx) in statistic.execInfo" :key="idx">
                  <td class="subtitle-1">{{ info.course }}</td>
                  <td class="subtitle-1">
                    <router-link
                      target="_blank"
                      :to="{
                        name: 'courseProblem',
                        params: { name: info.course, id: info.pid },
                        query: { floor: info.floor },
                      }"
                    >
                      {{ '主題' + info.pid + '-' + info.floor + '樓' }}
                    </router-link>
                  </td>
                  <td class="subtitle-1">{{ info.success }}</td>
                  <td class="subtitle-1">{{ info.fail }}</td>
                </tr>
              </tbody>
            </v-simple-table>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-card>
    <div v-if="isNotFound" class="d-flex flex-column align-center">
      <div class="text-h2 mt-16">
        查無此人 😢
      </div>
      <v-btn class="mt-10" color="primary" @click="$router.go(-1)">
        回上一頁
      </v-btn>
    </div>
  </v-container>
</template>

<script>
import agent from '@/api/agent'
import { mapState } from 'vuex'

export default {
  data: () => ({
    statistic: {},
    isNotFound: false,
  }),

  computed: {
    ...mapState({
      displayName: state => state.auth.displayName,
    }),
    totalLikedAmount() {
      return this.statistic.liked.reduce((a, b) => {
        return a + b.starers.length
      }, 0)
    },
    totalLikesAmount() {
      return this.statistic.likes.length
    },
    id() {
      return this.$route.params.id
    },
  },

  created() {
    this.getStats()
  },

  methods: {
    async getStats() {
      this.isNotFound = false
      try {
        const { data } = await agent.User.getStats(this.id)
        this.statistic = data.data
      } catch (error) {
        console.log('[views/Stats/getStats] error', error)
        this.isNotFound = error.message.includes('not found')
        throw error
      }
    },
  },
}
</script>
