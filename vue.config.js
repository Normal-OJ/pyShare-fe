const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    // proxy: 'http://localhost:8080',
    disableHostCheck: process.env.VUE_APP_DISABLE_HOST_CHECK === 'true',
  },
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({
        languages: ['javascript', 'css', 'html', 'typescript'],
      }),
    ],
  },
}
