<template>
  <div>
    <v-card
      class="mt-4"
      tile
      v-for="({ id, author, created, updated, status, content }, index) in replies"
      :key="id"
    >
      <div class="d-flex py-4">
        <Gravatar class="ml-4" :size="36" :md5="author.md5" />
        <div class="d-flex flex-column">
          <v-card-title class="d-flex flex-row align-center flex-wrap text-body-2 pt-0">
            <router-link class="mr-2" :to="{ name: 'profile', params: { id: author.id } }">
              {{ author.displayName }}
            </router-link>
            <v-tooltip top>
              <template v-slot:activator="{ on, attr }">
                <div v-on="on" v-bind="attr">
                  {{ `${$timeFromNow(created)}` }}
                </div>
              </template>
              <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
            </v-tooltip>
            {{ created !== updated ? '（已編輯）' : '' }}
            <div v-if="$isSelf(author.username) && !isEdit[index] && status !== 0">
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ml-2 rounded"
                    color="primary darken-3"
                    x-small
                    icon
                    @click="editReply(index)"
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon small>mdi-pencil-outline</v-icon>
                  </v-btn>
                </template>
                <span>編輯留言</span>
              </v-tooltip>
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    class="ml-2 rounded"
                    color="primary darken-3"
                    x-small
                    icon
                    @click="deleteReply(id)"
                    v-on="on"
                    v-bind="attrs"
                  >
                    <v-icon small>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </template>
                <span>刪除留言</span>
              </v-tooltip>
            </div>
          </v-card-title>
          <div v-if="status === 0" v-html="'<p>&nbsp;&nbsp;<i>此留言已刪除</i></p>'" />
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
        </div>
      </div>
    </v-card>
  </div>
</template>

<script>
import TextEditor from '@/components/UI/TextEditor'
import Gravatar from '@/components/UI/Gravatar'

export default {
  props: {
    replies: {
      type: Array,
      required: true,
    },
    setIsEdit: {
      type: Function,
      required: true,
    },
  },

  components: { TextEditor, Gravatar },

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
      this.$set(this.newReplies, index, this.replies[index].content)
      this.$set(this.isEdit, index, true)
      this.setIsEdit(true)
    },
    cancelEditReply(index) {
      this.$set(this.isEdit, index, false)
      if (this.isEdit.every(edit => !edit)) {
        this.setIsEdit(false)
      }
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
