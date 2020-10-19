<template>
  <div :class="['text-body-1 mt-4 no-account', fontColor]">
    沒有帳號嗎?
    <a :class="['no-account-link', fontColor]" href="#">以訪客身份登入</a>
    <v-tooltip bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-icon v-bind="attrs" v-on="on" :color="color">
          mdi-help-circle-outline
        </v-icon>
      </template>
      <span>以訪客身份登入，您可以瀏覽所有公開的課程與主題創作，但僅供檢視。</span>
    </v-tooltip>
  </div>
</template>

<script>
export default {
  name: 'NoAccount',

  props: {
    color: {
      type: String,
      required: true,
    },
  },

  computed: {
    fontColor() {
      return `${this.color}--text`
    },
  },
}
</script>

<style scoped>
.no-account {
  display: flex;
}
.no-account-link {
  margin-left: 8px;
  margin-right: 8px;
}
</style>
