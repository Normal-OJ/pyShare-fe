import Vue from 'vue';
import axios from 'axios'
var vue = new Vue()


export const UNLIMIT = '不限課程'

export async function getCourses(needUnlimit = true) {
    let result;
    try {
        result = await axios.get('/course');
        result = result.data
    } catch (e) {
        console.log(e);
        result = {
            'data': [{
                name: 'God',
                teacher: {
                    username: 'tcc',
                    displayedName: '蔣宗哲',
                }
            }]
        }
    }
    let courses = result.data.map(course => course.name);
    if (needUnlimit) courses.push(UNLIMIT);
    return courses
}

export async function getTags(course = UNLIMIT) {
    let result;
    try {
        result = await axios.get('/tag' + (course == UNLIMIT ? '' : '?course=' + course));
        result = result.data
    } catch (e) {
        console.log(e);
        result = {
            'data': ['tag1', 'tag2']
        }
    }
    return result.data;
}

export function getProfile() {
    if (vue.$cookies.isKey('jwt')) {
        let payload = parseJwt(vue.$cookies.get('jwt'));
        return {
            username: payload.username,
            displayName: payload.displayName,
            role: payload.role
        };
    }
    return {
        username: '',
        displayName: '',
        role: 2
    };
}

function parseJwt(token) {
    return JSON.parse(atob(token.split('.')[1])).data;
}

export function toDateString(timestamp) {
    let d = new Date(timestamp * 1000);

    return `${d.getUTCFullYear()}-${('0'+(d.getMonth()+1)).slice(-2)}-${('0'+d.getDate()).slice(-2)} ${('0'+d.getHours()).slice(-2)}:${('0'+d.getMinutes()).slice(-2)}:${('0'+d.getSeconds()).slice(-2)}`
}