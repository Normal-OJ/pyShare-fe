<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12" md="5">
        <div class="text-h5">所有分類</div>
        <v-row class="mt-11" no-gutters="no-gutters">
          <ManageTags />

          <v-spacer></v-spacer>
          <v-btn
            color="error"
            v-on="on"
            :disabled="selectedTags && selectedTags.length === 0"
            @click="deleteTags(selectedTags)"
          >
            <v-icon>mdi-trash-can</v-icon>
          </v-btn>
        </v-row>
        <v-card class="my-6">
          <v-list subheader="subheader" flat="flat">
            <v-subheader>選擇分類，授權或刪除</v-subheader>
            <v-list-item @click="myToggle">
              <v-list-item-action>
                <v-icon :color="iconColor()">{{ icon() }}</v-icon>
              </v-list-item-action>
              <v-list-item-title>全選</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item-group v-model="selectedTags" multiple="multiple">
              <v-list-item v-for="item in candidateTags" :key="item" :value="item"
                ><template v-slot:default="{ active, toggle }"
                  ><v-list-item-action
                    ><v-checkbox
                      :input-value="active"
                      :true-value="item"
                      color="primary"
                      @click="toggle"
                    ></v-checkbox></v-list-item-action
                  ><v-list-item-content
                    ><v-list-item-title>{{ item }}</v-list-item-title></v-list-item-content
                  ></template
                ></v-list-item
              >
            </v-list-item-group>
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
                @click="pushTags(selectedCourse, selectedTags)"
                :disabled="selectedTags && selectedTags.length === 0"
              >
                <v-icon>mdi-transfer-right</v-icon>
              </v-btn>
            </template>
            <span>選擇課程後，將選取的分類授權給該課程使用 </span>
          </v-tooltip>
        </v-row>
      </v-col>
      <v-col cols="12" md="5">
        <div class="text-h5">此課程目前可用的分類</div>
        <v-card class="my-6">
          <v-list subheader="subheader" flat="flat">
            <v-list-item v-for="item in courseTags" :key="item">
              <v-list-item-content>
                <v-list-item-title>{{ item }}</v-list-item-title>
              </v-list-item-content>
              <v-tooltip bottom="bottom" color="#000000E6">
                <template v-slot:activator="{ on }">
                  <v-btn
                    color="danger"
                    v-on="on"
                    small="small"
                    @click="popTag(selectedCourse, item)"
                  >
                    <v-icon>mdi-keyboard-return</v-icon>
                  </v-btn>
                </template>
                <span>移除</span>
              </v-tooltip>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import agent from '@/api/agent'
import ManageTags from './ManageTags'

export default {
  name: 'ManageTags',

  components: { ManageTags },

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
  }),

  computed: {
    candidateTags() {
      return this.allTags.filter(tag => !this.courseTags.includes(tag))
    },
    courseName() {
      return this.$route.params.name
    },
  },

  watch: {
    selectedCourse() {
      this.updateTags()
    },
  },

  methods: {
    async patchTags() {
      try {
        const { data } = await agent.patchTags(this.courseName, { tags: [] })
        console.log('result:', data.data)
      } catch (error) {
        console.log('[components/ManageTags] error', error)
      }
    },
    myToggle() {
      this.$nextTick(() => {
        if (this.selectAll()) {
          this.selectedTags = []
        } else {
          this.selectedTags = []
          for (let i = 0; i < this.candidateTags.length; i++)
            this.selectedTags.push(this.candidateTags[i])
        }
      })
    },
    selectAll() {
      return this.selectedTags.length === this.candidateTags.length
    },
    selectSome() {
      return this.selectedTags.length > 0 && !this.selectAll()
    },
    icon() {
      if (this.selectAll()) return 'mdi-close-box'
      if (this.selectSome()) return 'mdi-minus-box'
      return 'mdi-checkbox-blank-outline'
    },
    iconColor() {
      return this.selectedTags.length > 0 ? 'indigo darken-4' : ''
    },
  },
}
</script>
