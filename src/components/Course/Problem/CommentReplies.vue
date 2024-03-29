<template>
  <div>
    <template
      v-for="({ id, author, created, updated, status, content }, index) in replies"
    >
      <v-card
        v-if="status !== 0"
        :key="id"
        class="mt-4"
        tile
      >
        <div class="d-flex py-4">
          <Gravatar
            class="ml-4"
            :size="36"
            :md5="author.md5"
          />
          <div class="d-flex flex-column">
            <v-card-title class="d-flex flex-row align-center flex-wrap text-body-2 pt-0">
              <router-link
                class="mr-2"
                :to="{ name: 'profile', params: { id: author.id } }"
              >
                {{ author.displayName }}
              </router-link>
              <v-tooltip top>
                <template #activator="{ on, attr }">
                  <div
                    v-bind="attr"
                    v-on="on"
                  >
                    {{ `${$timeFromNow(created)}` }}
                  </div>
                </template>
                <span>{{ `發布於 ${$formattedTime(created)}` }}</span>
              </v-tooltip>
              {{ created !== updated ? '（已編輯）' : '' }}
              <div v-if="$isSelf(author.username) && !isEdit[index]">
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      class="ml-2 rounded"
                      color="primary darken-3"
                      x-small
                      icon
                      v-bind="attrs"
                      @click="editReply(index)"
                      v-on="on"
                    >
                      <v-icon small>
                        mdi-pencil-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>編輯留言</span>
                </v-tooltip>
                <v-tooltip top>
                  <template #activator="{ on, attrs }">
                    <v-btn
                      class="ml-2 rounded"
                      color="primary darken-3"
                      x-small
                      icon
                      v-bind="attrs"
                      @click="deleteReply(id)"
                      v-on="on"
                    >
                      <v-icon small>
                        mdi-trash-can-outline
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>刪除留言</span>
                </v-tooltip>
              </div>
            </v-card-title>
            <div v-if="isEdit[index]">
              <TextEditor v-model="newReplies[index]" />
              <div class="d-flex mt-1">
                <v-btn
                  class="mr-2"
                  color="primary"
                  small
                  tile
                  @click="updateReply(id, index)"
                >
                  送出
                </v-btn>
                <v-btn
                  color="primary"
                  outlined
                  tile
                  small
                  @click="cancelEditReply(index)"
                >
                  取消
                </v-btn>
              </div>
            </div>
            <div
              v-else
              class="px-4 pb-2 text--primary problem-description"
              v-html="content"
            />
          </div>
        </div>
      </v-card>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    replies: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    newReplies: null,
    isEdit: null,
  }),

  created() {
    this.newReplies = this.replies.map((reply) => reply.content)
    this.isEdit = Array(this.replies.length).fill(false)
  },

  methods: {
    editReply(index) {
      this.$set(this.newReplies, index, this.replies[index].content)
      this.$set(this.isEdit, index, true)
      this.$emit('mutate-is-editing', true)
    },
    cancelEditReply(index) {
      this.$set(this.isEdit, index, false)
      if (this.isEdit.every((edit) => !edit)) {
        this.$emit('mutate-is-editing', false)
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
