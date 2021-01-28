<template>
  <v-dialog :value="isShow" persistent>
    <v-card>
      <v-card-actions>
        <v-card-title>
          <div class="text-body-1 text-center">
            {{ title }}
          </div>
        </v-card-title>
        <v-spacer />
        <v-btn color="primary" large tile @click="handleClick">
          我知道了
        </v-btn>
        <v-spacer />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  name: 'Popup',

  props: {
    title: {
      type: String,
      required: true,
    },
    isShow: {
      type: Boolean,
      required: true,
    },
  },

  methods: {
    handleClick() {
      this.$emit('click')
    },
  },
}
</script>

<style></style>
