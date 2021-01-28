<template>
  <v-dialog :value="isShow" width="50%" persistent>
    <v-card class="py-8">
      <div class="d-flex flex-column align-center pb-8">
        <div>
          <v-icon size="66" color="error">mdi-alert-circle-outline</v-icon>
        </div>
        <div class="text-h5 text-center mt-3">
          {{ title }}
        </div>
      </div>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" class="px-16" large tile @click="handleClick">
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
