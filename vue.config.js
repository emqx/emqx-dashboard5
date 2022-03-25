// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  devServer: {
    port: 7000,
    proxy: {
      '/api/v5': {
        target: process.env.HOST_URL || 'http://localhost:18083/',
        changeOrigin: true,
      },
    },
  },
  css: {
    requireModuleExtension: true,
  },
  assetsDir: 'static',
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'json', 'sql', 'plaintext'],
        globalAPI: true,
      }),
    ],
  },
}
