<template>
  <Fragment>
    <v-expansion-panels popout multiple>
      <v-expansion-panel
        v-for="{ title, id, floor, content, author, submission } in comments"
        :key="id"
      >
        <v-expansion-panel-header>
          <v-row no-gutters>
            <v-col>
              <v-row no-gutters class="mb-2">
                <div class="text-body-1">{{ title }}</div>
              </v-row>
              <v-row no-gutters>
                <router-link
                  :to="{ name: 'profile', params: { username: author.username } }"
                  class="mr-1"
                >
                  {{ author.displayName }}
                </router-link>
                {{ `· 1 week ago · ${floor} 樓` }}
                <v-tooltip bottom>
                  <template v-slot:activator="{ on, attr }">
                    <v-icon class="ml-1" color="primary" small v-on="on" v-bind="attr">
                      mdi-check-circle
                    </v-icon>
                  </template>
                  <span>此創作已有其中一個版本被批改完成</span>
                </v-tooltip>
              </v-row>
            </v-col>
            <v-spacer />
            <v-col align-self="center">
              <v-chip color="primary" label small>PENDING</v-chip>
            </v-col>
          </v-row>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <CommentDetail :content="content" :submission="submission" />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </Fragment>
</template>

<script>
import { Fragment } from 'vue-fragment'
import CommentDetail from './CommentDetail'

export default {
  name: 'CommentList',

  props: {
    comments: {
      type: Array,
      required: true,
    },
  },

  components: { CommentDetail, Fragment },

  data: () => ({}),
}
</script>
