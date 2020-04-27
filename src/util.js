import Vue from 'vue';
var vue = new Vue()

export const UNLIMIT = '不限課程'

export async function getCourses(needUnlimit = true) {
    let result;
    try {
        result = await vue.$http.get('/api/course');
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
        result = await vue.$http.get('/api/tag' + (course == UNLIMIT ? '' : '?course=' + course));
    } catch (e) {
        console.log(e);
        result = {
            'data': ['tag1', 'tag2']
        }
    }
    return result.data;
}