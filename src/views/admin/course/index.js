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
            studentData: []
        }
    },

    beforeMount() {
        getCourses(false).then(courses => this.courses = courses)
    },

    watch: {
        async course() {
            let result;
            try {
                result = await this.$http.get(`/course/${this.course}/statistic`);
                result = result.data;
            } catch (e) {
                console.log(e);
            }
            result.data.forEach(d => {
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
            console.log(this.studentData)
        }
    },

    methods: {
        async createCourse(name) {
            let result;
            try {
                result = await this.$http.post('/course', {
                    name: name,
                    teacher: getProfile().username
                });
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