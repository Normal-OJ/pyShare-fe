import Vue from 'vue';
import html from './index.pug';
import './index.scss';
import { getProfile, toDateString } from '@/util.js'
import Result from '@/components/Result'
import { Editor, EditorContent } from 'tiptap';
import {
    Blockquote,
    CodeBlock,
    HardBreak,
    Heading,
    OrderedList,
    BulletList,
    ListItem,
    TodoItem,
    TodoList,
    Bold,
    Code,
    CodeBlockHighlight,
    Italic,
    Link,
    Strike,
    Underline,
    History,
} from 'tiptap-extensions';
// import Vuex file ...

export default Vue.extend({
    template: html,

    components: {
        Result,
        EditorContent
    },

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
            displayName: getProfile().displayName,
            problem: null,
            newComment: {
                target: 'problem',
                id: this.$route.params.id,
                title: '',
                content: '',
                code: '',
            },
            editComment: {
                title: '',
                content: '',
                code: '',
            },
            editor: new Editor({
                editable: false,
                extensions: [
                    new Blockquote(),
                    new CodeBlock(),
                    new HardBreak(),
                    new Heading({ levels: [1, 2, 3] }),
                    new BulletList(),
                    new OrderedList(),
                    new ListItem(),
                    new TodoItem(),
                    new TodoList(),
                    new Bold(),
                    new Code(),
                    new Italic(),
                    new Link(),
                    new Strike(),
                    new Underline(),
                    new History(),
                    new CodeBlockHighlight()
                ],
            }),
            username: getProfile().uesrname,
        }
    },

    beforeMount() {
        this.getProblem()
    },

    methods: {
        timeFormat(timestamp) {
            return toDateString(timestamp)
        },
        async getProblem() {
            let result;
            try {
                result = await this.$http.get('/problem/' + this.$route.params.id);
                console.log(result)
                result = result.data.data
                this.isReplyShowed = new Array(result.comments.length)
                this.isCommentEditing = new Array(result.comments.length)
                this.replyInputs = new Array(result.comments.length)
                this.isReplyShowed.fill(false)
                this.isCommentEditing.fill(false)
                this.replyInputs.fill({ show: false, text: '' })
                this.problem = result
                console.log(JSON.parse(this.problem.description))
                this.editor.setContent(JSON.parse(this.problem.description), false)
            } catch (e) {
                console.log(e);
            }

            let comments = this.problem.comments
            for (let i = 0; i < comments.length; i++) {
                try {
                    result = await this.$http.get('/comment/' + comments[i]);
                    result.data.data.id = comments[i]
                    this.$set(this.problem.comments, i, result.data.data)
                } catch (e) {
                    console.log(e);
                    this.$set(this.problem.comments, i, '')
                }

                for (let j = 0; j < comments[i].replies.length; j++) {
                    try {
                        result = await this.$http.get('/comment/' + comments[i].replies[j]);
                        result.data.data.id = comments[i].replies[j]
                        this.$set(this.problem.comments[i].replies, j, result.data.data)
                    } catch (e) {
                        console.log(e);
                        this.$set(this.problem.comments[i].replies, j, '')
                    }
                }
            }

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
                    this.editComment = { content: this.problem.comments[idx].content, code: this.problem.comments[idx].submission.code }
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
        async likeComment(id) {
            try {
                result = await this.$http.get(`/comment/${id}/like`)
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async addNewComment(data) {
            let result
            try {
                result = await this.$http.post('/comment', data, { emulateJSON: true });
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async addNewReply(_id, _content) {
            let result
            try {
                result = await this.$http.post('/comment', {
                    target: 'comment',
                    id: _id,
                    content: _content,
                    title: '',
                    code: '',
                }, { emulateJSON: true });
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async update(id, data, idx) {
            let result
            data.title = this.problem.comments[idx].title;
            console.log(data)
            try {
                result = await this.$http.put(`/comment/${id}`, data);
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async delete(id) {
            let result
            try {
                result = await this.$http.delete(`/comment/${id}`);
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async download() {
            let result
            try {
                result = await this.$http.get(`/problem/${this.problem.pid}/attachment/${this.browsing}`);
                var file = new Blob([result], { type: 'text/plain;charset=utf-8' });
                if (window.navigator.msSaveOrOpenBlob) { // IE10+
                    window.navigator.msSaveOrOpenBlob(file, 'report.xls');
                } else { // Others
                    var a = document.createElement("a");
                    var url = URL.createObjectURL(file);
                    a.href = url;
                    a.download = 'report.xls';
                    document.body.appendChild(a);
                    a.click();
                    setTimeout(function() {
                        document.body.removeChild(a);
                        window.URL.revokeObjectURL(url);
                    }, 0);
                }
            } catch (e) {
                console.log(e);
            }
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
        likeColor(users, name) {
            for (let i = 0; i < users.length; ++i)
                if (users[i] == name)
                    return '#e07fa0'
            return '#777'
        },
        reGet(comment_id) {
            let result
            try {
                result = await this.$http.get('/comment/' + comment_id);
            } catch (e) {
                console.log(e);
            }
        },
        reJudge(comment_id) {
            let result
            try {
                result = await this.$http.get(`/comment/${comment_id}/rejudge`);
            } catch (e) {
                console.log(e);
            }
        }
    },
});