<template>
  <Fragment>
    <div class="mt-4 d-flex flex-row align-center">
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
          <div v-else class="d-flex">
            <v-text-field v-model="newComment.title" outlined dense hide-details autofocus />
            <v-btn class="ma-1" color="primary" small @click="cancelEditComment(COMMENT_KEY.TITLE)">
              <v-icon>mdi-check</v-icon>
            </v-btn>
            <v-btn class="ma-1" color="primary" small @click="cancelEditComment(COMMENT_KEY.TITLE)">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
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
        <div class="d-flex flex-row align-center text-body-2 pl-2">
          <router-link :to="{ name: 'profile', params: { username: comment.author.username } }">
            {{ comment.author.displayName }}
          </router-link>
          <div class="text-body-2">&nbsp;·&nbsp;{{ comment.floor }}&nbsp;樓&nbsp;·&nbsp;</div>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attr }">
              <div class="text-body-2" v-on="on" v-bind="attr">
                {{ `opened ${$timeToNow(comment.created)}` }}
              </div>
            </template>
            <span>{{ `發布於 ${$formattedTime(comment.created)}` }}</span>
          </v-tooltip>
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
    <v-expansion-panels class="mt-6" accordion multiple :value="[0, 1, 2]">
      <!-- Creation Content -->
      <v-expansion-panel>
        <v-expansion-panel-header>
          <div class="d-flex align-center">
            創作說明
            <v-btn class="ml-4" small icon @click.stop="editComment(COMMENT_KEY.CONTENT)">
              <v-icon small>mdi-pencil</v-icon>
            </v-btn>
          </div>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <div v-if="!isEdit[COMMENT_KEY.CONTENT]" v-html="comment.content" />
          <div v-else>
            <TextEditor v-model="newComment.content" />
            <div class="d-flex">
              <v-btn
                class="ma-1"
                color="primary"
                small
                @click="cancelEditComment(COMMENT_KEY.CONTENT)"
              >
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn
                class="ma-1"
                color="primary"
                small
                @click="cancelEditComment(COMMENT_KEY.CONTENT)"
              >
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Code -->
      <v-expansion-panel>
        <v-divider />
        <v-expansion-panel-header>程式</v-expansion-panel-header>
        <v-expansion-panel-content>
          <CodeEditor v-model="comment.submission.code" readOnly />
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- Result -->
      <v-expansion-panel>
        <v-divider />
        <v-expansion-panel-header>執行結果</v-expansion-panel-header>
        <v-expansion-panel-content>
          <CommentResult :cid="comment.id" :result="comment.submission.result" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import TextEditor from '@/components/TextEditor'
import CodeEditor from '@/components/CodeEditor'
import { SUBMISSION_STATUS, SUBMISSION_COLOR } from '@/constants/submission'
import CommentResult from './CommentResult'

const COMMENT_KEY = {
  TITLE: 'title',
  CONTENT: 'content',
}

export default {
  name: 'Comment',

  components: { Fragment, TextEditor, CodeEditor, CommentResult },

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
      [COMMENT_KEY.CONTENT]: '',
    },
    isEdit: {
      [COMMENT_KEY.TITLE]: false,
      [COMMENT_KEY.CONTENT]: false,
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
