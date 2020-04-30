import Vue from 'vue';
import html from './index.pug';
import './index.scss';
// import Vuex file ...

export default Vue.extend({
    template: html,

    data() {
        return {
            problem: null,
            browsing: '請選擇',
            attachments: ['bicycle.csv', 'readme.txt', 'bike.txt'],
            lists: [
                { title: '說明', key: 'content', icon: 'mdi-text' },
                { title: '程式', key: 'code', icon: 'mdi-code-tags' },
                { title: '結果', key: 'result', icon: 'mdi-chart-bar' },
            ],
        }
    },

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
                        timestamp: '2020/4/30',
                        author: {
                            username: 'tcc',
                            displayName: '蔣宗哲',
                        },
                        course: 'math',
                        status: 0,
                        tags: ['台灣獨立'],
                        comments: [
                          {
                            id: '123',
                            author: {
                                username: 'bogay',
                                displayName: '莊博傑',
                            },
                            title: '留言標題',
                            content: `切資料真的是很 重要的技術，要搞清楚T^T
                                    切資料真的是很重要的技術，要搞清楚T^T
                                    切資料真的是很重要的技術，要搞清楚T^T
                                    `,
                            code: `def a():`,
                            result: `test`,
                            timestamp: '2020/4/20',
                            star: 7777,
                            status: 1,
                            reply: [{
                                author: {
                                    username: 'skps',
                                    displayName: '盧昭華',
                                },
                                content: 'replying...',
                                status: 1,
                                timestamp: '2020/4/21',
                            }],
                          },
                        ],
                        defaultCode: 'push -f'
                    }
                }
            }
            this.problem = result.data
        },
        likeComment(id) {
            this.$http.get(`/comment/${id}/like`);
        },
    },
});