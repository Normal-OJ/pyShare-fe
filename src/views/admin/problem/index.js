import Vue from 'vue';
import html from './index.pug';
import { UNLIMIT, getCourses, getTags } from '../../../util.js'

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
            title: '',
            status: ['顯示', '隱藏（老師和作者可見）'],
            deleteProblemDialog: false,
        }
    },

    beforeMount() {
        this.getProblems()
        getCourses().then(courses => this.courses = courses)
    },

    watch: {
        course() {
            this.getProblems();
        }
    },

    methods: {
        async getProblems() {
            let result;
            try {
                let filter = {
                    offset: 0,
                    count: -1,
                }
                if (this.course != UNLIMIT) filter['course'] = this.course
                result = await this.$http.get('/problem', { params: filter });
                result = result.data
            } catch (e) {
                console.log(e);
                result = {
                    'data': [{
                        pid: '1',
                        title: 'DSCP修課背景分析',
                        timestamp: '',
                        author: {
                            username: 'tcc',
                            displayedName: '蔣宗哲',
                        },
                        tags: ['台灣獨立'],
                        status: 0
                    }]
                }
            }
            this.problems = result.data;
        },
        cloneProblem(pid, course) {
            // api 2.2.7
        },
        deleteProblem(pid) {
            
        }
    },
});