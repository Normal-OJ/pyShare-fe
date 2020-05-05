import Vue from 'vue';
import html from './index.pug';
import './index.scss';
import { getProfile } from '@/util.js'
// import Vuex file ...

export default Vue.extend({
    template: html,

    data() {
        return {
            browsing: '請選擇',
            lists: [
                { title: '說明', key: 'content', icon: 'mdi-text', label: '新增說明...' },
                { title: '程式', key: 'code', icon: 'mdi-code-tags', label: '貼上程式碼...' },
                { title: '結果', key: 'result', icon: 'mdi-chart-bar' },
            ],
            replyLabels: {
                false: {
                    icon: 'mdi-chevron-down',
                    text: '查看'
                },
                true: {
                    icon: 'mdi-chevron-up',
                    text: '隱藏'
                }
            },
            menu: ['編輯', '刪除'],
            isCommentEditing: [], // Boolean
            isReplyShowed: [], // Boolean
            replyInputs: [], // {show: Boolean, text: String}
            /*
                username: 使用者的 username
                problem: 目前這題，提醒用 this.$route.params.id 可以拿到 pid (是根據造訪的 url)
                attachments: 該題目所有的附件
                newComment: 新留言，請看 methods: addNewComment()
            */
            username: 'username',
            problem: null,
            newComment: {
                target: 'problem',
                id: this.$route.params.id,
                title: '',
                content: '',
                code: '',
            },
            editComment: {
                content: '',
                code: '',
            },
        }
    },

    beforeMount() {
        this.getProblem()
    },

    methods: {
        async getProblem() {
            let result;
            try {
                result = await this.$http.get('/problem/' + this.$route.params.id);
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
                        attachments: ['bicycle.csv', 'readme.txt', 'bike.txt'],
                        comments: [{
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
            this.isReplyShowed = new Array(result.data.comments.length)
            this.isCommentEditing = new Array(result.data.comments.length)
            this.replyInputs = new Array(result.data.comments.length)
            this.isReplyShowed.fill(false)
            this.isCommentEditing.fill(false)
            this.replyInputs.fill({ show: false, text: '' })
            this.problem = result.data
        },
        switchShowReply(idx) {
            this.$set(this.isReplyShowed, idx, !this.isReplyShowed[idx])
        },
        setShowInput(idx, val) {
            this.$set(this.replyInputs, idx, { show: val, text: (val ? this.replyInputs[idx].text : '') })
            if (this.replyInputs[idx].show) {
                this.$nextTick(() => {
                    this.$refs['replyTextarea'][idx].focus()
                })
            }
        },
        menuTouch(opt, cls, idx, id) {
            if (opt == '編輯') {
                if (cls == 'comment') {
                    this.editComment = { content: this.problem.comments[idx].content, code: this.problem.comments[idx].code }
                    this.$set(this.isCommentEditing, idx, true)
                } else {
                    console.log('edit reply!');
                }
            } else {
                this.delete(id);
            }
        },
        cancelEditing(cls, idx) {
            if (cls == 'comment') {
                this.$set(this.isCommentEditing, idx, false);
            } else {
                console.log('stop edit reply')
            }
        },
        /*

            留言是 對一個題目
            回覆是 對一個留言

            留言有分樓層 回覆沒有

            其他資訊看看 api ref 

        */
        async likeComment(id) {
            try {
                result = await this.$http.get(`/comment/${id}/like`)
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async addNewComment(data) {
            console.log(data)
            try {
                result = await this.$http.post('/comment', data, { emulateJSON: true });
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async addNewReply(_id, _content) {
            try {
                result = await this.$http.post('/comment', {
                    target: 'comment',
                    id: _id,
                    content: _content,
                }, { emulateJSON: true });
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async update(id, data) {
            try {
                result = await this.$http.put(`/comment/${id}`, data);
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async delete(id) {
            try {
                result = await this.$http.delete(`/comment/${id}`);
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        perm(user) {
            /*
                傳入一 username (string)
                perm = 2 不是老師也不是作者（留言或回覆的作者）
                perm = 0 是作者
                perm = 1 是老師
                （作者有修刪的權限、老師只有刪）
            */
            if (user == getProfile().username) return 0;
            if (getProfile().role <= 1) return 1;
            return 2
        },
    },
});