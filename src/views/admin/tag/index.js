import Vue from 'vue';
import html from './index.pug';
import { UNLIMIT, getCourses, getTags } from '@/util.js'

export default Vue.extend({
    template: html,

    data() {
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
            selectedCourse: UNLIMIT,
            availableTags: ['分類二', '分類四', '分類五'],
            selectedTags: [],
            newTagDialog: false,
            newTagNames: '',
        }
    },

    ready() {},

    beforeMount() {
        getCourses().then(courses => this.courses = courses)
        this.updateTags()
    },

    watch: {
        selectedCourse() {
            this.updateTags()
        }
    },

    methods: {
        async updateTags() {
            this.selectedTags = [];
            this.candidateTags = await getTags();
            this.availableTags = await getTags(this.selectedCourse);
            this.candidateTags = this.candidateTags.filter(tag => !this.availableTags.includes(tag))
        },

        // 這兩個 api 都收 array! 詳看 api ref

        // api: 2.5.2 Create tags
        async addNewTag(tags) {
            let result;
            try {
                result = await this.$http.post('/tag', { tags: tags }, { emulateJSON: true });
            } catch (e) {
                console.log(e);
                result = {
                    'data': {
                        'fail': [],
                        'success': ['共產主義'],
                    }
                }
            }
            this.updateTags()
        },
        // api: 2.5.3 Delete tags
        async deleteTags(tags) {
            let result;
            try {
                result = await this.$http.delete('/tag', { body: { tags: tags } });
            } catch (e) {
                console.log(e);
                result = {
                    'data': {
                        'fail': [],
                        'success': ['共產主義'],
                    }
                }
            }
            this.updateTags()
        },
        // api: 2.4.6 Manage tags
        async pushTags(course, tags) {
            let result;
            try {
                result = await this.$http.patch(`/course/${course}/tag`, {
                    body: {
                        push: tags,
                        pop: []
                    }
                });
            } catch (e) {
                console.log(e);
                result = {
                    'data': {
                        'fail': [],
                        'success': ['共產主義'],
                    }
                }
            }
            this.updateTags()
        },
        async popTag(course, tag) {
            console.log(course, tag)
            let result;
            try {
                result = await this.$http.patch(`/course/${course}/tag`, {
                    body: {
                        push: [],
                        pop: [tag]
                    }
                });
            } catch (e) {
                console.log(e);
                result = {
                    'data': {
                        'fail': [],
                        'success': ['共產主義'],
                    }
                }
            }
            this.updateTags()
        },

        /*
          這裡應該不會動到
          util to control SELECT ALL component
        */
        myToggle() {
            this.$nextTick(() => {
                if (this.selectAll()) {
                    this.selectedTags = [];
                } else {
                    this.selectedTags = [];
                    for (let i = 0; i < this.candidateTags.length; i++) this.selectedTags.push(i);
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
            if (this.selectAll()) return 'mdi-close-box'
            if (this.selectSome()) return 'mdi-minus-box'
            return 'mdi-checkbox-blank-outline'
        },
        iconColor() {
            return (this.selectedTags.length > 0 ? 'indigo darken-4' : '')
        }
    },
});