// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  devServer: {
    port: 7000,
    //   disableHostCheck: true,
    // before,
    proxy: {
      '/api/v5': {
        target: 'http://34.219.25.208:18083/',
        changeOrigin: true,
      },
    },
  },
  // css: {
  //   loaderOptions: {},
  // },
  assetsDir: 'static',
  // runtimeCompiler: true,
  publicPath: '/',
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        // publicPath: "/",
        languages: ['javascript', 'json', 'sql', 'plaintext'],
        globalAPI: true,
        // features: ["wordHighlighter"],
      }),
    ],
  },
}
