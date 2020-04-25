import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
  template: html,
  
  data () {
    return {
      /*

        api: 2.5.1 Get tag list
        
        selectedCourse: 選擇的課程
        candidateTags: 目前可以加入到選擇課程的分類（剩餘沒選的）
        availableTags: 目前該課程已經有的分類（之前已授權的可用分類）

        selectedTags:  目前正在勾選的分類

        newTagDialog:  新增分類的對話匡
        

        這部份我想也需要有一個元素為"不限課程"
        不限課程的時候，availableTags 應為 empty, candidateTags 應為 server 上的所有 tag
      */
      candidateTags: ['分類一', '分類三'],
      selectedCourse: null,
      availableTags: ['分類二', '分類四', '分類五'],
      selectedTags: [],
      newTagDialog: false,
      newTagNames: '',
    }
  },

  ready () {
  },

  methods: {

    // 這兩個 api 都收 array! 詳看 api ref

    // api: 2.5.2 Create tags
    addNewTag(tags) {
      console.log(tags)
    },
    // api: 2.5.3 Delete tags
    deleteTags(tags) {
      console.log(tags)
    },
    // api: 2.4.6 Manage tags
    pushTags(course, tags) {
      // course: string
      // tags: array
      console.log(course, tags)
    },
    popTag(course, tag) {
      // course: string
      // tag: string
      console.log(course, tag)
    },

    /*
      這裡應該不會動到
      util to control SELECT ALL component
    */
    myToggle() {
      this.$nextTick(() => {
        if ( this.selectAll() ) {
          this.selectedTags = [];
        } else {
          this.selectedTags = [];
          for ( let i=0; i<this.candidateTags.length; i++ ) this.selectedTags.push(i);
        }
      })
    },
    selectAll() {
      return this.selectedTags.length === this.candidateTags.length
    },
    selectSome() {
      return this.selectedTags.length > 0 && !this.selectAll()
    },
    icon() {
      if ( this.selectAll() ) return 'mdi-close-box'
      if ( this.selectSome() ) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    iconColor() {
      return (this.selectedTags.length > 0 ? 'indigo darken-4' : '')
    }
  },
});