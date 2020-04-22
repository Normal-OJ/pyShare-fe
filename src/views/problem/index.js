import Vue from 'vue';
import html from './index.pug';
import './index.scss';
// import Vuex file ...

export default Vue.extend({
  template: html,
  
  data () {
    return {
      lists: [
        { title: '說明', icon: 'mdi-text' },
        { title: '程式', icon: 'mdi-code-tags' },
        { title: '結果', icon: 'mdi-chart-bar' },
      ],
      browsing: '請選擇',
      attachments: ['bicycle.csv', 'readme.txt', 'bike.txt'],
      examples: [`切資料真的是很 重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
      `, '切資料真的是很重要的技術，要搞清楚T^T', '1235678'],
    }
  },

  ready () {
  },

  methods: {
  },
});