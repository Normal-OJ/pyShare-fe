<template>
  <v-dialog
    :value="isOpen"
    width="750"
  >
    <v-card>
      <v-card-title>
        <slot name="title" />
      </v-card-title>

      <v-card-text class="text--primary">
        <slot name="content" />
      </v-card-text>

      <v-card-actions class="justify-center">
        <v-btn
          outlined
          color="primary"
          @click="$emit('close')"
        >
          取消
        </v-btn>
        <v-btn
          class="ml-4"
          color="success"
          @click="$emit('confirm')"
        >
          確認
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
  },
}
</script>
