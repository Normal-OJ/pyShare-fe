import Vue from 'vue';
import html from './index.pug';
// import Vuex file ...

export default Vue.extend({
    template: html,

    data() {
        return {
            statistic: {}
        }
    },

    computed: {
        totalLikedAmount() {
            return this.statistic.liked.reduce((a, b) => {
                return a + b.starers.length;
            }, 0)
        },
        totalLikesAmount() {
            return this.statistic.likes.length;
        }
    },

    beforeMount() {
        this.getStatistic()
    },

    methods: {
        async getStatistic() {
            let result;
            try {
                result = await this.$http.get(`/user/${this.$route.params.name}/statistic`);
            } catch (e) {
                console.log(e);
            }
            this.statistic = result.data.data;
        },
    },
});