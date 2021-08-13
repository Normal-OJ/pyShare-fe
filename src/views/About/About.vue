<template>
  <div>
    <ReleaseNote :releases="releases" :isLoading="isLoading" />
    <v-divider class="mt-4" />
    <MeetOurTeam />
  </div>
</template>

<script>
import ReleaseNote from '@/components/About/ReleaseNote'
import MeetOurTeam from '@/components/About/MeetOurTeam'

export default {
  components: { ReleaseNote, MeetOurTeam },

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
