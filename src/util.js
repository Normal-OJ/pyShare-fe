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
        result = await vue.$http.get('/tag' + (course == UNLIMIT ? '' : '?course=' + course));
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
        if (payload.active === true) {
            return {
                username: payload.username,
                displayName: payload.displayName,
                role: payload.role
            };
        }
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