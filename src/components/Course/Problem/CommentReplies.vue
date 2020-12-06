<template>
  <div>
    <v-card
      class="mt-4"
      tile
      v-for="({ id, author, created, updated, status, content }, index) in replies"
      :key="id"
    >
      <div class="d-flex py-4">
        <v-avatar class="ml-4" size="36" color="primary">
          <span class="white--text headline">{{ author.displayName.slice(0, 1) }}</span>
        </v-avatar>
        <div class="d-flex flex-column">
          <v-card-title class="d-flex flex-row align-center flex-wrap text-body-2 pt-0">
            <router-link
              class="mr-2"
              :to="{ name: 'profile', params: { username: author.username } }"
            >
              {{ author.displayName }}
            </router-link>
            <v-tooltip right>
              <template v-slot:activator="{ on, attr }">
                <div v-on="on" v-bind="attr">
                  {{ `${$timeFromNow(created)}` }}
                </div>
              </template>
              <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
            </v-tooltip>
            {{ created !== updated ? '（已編輯）' : '' }}
          </v-card-title>

          <div v-if="status === 0" v-html="'<p><i>此留言已刪除</i></p>'" />
          <div v-else-if="isEdit[index]">
            <TextEditor v-model="newReplies[index]" />
            <div class="d-flex mt-1">
              <v-btn class="mr-2" color="primary" small tile @click="updateReply(id, index)">
                送出
              </v-btn>
              <v-btn color="primary" outlined tile small @click="cancelEditReply(index)">
                取消
              </v-btn>
            </div>
          </div>
          <div v-else class="px-4 pb-2 text--primary" v-html="content" />

          <!-- TODO: edit & delete -->
          <div class="d-flex" v-if="$isSelf(author.username) && !isEdit[index]">
            <v-btn class="text-button" text small @click="editReply(index)">
              編輯
            </v-btn>
            <v-btn class="text-button" text small @click="deleteReply(id)">
              刪除
            </v-btn>
          </div>
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'

export default {
  props: {
    replies: {
      type: Array,
      required: true,
    },
  },

  components: { TextEditor },

  data: () => ({
    newReplies: null,
    isEdit: null,
  }),

  created() {
    this.newReplies = this.replies.map(reply => reply.content)
    this.isEdit = Array(this.replies.length).fill(false)
  },

  methods: {
    editReply(index) {
      this.$set(this.isEdit, index, true)
    },
    cancelEditReply(index) {
      this.$set(this.isEdit, index, false)
    },
    updateReply(id, index) {
      this.$emit('update-reply', id, this.newReplies[index])
      this.$set(this.isEdit, index, false)
    },
    deleteReply(id) {
      const result = window.confirm('確認要刪除嗎？')
      if (result) {
        this.$emit('delete-reply', id)
      }
    },
  },
}
</script>
