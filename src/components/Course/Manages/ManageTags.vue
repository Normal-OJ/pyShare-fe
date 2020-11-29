<template>
  <v-container fluid class="pt-4 px-8">
    <v-row no-gutters>
      <v-spacer></v-spacer>
      <CreateTagModal @submit="submitNewTags" />
    </v-row>

    <v-row>
      <v-col cols="12" md="5">
        <div class="text-h6">課程分類</div>
        <div class="text-subtitle-1">以下為在此課程內的主題可使用的分類</div>
        <v-card class="my-6" tile>
          <v-list>
            <div v-show="courseTags.length === 0" class="text-center py-4">
              <div class="text-body-2 mb-2">課程沒有可用的分類，快加入一些吧！</div>
              <v-img :src="require('@/assets/images/emptyBox.svg')" max-height="100" contain />
            </div>
            <v-list-item v-for="item in courseTags" :key="item">
              <v-list-item-content>
                <v-list-item-title class="py-1">{{ item }}</v-list-item-title>
              </v-list-item-content>
              <v-tooltip bottom="bottom" color="#000000E6">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="secondary"
                    v-on="on"
                    small="small"
                    icon
                    @click="submitPatchTags(PATCH_OPTION.POP, [item])"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </template>
                <span>取消授權</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>

      <v-col cols="12" md="2">
        <v-row class="hidden-sm-and-down" :style="{ height: '40vh' }"></v-row>
        <v-row justify="center">
          <v-tooltip bottom="bottom" color="#000000E6">
            <template v-slot:activator="{ on }">
              <v-btn
                color="primary"
                v-on="on"
                large="large"
                :disabled="selectedTags && selectedTags.length === 0"
                @click="submitPatchTags(PATCH_OPTION.PUSH, selectedTags)"
              >
                <v-icon>mdi-transfer-left</v-icon>
              </v-btn>
            </template>
            <span>將選取的分類授權給此課程使用 </span>
          </v-tooltip>
        </v-row>
      </v-col>

      <v-col cols="12" md="5">
        <div class="text-h6">其他分類</div>
        <div class="text-subtitle-1">平台所有的分類，可以自由新增分類</div>
        <v-card class="my-6" tile>
          <v-list>
            <v-list-item @click="toggleAll">
              <v-list-item-action>
                <v-icon :color="iconColor">{{ icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-title class="py-1">全選</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item-group v-model="selectedTags" multiple="multiple">
              <div v-show="candidateTags.length === 0" class="text-center py-4">
                <div class="text-body-2 mb-2">沒有其他分類了</div>
                <v-img :src="require('@/assets/images/noData.svg')" max-height="100" contain />
              </div>
              <v-list-item v-for="item in candidateTags" :key="item" :value="item">
                <template v-slot:default="{ active, toggle }">
                  <v-list-item-action>
                    <v-checkbox
                      :input-value="active"
                      :true-value="item"
                      color="primary"
                      @click.capture.stop="toggle"
                    />
                  </v-list-item-action>
                  <v-list-item-content>
                    <v-list-item-title class="py-1">{{ item }}</v-list-item-title>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import CreateTagModal from './CreateTagModal'

const PATCH_OPTION = {
  PUSH: 'push',
  POP: 'pop',
}
const initialPatchTagsBody = {
  [PATCH_OPTION.PUSH]: [],
  [PATCH_OPTION.POP]: [],
}

export default {
  name: 'ManageTags',

  components: { CreateTagModal },

  props: {
    courseTags: {
      type: Array,
      required: true,
    },
    allTags: {
      type: Array,
      required: true,
    },
  },

  data: () => ({
    selectedTags: [],
    newTagDialog: false,
    newTagNames: '',
    PATCH_OPTION,
  }),

  computed: {
    candidateTags() {
      return this.allTags.filter(tag => !this.courseTags.includes(tag))
    },
    courseName() {
      return this.$route.params.name
    },
    selectAll() {
      return this.selectedTags.length === this.candidateTags.length
    },
    selectSome() {
      return this.selectedTags.length > 0 && !this.selectAll
    },
    icon() {
      if (this.selectAll) return 'mdi-close-box'
      if (this.selectSome) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    iconColor() {
      return this.selectedTags.length > 0 ? 'indigo darken-4' : ''
    },
  },

  methods: {
    submitPatchTags(option, tags) {
      const body = { ...initialPatchTagsBody, [option]: tags }
      console.log('body', body)
      this.$emit('submitPatchTags', body)
    },
    submitNewTags(tags) {
      this.$emit('submitNewTags', tags)
    },
    async toggleAll() {
      await this.$nextTick()
      this.selectedTags = this.selectAll ? [] : this.candidateTags.slice()
    },
  },
}
</script>
