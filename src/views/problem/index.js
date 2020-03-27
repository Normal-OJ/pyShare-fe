import Vue from 'vue';
import html from './index.pug';
// import Vuex file ...

export default Vue.extend({
    template: html,

    data() {
        return {
            lists: [
                { title: '說明', icon: 'mdi-text' },
                { title: '程式', icon: 'mdi-code-tags' },
                { title: '結果', icon: 'mdi-chart-bar' },
            ],
            browsing: '請選擇',
            attachments: ['bicycle.csv', 'readme.txt', 'bike.txt'],
            examples: [`切資料真的是很 重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
        切資料真的是很重要的技術，要搞清楚T^T
      `, '切資料真的是很重要的技術，要搞清楚T^T', '1235678'],
        }
    },

    ready() {},

    beforeMount() {
        this.getProblem()
    },

    methods: {
        async getProblem() {
            let result;
            try {
                result = await this.$http.get('/api/problem/' + $route.params.id);
            } catch (e) {
                console.log(e);
                result = {
                    'data': {
                        pid: '1',
                        title: 'DSCP修課背景分析',
                        description: '測試說明',
                        timestamp: '',
                        author: {
                            username: 'tcc',
                            displayedName: '蔣宗哲',
                        },
                        course: 'math',
                        status: 0,
                        tags: ['台灣獨立'],
                        comments: [],
                        defaultCode: 'push -f'
                    }
                }
            }
            this.problem = result.data
        }
    },
});