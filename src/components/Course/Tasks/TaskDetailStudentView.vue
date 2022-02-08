<template>
  <v-card-text class="pl-4">
    <div
      v-for="(req, index) in task.requirements"
      :key="req._id || req"
      class="d-flex align-center my-1 text--primary"
    >
      <spinner v-if="typeof req === 'string'" />
      <template v-else>
        <v-icon
          class="mr-3"
          :color="req.progress[0] === req.progress[1] ? 'primary' : 'gray'"
        >
          {{
            req.progress[0] === req.progress[1]
              ? 'mdi-checkbox-marked-circle'
              : 'mdi-checkbox-blank-circle-outline'
          }}
        </v-icon>
        <span class="text-body-2">{{ index+1 }}. {{ req.description }}</span>
      </template>
    </div>
  </v-card-text>
</template>

<script>
export default {
  props: {
    task: {
      type: Object,
      required: true,
    },
  },
}
</script>
