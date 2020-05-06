import Vue from 'vue';
import html from './index.pug';
import { getProfile, getCourses } from '@/util.js'

export default Vue.extend({
    template: html,

    data() {
        return {
            courses: [],
            course: '',
            newCourseDialog: false,
            newCourseName: '',
            newStudentDialog: false,
            newStudentFile: null,
            deleteStudentDialog: false,
            deleteStudentName: '',
            studentData: [{
                    username: 'studentA',
                    displayName: 'stA',
                    post: 2,
                    comment: 2,
                    reply: 2,
                    starGive: 2,
                    star: 2,
                    success: 5,
                    fail: 5,
                    review: 0,
                },
                {
                    username: 'studentB',
                    displayName: 'stB',
                    post: 1,
                    comment: 1,
                    reply: 0,
                    starGive: 10,
                    star: 500,
                    success: 17,
                    fail: 30,
                    review: 1,
                },
                {
                    username: 'studentC',
                    displayName: 'stC',
                    post: 0,
                    comment: 5,
                    reply: 15,
                    starGive: 1,
                    star: 5000,
                    success: 1,
                    fail: 2,
                    review: 1,
                },
            ],
        }
    },

    beforeMount() {
        getCourses(false).then(courses => this.courses = courses)
    },

    watch: {
        course() {}
    },

    methods: {
        async createCourse(name) {
            let result;
            try {
                result = await this.$http.post('/course', {
                    name: name,
                    teacher: getProfile().username
                }, { emulateJSON: true });
            } catch (e) {
                console.log(e);
            }
        },
        async createStudent(file) {
            // try {
            //     result = await this.$http.post('/auth/batch-signup', {
            //         course: this.course,
            //         csvString: file,
            //     });
            //     console.log(result)
            // } catch (e) {
            //     console.log(e)
            // }
            let result;
            let r = new FileReader();
            let vue = this;

            r.onload = async function(e) {
                let contents = e.target.result;
                // let usernames = contents.split('\n').slice(1).map(line => line.split(',')[0])

                try {
                    // result = await vue.$http.patch(`/course/${vue.course}/student/insert`, {
                    //     users: usernames
                    // });
                    console.log(contents)
                    result = await vue.$http.post('/auth/batch-signup', {
                        course: vue.course,
                        csvString: contents,
                    });
                    console.log(result)
                } catch (e) {
                    console.log(e);
                }
            }
            r.readAsText(file);
        },
        async deleteStudent(username) {
            let result;
            try {
                result = await this.$http.patch(`/course/${this.course}/student/remove`, {
                    users: [username]
                });
            } catch (e) {
                console.log(e);
            }
        },
    },
});