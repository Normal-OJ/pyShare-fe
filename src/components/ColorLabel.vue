<template>
  <v-container>
    <div class="d-flex flex-wrap">
      <v-chip
        v-for="(tag, index) in tags"
        :key="index"
        class="ma-2"
        label
        :color="color[index % color.length].color"
        :dark="color[index % color.length].dark"
      >
        {{ tag }}
      </v-chip>
    </div>
  </v-container>
</template>

<script>
export default {
  props: {
    tags: {
      type: Array,
      default: () => [
        '個人專題',
        '體育',
        '法律',
        '個人專題',
        '體育',
        '法律',
        '個人專題',
        '體育',
        '法律',
        '個人專題',
        '體育',
        '法律',
      ],
    },
  },

  data: () => ({
    color: [
      { color: '#3d5a80', dark: true },
      { color: '#293241', dark: true },
      { color: '#797d62', dark: true },
      { color: '#d08c60', dark: true },
      { color: '#a6808c', dark: true },
      { color: '#d81159', dark: true },
      { color: '#b9375e', dark: true },
      { color: '#f2b5d4', dark: false },
      { color: '#7bdff2', dark: false },
    ],
  }),
}
</script>
