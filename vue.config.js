const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: 'http://s2.noj.tw:1122',
    disableHostCheck: process.env.VUE_APP_DISABLE_HOST_CHECK === 'true',
  },
  configureWebpack: {
    plugins: [
      new MonacoEditorPlugin({
        languages: ['javascript', 'css', 'html', 'typescript'],
      }),
      new webpack.DefinePlugin({
        APPLICATION_VERSION: JSON.stringify(require('./package.json').version),
      }),
    ],
  },
}
