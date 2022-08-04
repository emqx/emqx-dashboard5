// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

const { VUE_APP_VERSION, HOST_URL } = process.env
const isEnterprise = VUE_APP_VERSION === 'enterprise'
const iconfontPath = isEnterprise ? 'src/assets/iconfont/enterprise/' : 'src/assets/iconfont/open/'

module.exports = {
  devServer: {
    port: 7000,
    proxy: {
      '/api/v5': {
        target: HOST_URL || 'http://localhost:18083/',
        changeOrigin: true,
      },
    },
  },
  css: {
    requireModuleExtension: true,
  },
  assetsDir: 'static',
  publicPath: './',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'json', 'sql', 'plaintext'],
        globalAPI: true,
      }),
    ],
    resolve: {
      alias: {
        iconfont: path.resolve(__dirname, iconfontPath),
      },
    },
  },
}
