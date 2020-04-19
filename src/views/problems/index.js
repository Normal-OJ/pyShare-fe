import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
  template: html,
  
  data () {
    return {
      query: {
        tag: '',
        keyword: '',
      },
      /*
      4 variables need api

      problems: []   2.2.1 get problem list
        每個元素都是一個字典，內容物如下方的 items

      courses: []    2.4.1 get course  list
        注意需有一個元素為"不限課程"

      tags: []       2.5.1 get Tag     list
        注意 tags 有分課程，course變數 是哪堂課我就要哪堂課程的 tags

      course: String 代表現在選擇課程的 value

      */
      items: [
        { 
          title: 'DSCP修課背景分析',
          id: '1',
          tags: ['分類一'],
          timestamp: '',
          author: {
            username: 'tcc',
            displayName: '蔣宗哲',
          },
        },
        { 
          title: '108-1 自行車竊案統計-3 (圖表繪製)',
          id: '2',
          tags: ['分類一', '分類二'],
          timestamp: '',
          author: {
            username: 'tcc',
            displayName: '蔣宗哲',
          },
        },
        { 
          title: '108-1 自行車竊案統計-2 (圖表繪製)',
          id: '3',
          tags: ['分類一', '分類二'],
          timestamp: '',
          author: {
            username: 'tcc',
            displayName: '蔣宗哲',
          },
        },
      ]
    }
  },

  ready () {
  },

  methods: {
    /*
  
    problem filter 的 api 

    query(course, tag, keyword) {
      
    }

    */
  },
});