<template>
  <Fragment>
    <ReleaseNote :releases="releases" />
    <MeetOurTeam />
  </Fragment>
</template>

<script>
import ReleaseNote from '@/components/About/ReleaseNote'
import MeetOurTeam from '@/components/About/MeetOurTeam'
import { Fragment } from 'vue-fragment'
import agent from '@/api/agent'

export default {
  components: { Fragment, ReleaseNote, MeetOurTeam },

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
