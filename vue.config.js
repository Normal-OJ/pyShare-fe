const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
    proxy: 'http://s2.noj.tw:1122',
    // proxy: 'https://pyshare.noj.tw',
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
