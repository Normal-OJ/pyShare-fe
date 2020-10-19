<template>
  <Fragment>
    <CommentItem
      v-for="{ title, id, floor, author } in comments"
      :key="id"
      :title="title"
      :id="id"
      :floor="floor"
      :author="author"
    />
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import CommentItem from './CommentItem'

export default {
  name: 'CommentList',

  props: {
    comments: {
      type: Array,
      required: true,
    },
  },

  components: { CommentItem, Fragment },

  data: () => ({}),
}
</script>
