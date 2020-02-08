<template>
  <v-dialog
    v-model="dialog"
    :width="$vuetify.breakpoint.smAndDown ? '95vw' : '50vw'"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        dark
        text
        :color="$vuetify.breakpoint.smAndDown ? '#4B8BBE' : 'white'"
        v-on="on"
        class="subtitle-1"
      >登入</v-btn>
    </template>
    <v-card>
      <v-toolbar color="#4B8BBE" dark dense>
        <v-toolbar-title>登入</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn tile icon @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>
      <v-card-text class="mt-6">
        <SignInForm @signin="signin"></SignInForm>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script>
import SignInForm from './SignInForm';

export default {

  name: 'Auth',

  components: {
    SignInForm,
  },

  data () {
    return {
      dialog: false,
    }
  },

  methods: {
    signin() {
      this.authDialog = false;
      this.$emit('signin');
    }
  }
}
</script>

<style lang="css" scoped>
</style>