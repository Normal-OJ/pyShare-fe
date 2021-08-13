const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    disableHostCheck: process.env.VUE_APP_DISABLE_HOST_CHECK === 'true',
    proxy: 'https://pyshare.noj.tw',
  },
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({
        languages: ['javascript', 'css', 'html', 'typescript'],
      }),
    ],
  },
}
