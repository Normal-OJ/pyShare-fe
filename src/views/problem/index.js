import Vue from 'vue';
import html from './index.pug';
import './index.scss';
import { getProfile, toDateString } from '@/util.js'
import Result from '@/components/Result'
import python from 'highlight.js/lib/languages/python';
import css from 'highlight.js/lib/languages/css';
import Clipboard from 'clipboard'
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
            preview: '',
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
            sortingValue: 0,
            sorting: [
                { title: '依照日期（早至晚）排序', value: 0 },
                { title: '依照日期（晚至早）排序', value: 1 },
                { title: '依照愛心（多至少）排序', value: 2 },
                { title: '依照愛心（少至多）排序', value: 3 },
            ],
            username: '',
            displayName: '',
            problem: null,
            newComment: {
                target: 'problem',
                id: this.$route.params.id,
                title: '',
                content: '',
                code: '',
            },
            newCommentLoading: false,
            newingReply: null,
            newReply: {
                target: 'comment',
                id: '',
                title: '',
                content: '',
                code: '',
            },
            editingComment: null,
            editComment: {
                title: '',
                content: '',
                code: '',
            },
            editingReply: null,
            editReply: {
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
                    new CodeBlockHighlight({
                        languages: {
                            python,
                            css,
                        },
                    })
                ],
            }),
            downloading: false,
            alert: {
                color: 'primary',
                msg: '',
            },
            snackbar: false,
        }
    },

    beforeMount() {
        this.getProblem()
        this.displayName = getProfile().displayName
        this.username = getProfile().username
    },

    watch: {
        async browsing() {
            if ( this.browsing === '請選擇' )  return;
            let result = await this.$http.get(`/problem/${this.problem.pid}/attachment/${this.browsing}`);
            this.preview = result.data.split('\n').slice(0, 5).join('\n');
        },
        sortingValue() {
            this.sortCommments();
        },
    },

    methods: {
        timeFormat(timestamp) {
            return toDateString(timestamp)
        },
        async getProblem() {
            let result;
            try {
                result = await this.$http.get('/problem/' + this.$route.params.id);
                result = result.data.data;
            } catch (e) {
                console.log(e);
                return
            }
            let comments = result.comments;
            let numberOfComment = 0;
            for (let i = 0; i < result.comments.length; i++) {
                // get comments and count how many commenst are visible
                numberOfComment += await this.getComment(result.comments, i);

                // invisible comment will be set as '' (empty string)
                if ( result.comments[i] === '' )    continue;

                let numberOfReply = 0;
                for (let j = 0; j < result.comments[i].replies.length; j++) {
                    // get replies and count how many replies are visible
                    numberOfReply += await this.getReply(result.comments[i].replies, j);
                }
                result.comments[i].numberOfReply = numberOfReply;
            }
            result.numberOfComment = numberOfComment;
            this.problem = result
            this.editor.setContent(JSON.parse(this.problem.description), false)
            this.newComment.code = this.problem.defaultCode;
            this.setupClipboard();
            this.sortCommments();
        },
        async getComment(comments, idx) {
            let visibleComment = 1;
            try {
                let id = comments[idx];
                let res = await this.$http.get('/comment/' + id);
                comments[idx] = res.data.data;
                comments[idx].id = id;
                comments[idx].showReplies = false;
                if ( comments[idx].status == 0 ) {
                    comments[idx] = '';
                    visibleComment = 0;
                }
            } catch (e) {
                console.log(e);
                comments[idx] = '';
                visibleComment = 0;
            }
            return visibleComment;
        },
        async getReply(replies, idx) {
            let visibleReply = 1;
            try {
                let id = replies[idx];
                let res = await this.$http.get('/comment/' + id);
                replies[idx] = res.data.data;
                replies[idx].id = id;
                if ( replies[idx].status == 0 ) {
                    replies[idx] = '';
                    visibleReply = 0;
                }
            } catch (e) {
                console.log(e);
                replies[idx] = '';
                visibleReply = 0;
            }
            return visibleReply;
        },
        switchShowReply(idx) {
            this.problem.comments[idx].showReplies = !this.problem.comments[idx].showReplies;
        },
        addReply(comment_id) {
            this.newReply.id = comment_id;
            this.newReply.content = '';
            this.newingReply = comment_id;
        },
        menuTouch(opt, cls, id, data) {
            if (opt == '編輯') {
                if (cls == 'comment') {
                    this.editComment = { title: data.title, content: data.content, code: data.submission.code }
                    this.editingComment = id;
                } else {
                    this.editReply.content = data.content;
                    this.editingReply = id;
                }
            } else {
                this.delete(id);
            }
        },
        async likeComment(id, idx) {
            try {
                let result = await this.$http.get(`/comment/${id}/like`)
            } catch (e) {
                console.log(e);
            }
            await this.reGet(id, idx)
            this.sortCommments();
        },
        likeColor(users, name) {
            for (let i = 0; i < users.length; ++i) {
                if (users[i].username === name)
                    return '#e07fa0'
            }
            return '#777777'
        },
        async add(data, idx) {
            if ( data.target == 'problem' ) this.newCommentLoading = true;
            try {
                let result = await this.$http.post('/comment', data, { emulateJSON: true });
            } catch (e) {
                console.log(e);
            }
            await this.getProblem()
            if ( idx != -1 )
                this.problem.comments[idx].showReplies = true;
            else {
                this.newComment.title = '';
                this.newComment.content = '';
                this.newComment.code = this.problem.defaultCode;
            }
            this.newCommentLoading = false;
            this.sortCommments();
        },
        async update(id, data, idx) {
            try {
                let result = await this.$http.put(`/comment/${id}`, data);
            } catch (e) {
                console.log(e);
            }
            await this.getProblem()
            if ( idx != -1 )
                this.problem.comments[idx].showReplies = true;
        },
        async delete(id) {
            try {
                let result = await this.$http.delete(`/comment/${id}`);
            } catch (e) {
                console.log(e);
            }
            this.getProblem()
        },
        async download() {
            let url = `/api/problem/${this.problem.pid}/attachment/${this.browsing}`;
            let routeData = this.$router.resolve({path: url});
            window.open(routeData.href, '_blank');
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
        async reGet(comment_id, idx) {
            try {
                let result = await this.$http.get('/comment/' + comment_id);
                result = result.data.data;
                result.id = comment_id;
                let numberOfReply = 0;
                for (let i = 0; i < result.replies.length; i++) {
                    // re get replies and count how many visible replies
                    numberOfReply += this.getReply(result.replies, i);
                }
                result.numberOfReply = numberOfReply;
                this.$set(this.problem.comments, idx, result);
            } catch (e) {
                console.log(e);
            }
        },
        async reJudge(comment_id) {
            try {
                let result = await this.$http.get(`/comment/${comment_id}/rejudge`);
            } catch (e) {
                console.log(e);
            }
            this.reGet(comment_id)
        },
        setupClipboard() {
            const clipboard = new Clipboard('.copy-code',
            {
               target: trigger => {
                    let id = trigger.id.substr(4);
                    return document.getElementById(id);
                }
            });
            clipboard.on('success', evt => {
                this.snackbar = false;
                this.alert = {
                    color: 'primary',
                    msg: 'The code has been copied into the clipboard!',
                };
                this.snackbar = true;
                evt.clearSelection();
            });
            clipboard.on('error', err => {
                this.snackbar = false;
                this.alert = {
                    color: 'error',
                    msg: 'Could not copy code!',
                }
                this.snackbar = true;
            });
        },
        sortCommments() {
            switch ( this.sortingValue ) {
                case 0:
                    this.problem.comments.sort((a, b) => {
                        if ( a === '' || b === '' ) return 0;
                        return a.created - b.created;
                    });
                    break;
                case 1:
                    this.problem.comments.sort((a, b) => {
                        if ( a === '' || b === '' ) return 0;
                        return b.created - a.created;
                    });
                    break;
                case 2:
                    this.problem.comments.sort((a, b) => {
                        if ( a === '' || b === '' ) return 0;
                        return b.liked.length - a.liked.length;
                    });
                    break;
                case 3:
                    this.problem.comments.sort((a, b) => {
                        if ( a === '' || b === '' ) return 0;
                        return a.liked.length - b.liked.length;
                    });
                    break;
            }
        },
        toTop() {
            this.$vuetify.goTo(0);
        },
        toBottom() {
            this.$vuetify.goTo(document.body.offsetHeight);
        },
    },
});