import Vue from 'vue';
import html from './index.pug';
import { UNLIMIT, getCourses, getTags, getProfile } from '@/util.js'

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
            unlimit: UNLIMIT,
            candidateTags: ['分類一', '分類三'],
            selectedCourse: UNLIMIT,
            availableTags: ['分類二', '分類四', '分類五'],
            selectedTags: [],
            newTagDialog: false,
            newTagNames: '',
            courses: []
        }
    },

    ready() {},

    beforeMount() {
        this.selectedCourse = getProfile().course;
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
            if ( this.selectedCourse == UNLIMIT )   this.availableTags = [];
            else    this.availableTags = await getTags(this.selectedCourse);
            this.candidateTags = this.candidateTags.filter(tag => !this.availableTags.includes(tag))
        },

        async addNewTag(tags) {
            try {
                let result = await this.$http.post('/tag', { tags: tags });
            } catch (e) {
                console.log(e);
            }
            this.updateTags()
        },
        async deleteTags(tags) {
            try {
                let result = await this.$http.delete('/tag', { data: { tags: tags } });
            } catch (e) {
                console.log(e);
            }
            this.updateTags()
        },
        async pushTags(course, tags) {
            try {
                let result = await this.$http.patch(`/course/${course}/tag`, {
                    push: tags,
                    pop: []
                });
            } catch (e) {
                console.log(e);
            }
            this.updateTags()
        },
        async popTag(course, tag) {
            let result;
            try {
                result = await this.$http.patch(`/course/${course}/tag`, {
                    push: [],
                    pop: [tag]
                });
            } catch (e) {
                console.log(e);
            }
            this.updateTags()
        },

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