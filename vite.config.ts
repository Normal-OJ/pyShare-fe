import { defineConfig } from 'vite'
import { createVuePlugin } from 'vite-plugin-vue2'
import eslintPlugin from 'vite-plugin-eslint'
import envCompatible from 'vite-plugin-env-compatible'
import Components from 'unplugin-vue-components/vite'
import { VuetifyResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  resolve: {
    alias: [
      {
        find: '@/',
        replacement: `${path.resolve(__dirname, './src')}/`,
      },
      {
        find: 'src/',
        replacement: `${path.resolve(__dirname, './src')}/`,
      },
    ],
  },
  server: {
    // proxy: {
    //   '/api': 'https://pyshare.noj.tw',
    // },
    host: '0.0.0.0',
    port: 8080,
  },
  plugins: [
    // Vue2
    createVuePlugin({
      target: 'esnext',
    }),
    // Vuetify
    Components({
      // relative paths to the directory to search for components.
      dirs: ['src/components'],
      // generate `components.d.ts` global declarations
      dts: true,
      // auto import for directives
      directives: false,
      // resolvers for custom components
      resolvers: [VuetifyResolver()],
    }),
    // eslint
    eslintPlugin(),
    // fix .env file
    envCompatible(),
  ],
  css: {
    // https://vitejs.dev/config/#css-preprocessoroptions
    preprocessorOptions: {
      sass: {
        additionalData: [
          // vuetify variable overrides
          '@import "@/sass/variables.scss"',
          '@import "@/sass/styles.scss"',
          '',
        ].join('\n'),
      },
    },
  },
  // Build Options
  // https://vitejs.dev/config/#build-options
  build: {
    target: 'es2021',
  },
})
