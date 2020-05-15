import Vue from 'vue';
import html from './index.pug';
import { UNLIMIT, getCourses, getTags, getProfile } from '@/util.js'

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
            unlimit: UNLIMIT,
            problems: [],
            courses: [],
            tags: [],
            course: UNLIMIT,
            selectedTags: [],
            title: '',
            status: ['隱藏（老師和作者可見）', '顯示'],
            deleteProblemDialog: false,
            deleting: -1,
            profile: {
                username: '',
                displayName: '',
                role: 2,
            },
            clonePid: '',
            cloneToCourse: '',
            cloneProblemDialog: false,
        }
    },

    beforeMount() {
        this.profile = getProfile()
        this.course = this.profile.course;
        getCourses().then(courses => {
            if ( this.profile.role == 2 ) this.courses = [this.course]
            else    this.courses = courses
        })
        this.getProblems()
    },

    watch: {
        course() {
            this.getProblems();
        }
    },

    methods: {
        async getProblems() {
            let result, res = [];
            try {
                let filter = {
                    offset: 0,
                    count: -1,
                }
                if (this.course != UNLIMIT) filter['course'] = this.course
                result = await this.$http.get('/problem', { params: filter });
                result = result.data.data
                result.forEach(p => {
                    if ( this.profile.role != 2 || p.author.username == this.profile.username ) {
                        res.push(p);
                    }
                })
            } catch (e) {
                console.log(e);
            }
            this.problems = res;
        },
        async cloneProblem(pid, course) {
            if (course == '' || course == UNLIMIT) return;
            let result;
            try {
                result = await this.$http.get(`/problem/${pid}/clone/${course}`);
            } catch (e) {
                console.log(e);
            }
            this.getProblems()
        },
        async deleteProblem(pid) {
            let result;
            try {
                result = await this.$http.delete(`/problem/${pid}`);
            } catch (e) {
                console.log(e);
            }
            this.getProblems()
        }
    },
});