import Vue from 'vue';
import html from './index.pug';
import { UNLIMIT, getCourses, getTags, toDateString, getProfile } from '@/util.js'

export default Vue.extend({
    template: html,

    data() {
        return {
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
            problems: [],
            courses: [],
            tags: [],
            course: UNLIMIT,
            selectedTags: [],
            title: ''
        }
    },

    ready() {},

    beforeMount() {
        this.course = getProfile().course;
        this.getProblems()
        getCourses().then(courses => this.courses = courses)
        getTags().then(tags => this.tags = tags)
    },

    watch: {
        course() {
            this.selectedTags = []
            getTags(this.course).then(tags => this.tags = tags)
            this.getProblems()
        },
        selectedTags() {
            this.getProblems()
        },
    },

    methods: {
        async getProblems() {
            console.log('enter')
            let result;
            try {
                let filter = {
                    offset: 0,
                    count: -1,
                    tags: this.selectedTags.join()
                }
                if (this.course != UNLIMIT) filter['course'] = this.course
                if (this.title != '') filter['title'] = this.title

                result = await this.$http.get('/problem', { params: filter });
                this.problems = result.data.data;
            } catch (e) {
                console.log(e);
            }
        },
        timeFormat(ts) {
            return toDateString(ts);
        }
    },
});