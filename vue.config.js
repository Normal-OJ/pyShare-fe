const MonacoEditorPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  transpileDependencies: ['vuetify'],
  devServer: {
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
