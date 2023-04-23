// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

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
