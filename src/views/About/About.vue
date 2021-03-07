<template>
  <div>
    <ReleaseNote :releases="releases" />
    <MeetOurTeam />
  </div>
</template>

<script>
import ReleaseNote from '@/components/About/ReleaseNote'
import MeetOurTeam from '@/components/About/MeetOurTeam'
import agent from '@/api/agent'

export default {
  components: { ReleaseNote, MeetOurTeam },

  data: () => ({
    releases: [],
  }),

  created() {
    this.getReleases()
  },

  methods: {
    async getReleases() {
      try {
        this.releases = await agent.Gitlab.getReleases()
      } catch (error) {
        console.log('[views/About/getReleases] error', error)
        throw error
      }
    },
  },
}
</script>
