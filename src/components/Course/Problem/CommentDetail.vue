<template>
  <Fragment>
    <div class="my-2 d-flex flex-row align-center">
      <v-avatar class="mr-2" size="48">
        <img src="http://fakeimg.pl/48x48" />
      </v-avatar>
      <div class="d-flex flex-column" style="flex: 1">
        <!-- title -->
        <div class="d-flex flex-row text-body-1 align-center">
          <v-btn
            v-if="!isEdit[COMMENT_KEY.TITLE]"
            class="text-body-1 px-2"
            text
            :ripple="false"
            @click="editComment(COMMENT_KEY.TITLE)"
          >
            {{ comment.title }}
          </v-btn>
          <v-text-field
            v-else
            v-model="newComment.title"
            outlined
            dense
            hide-details
            autofocus
            @blur="cancelEditComment(COMMENT_KEY.TITLE)"
          />
          <v-spacer />
          <v-menu offset-y rounded="0">
            <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" v-bind="attrs" v-on="on" small depressed>PENDING</v-btn>
              <!-- TODO: add chevron down for teacher -->
            </template>
            <v-list>
              <v-list-item v-for="option in submissionStatusOptions" :key="option" link>
                <v-list-item-title class="text-body-2">
                  <v-chip :color="SUBMISSION_COLOR[option]" label small>{{ option }}</v-chip>
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
          <v-btn class="ml-4" icon @click="closeSelectedComment">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <!-- subtitle -->
        <div class="d-flex flex-row align-center text-body-2 pl-2" style="white-space: pre-line">
          <div>
            {{ `${comment.author.displayName} · #${comment.floor} · opened 1 week ago` }}
          </div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <div v-if="comment.hasAccepted">
                &nbsp;·&nbsp;
                <v-icon color="primary" small v-on="on" v-bind="attr">
                  mdi-check-circle
                </v-icon>
              </div>
            </template>
            <span>此創作已有其中一個版本 AC </span>
          </v-tooltip>
        </div>
      </div>
    </div>
    <div class="my-2" v-html="comment.content" />
    <CodeEditor :code="comment.submission.code" readOnly />
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import CodeEditor from '@/components/CodeEditor'
import { SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submission'

const COMMENT_KEY = {
  TITLE: 'title',
  CONTENT: 'content',
}

export default {
  name: 'Comment',

  components: { Fragment, CodeEditor },

  props: {
    comment: {
      type: Object,
      required: true,
    },
  },

  computed: {
    submissionStatusOptions() {
      return Object.keys(SUBMISSION_STATUS)
    },
  },

  data: () => ({
    SUBMISSION_STATUS,
    SUBMISSION_COLOR,
    COMMENT_KEY,
    newComment: {
      [COMMENT_KEY.TITLE]: '',
    },
    isEdit: {
      [COMMENT_KEY.TITLE]: false,
      [COMMENT_KEY.TITLE]: false,
    },
  }),

  methods: {
    closeSelectedComment() {
      this.$router.replace({ query: null })
    },
    editComment(key) {
      this.newComment[key] = this.comment[key]
      this.isEdit[key] = true
    },
    cancelEditComment(key) {
      this.isEdit[key] = false
    },
    submitEditComment() {},
  },
}
</script>
