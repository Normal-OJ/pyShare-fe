<template>
  <v-container
    :style="{ width: $vuetify.breakpoint.mdAndUp ? '60vw' : '95vw', height: '100%' }"
  >
    <v-card height="100%" elevation="12">
      <v-card-title>題目列表</v-card-title>
      <v-divider class="mt-0"></v-divider>
      <v-simple-table class="px-4">
        <template v-slot:default>
          <thead>
            <tr>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: 50%;">標題</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: 30%;">發文日期</th>
              <th class="font-weight-bold subtitle-1 text--primary" style="width: 20%;">作者</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.title">
              <td class="subtitle-1"><a :href="`/problem/${item.id}`">{{ item.title }}</a></td>
              <td class="subtitle-1">{{ item.timestamp }}</td>
              <td class="subtitle-1">{{ item.author.displayName }}</td>
            </tr>
            <tr v-if="items.length===0">
              <td>No data available.</td>
              <td></td>
              <td></td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
export default {

  name: 'problems',

  data () {
    return {
      items: [
        { 
          title: 'DSCP修課背景分析',
          id: '1',
          timestamp: '',
          author: {
            username: 'tcc',
            displayName: '蔣宗哲',
          },
        },
        { 
          title: '108-1 自行車竊案統計-3 (圖表繪製)',
          id: '2',
          timestamp: '',
          author: {
            username: 'tcc',
            displayName: '蔣宗哲',
          },
        },
        { 
          title: '108-1 自行車竊案統計-2 (圖表繪製)',
          id: '3',
          timestamp: '',
          author: {
            username: 'tcc',
            displayName: '蔣宗哲',
          },
        },
      ]
    }
  }
}
</script>

<style lang="css" scoped>
</style>