<template>
  <div class="ma-0 pa-0">
    <v-app-bar
      app
      color="#4B8BBE"
    >
      
      <!-- Small Down Menu -->
      <v-app-bar-nav-icon
        app
        class="hidden-md-and-up"
        @click.stop="drawer = !drawer"
      ></v-app-bar-nav-icon>

      <!-- Nav Bar Title -->
      <v-toolbar-title style="color: white; padding-right: 10px;">
        <v-icon color="white" large>mdi-language-python</v-icon>創作分享平台
      </v-toolbar-title>

      <!-- Nav Bar -->
      <v-toolbar-items v-if="$vuetify.breakpoint.mdAndUp">
        <v-btn
          v-for="link in links"
          :key="link.title"
          :to="link.path"
          color="white"
          text
        >{{ link.title }}</v-btn>
      </v-toolbar-items>

      <v-spacer></v-spacer>

      <!-- Sign in, User -->
      <v-menu v-if="isLogin && $vuetify.breakpoint.mdAndUp" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn
            text
            color="white"
            v-on="on"
          >{{ username }}</v-btn>
        </template>
        <v-list>
          <v-list-item link :to="{path: '/profile'}">
            <v-list-item-title v-text="'個人頁面'"></v-list-item-title>
          </v-list-item>
          <v-list-item link @click="signout">
            <v-list-item-title v-text="'登出'"></v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
      <Auth v-else-if="$vuetify.breakpoint.mdAndUp" @signin="update"></Auth>

    </v-app-bar>

    <v-navigation-drawer 
      v-model="drawer"
      app
      disable-resize-watcher
    >
      <v-list-item>
        <v-list-item-title v-if="isLogin">{{ username }}</v-list-item-title>
        <v-list-item-title v-else><Auth @signin="update"></Auth></v-list-item-title>
        <v-btn
          icon
          @click="drawer = !drawer"
        ><v-icon>mdi-chevron-left</v-icon></v-btn>
      </v-list-item>

      <v-divider></v-divider>

      <v-list dense>
        <v-list-item
          v-for="link in links"
          :key="link.title"
          :to="link.path"
          link
        ><v-list-item-title v-text="link.title"></v-list-item-title></v-list-item>
        <v-divider v-if="isLogin"></v-divider>
        <v-list-item v-if="isLogin" link :to="{path: '/profile'}">
          <v-list-item-title v-text="'個人頁面'"></v-list-item-title>
        </v-list-item>
        <v-list-item v-if="isLogin" link @click="signout">
          <v-list-item-title v-text="'登出'"></v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

  </div>
</template>

<script>
import Auth from './Auth';

const API_BASE_URL = '/api';

export default {

  name: 'Header',

  components: {
    Auth,
  },

  data () {
    return {
      links: [
        {'title': '題目列表', 'path': '/'},
        {'title': '使用說明', 'path': '/tutorial'},
      ],
      drawer: false,
      isLogin: true,
      payload: null,
      username: '使用者名稱',
    }
  },

  beforeMount () {
    // this.setProfile();
  },

  methods: {
    async update() {
      this.drawer = false;
      this.$router.go(0);
    },
    // setProfile() {
    //   if ( this.$cookies.isKey('jwt') ) {
    //     this.payload = this.parseJwt(this.$cookies.get('jwt'));
    //     if ( this.payload.active === true ) {
    //       this.isLogin = true;
    //       this.username = this.payload.username;
    //     }
    //   }
    // },
    // parseJwt(token) {
    //   console.log(atob(token.split('.')[1]));
    //   return JSON.parse(atob(token.split('.')[1])).data;
    // },
    signout() {
      // this.$http.get(`${API_BASE_URL}/auth/session`)
        // .then((res) => {
          // console.log(res);
          this.isLogin = false;
          // this.$router.push('/');
          // this.update();
        // })
        // .catch((err) => {
          // console.log(err);
        // })
    }
  }
}
</script>
