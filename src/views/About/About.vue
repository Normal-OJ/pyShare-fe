<template>
  <div>
    <ReleaseNote
      :releases="releases"
      :is-loading="isLoading"
    />
    <v-divider class="mt-4" />
    <MeetOurTeam />
  </div>
</template>

<script>
export default {
  data: () => ({
    releases: null,
    isLoading: true,
  }),

  created() {
    this.getReleases()
  },

  methods: {
    async getReleases() {
      try {
        this.releases = await this.$agent.Gitlab.getReleases()
      } catch (error) {
        console.log('[views/About/getReleases] error', error)
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
}
</script>
