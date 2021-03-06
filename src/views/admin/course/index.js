import Vue from 'vue';
import html from './index.pug';
import { getProfile, getCourses } from '@/util.js'

export default Vue.extend({
    template: html,

    data() {
        return {
            headers: [
                { text: '使用者名稱', value: 'info.username', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '暱稱', value: 'info.displayedName', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '發文', value: 'problems.length', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '留言', value: 'comments.length', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '回覆', value: 'replies.length', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '獲得愛心', value: 'totalLiked', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '給予愛心', value: 'likes.length', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '執行成功', value: 'success', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '執行失敗', value: 'fail', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '已批改', value: 'passed', class: "font-weight-bold subtitle-1 text--primary" },
                { text: '詳細', value: 'manage', sortable: false, class: "font-weight-bold subtitle-1 text--primary" },
            ],
            search: '',
            courses: [],
            course: '',
            newCourseDialog: false,
            newCourseName: '',
            courseNameRule: /[\w\ _\-\.]+$/,
            newStudentDialog: false,
            newStudentFile: null,
            newSingleStuDialog: false,
            newSingleStu: {
                username: '',
                displayName: '',
                password: '',
                email: '',
            },
            deleteStudentDialog: false,
            deleteStudentName: '',
            studentData: [],
            img: require('@/assets/csv_example.png'),
            alert: {
                value: false,
                msg: '',
            },
            loading: false,
        }
    },

    beforeMount() {
        this.course = getProfile().course;
        getCourses(false).then(courses => this.courses = courses)
    },

    watch: {
        async course() {
            this.updateCourse();
        }
    },

    methods: {
        async updateCourse() {
            if ( this.$refs.form.validate() ) {
                this.loading = true;
                let result;
                try {
                    result = await this.$http.get(`/course/${this.course}/statistic`);
                    result = result.data;
                } catch (e) {
                    console.log(e);
                }
                result.data.forEach(d => {
                    d.totalLiked = d.liked.reduce((a, b) => {
                        return a + b.starers.length;
                    }, 0);
                    d.passed = 0
                    d.success = 0
                    d.fail = 0
                    d.execInfo.forEach(info => {
                        d.success += info.success
                        d.fail += info.fail
                    })
                    d.comments.forEach(c => {
                        d.passed += (c.passed ? 1 : 0)
                    })
                })
                this.studentData = result.data
                this.loading = false;
            }
        },
        async createCourse(name) {
            let result;
            try {
                result = await this.$http.post('/course', {
                    name: name,
                    teacher: getProfile().username
                });
                getCourses(false).then(courses => this.courses = courses)
            } catch (e) {
                console.log(e);
            }
        },
        async createSingleStu(data) {
            let csv = `username,displayName,password,email\n${data.username},${data.displayName},${data.password},${data.email}`;
            try {
                let result = await this.$http.post('/auth/batch-signup', {
                    course: this.course,
                    csvString: csv,
                })
                this.updateCourse();
                result = result.data.data
                    if ( result.fails.length > 0 ) {
                    this.alert.msg = '以下學生新增失敗，請確認資料是否正確\n'
                    this.alert.msg += result.fails.join('\n');
                    this.alert.value = true;
                }
            } catch (e) {
                console.log(e);
            }
        },
        async createStudent(file) {
            let result;
            let r = new FileReader();
            let vue = this;

            r.onload = async function(e) {
                let contents = e.target.result;
                try {
                    result = await vue.$http.post('/auth/batch-signup', {
                        course: vue.course,
                        csvString: contents,
                    });
                    vue.updateCourse();
                    result = result.data.data
                    if ( result.fails.length > 0 ) {
                        vue.alert.msg = '以下學生新增失敗，請確認資料是否正確\n'
                        vue.alert.msg += result.fails.join('\n');
                        vue.alert.value = true;
                    }
                } catch (e) {
                    console.log(e);
                }
            }
            r.readAsText(file);
        },
    },
});