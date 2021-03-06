<template>
  <v-container fluid>
    <v-row no-gutters>
      <div class="text-h5">管理分類</div>
      <v-spacer />
      <CreateTagModal
        @submit-new-tags="
          (tags, resolve, reject) => $emit('submit-new-tags', tags, resolve, reject)
        "
      />
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
                    @click="handleSubmitPatchTags(PATCH_OPTION.POP, [item])"
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
                @click="handleSubmitPatchTags(PATCH_OPTION.PUSH, selectedTags)"
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
              <v-list-item
                v-for="item in candidateTags"
                :key="item"
                :value="item"
                inactive
                :ripple="false"
              >
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
                    <div class="d-flex align-center">
                      <v-list-item-title class="py-1">{{ item }}</v-list-item-title>
                      <v-spacer />
                      <v-tooltip bottom :disabled="!removables || !removables[item]">
                        <template v-slot:activator="{ on, attrs }">
                          <div v-on="on">
                            <v-btn
                              color="error"
                              icon
                              v-bind="attrs"
                              :disabled="removables && removables[item]"
                              small
                              @click="deleteTag(item)"
                            >
                              <v-icon>mdi-trash-can</v-icon>
                            </v-btn>
                          </div>
                        </template>
                        <span>
                          有其他課程使用此分類，故無法刪除
                        </span>
                      </v-tooltip>
                    </div>
                  </v-list-item-content>
                </template>
              </v-list-item>
            </v-list-item-group>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
    <Popup :isShow="isPopupActive && !!errorMsg" :title="errorMsg" @click="isPopupActive = false" />
  </v-container>
</template>

<script>
import CreateTagModal from './CreateTagModal'
import Popup from '../../UI/Popup'

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

  components: { CreateTagModal, Popup },

  props: {
    courseTags: {
      type: Array,
      required: true,
    },
    allTags: {
      type: Array,
      required: true,
    },
    removables: {
      type: Object,
    },
    errorMsg: {
      type: String,
      required: true,
    },
    // submitPatchTags: {
    //   type: Function,
    //   required: true,
    // },
    // submitNewTags: {
    //   type: Function,
    //   required: true,
    // },
    // deleteTags: {
    //   type: Function,
    //   required: true,
    // },
  },

  data: () => ({
    selectedTags: [],
    newTagDialog: false,
    isPopupActive: true,
    newTagNames: '',
    PATCH_OPTION,
  }),

  computed: {
    candidateTags() {
      return this.allTags.filter(tag => !this.courseTags.includes(tag))
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
    async toggleAll() {
      await this.$nextTick()
      this.selectedTags = this.selectAll ? [] : this.candidateTags.slice()
    },
    handleSubmitPatchTags(option, tags) {
      const body = { ...initialPatchTagsBody, [option]: tags }
      this.$emit('submit-patch-tags', body)
    },
    deleteTag(tag) {
      new Promise((resolve, reject) => this.$emit('delete-tags', [tag], resolve, reject)).then(
        () => {
          this.selectedTags = this.selectedTags.filter(t => t !== tag)
        },
      )
    },
  },
}
</script>
