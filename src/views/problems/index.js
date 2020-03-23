import Vue from 'vue';
import html from './index.pug';

export default Vue.extend({
    template: html,

    data() {
        return {
            items: [{
                    title: 'DSCP修課背景分析',
                    id: '1',
                    tags: ['分類一'],
                    timestamp: '',
                    author: {
                        username: 'tcc',
                        displayName: '蔣宗哲',
                    },
                },
                {
                    title: '108-1 自行車竊案統計-3 (圖表繪製)',
                    id: '2',
                    tags: ['分類一', '分類二'],
                    timestamp: '',
                    author: {
                        username: 'tcc',
                        displayName: '蔣宗哲',
                    },
                },
                {
                    title: '108-1 自行車竊案統計-2 (圖表繪製)',
                    id: '3',
                    tags: ['分類一', '分類二'],
                    timestamp: '',
                    author: {
                        username: 'tcc',
                        displayName: '蔣宗哲',
                    },
                },
            ],
            courses: ['數學', '自然']
        }
    },

    ready() {},

    beforeMount() {
        this.getCourses()
    },

    methods: {
        async getCourses() {
            let result;
            try {
                result = await this.$http.get('/api/course');
            } catch (e) {
                console.log(e);
                result = { 'data': [{ 'name': 'math', 'teacher': 'God' }, { 'name': 'history', 'teacher': 'noob' }] }
            }
            this.courses = result.data.map((course) => course.name);
        }
    },
});