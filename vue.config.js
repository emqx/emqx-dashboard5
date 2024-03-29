/* eslint-disable @typescript-eslint/no-var-requires */
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

const getVersion = () => {
  const matched = process.env.npm_package_version.match(/^\d\.\d/)
  return matched ? `v${matched[0]}` : 'latest'
}
process.env.VUE_APP_EMQX_VERSION = getVersion()

const { HOST_URL } = process.env
const target = HOST_URL || 'http://localhost:18083/'

module.exports = {
  devServer: {
    port: 7000,
    proxy: {
      '/api/v5': {
        target,
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
  transpileDependencies: ['@vue-flow/core', '@emqx/shared-ui-utils'],
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        languages: ['javascript', 'json', 'sql', 'plaintext'],
        globalAPI: true,
      }),
    ],
  },
  chainWebpack: (config) => {
    config.optimization.splitChunks({
      chunks: 'all',
      cacheGroups: {
        monacoEditor: {
          name: 'chunk-monaco-editor',
          test: /[\\/]node_modules[\\/]monaco-editor[\\/]/,
        },
      },
    })
  },
}
