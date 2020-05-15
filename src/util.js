import Vue from 'vue';
var vue = new Vue()

export const UNLIMIT = '不限課程'

export async function getCourses(needUnlimit = true) {
    let result;
    try {
        result = await vue.$http.get('/course');
        result = result.data
    } catch (e) {
        console.log(e);
    }
    let courses = result.data.map(course => course.name);
    if (needUnlimit) courses.push(UNLIMIT);
    return courses
}

export async function getTags(course = UNLIMIT) {
    let result;
    try {
        result = await vue.$http.get('/tag' + (course == UNLIMIT ? '' : '?course=' + course));
        result = result.data
    } catch (e) {
        console.log(e);
    }
    return result.data;
}

export function getProfile() {
    if (vue.$cookies.isKey('jwt')) {
        let payload = parseJwt(vue.$cookies.get('jwt'));
        return {
            username: payload.username,
            displayName: payload.displayName,
            role: payload.role,
            course: payload.course
        };
    }
    return {
        username: '',
        displayName: '',
        role: 2, // 0: admin, 1: teacher, 2: student
        course: ''
    };
}

function parseJwt(token) {
    return JSON.parse(atob(token.split('.')[1])).data;
}

export function toDateString(timestamp) {
    let d = new Date(timestamp * 1000);

    return `${d.getUTCFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)} ${('0'+d.getHours()).slice(-2)}:${('0'+d.getMinutes()).slice(-2)}:${('0'+d.getSeconds()).slice(-2)}`
}