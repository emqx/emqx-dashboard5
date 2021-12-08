// eslint-disable-next-line @typescript-eslint/no-var-requires
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

module.exports = {
  devServer: {
    port: 7000,
    //   disableHostCheck: true,
    // before,
    proxy: {
      "/api/v5": {
        target: "http://34.219.115.160:18083/",
        changeOrigin: true,
      },
    },
  },
  // css: {
  //   loaderOptions: {},
  // },
  assetsDir: "static",
  // runtimeCompiler: true,
  publicPath: "/",
  productionSourceMap: false,
  configureWebpack: {
    plugins: [
      new MonacoWebpackPlugin({
        publicPath: "static/",
        languages: ["json", "sql", "plaintext"],
        features: ["wordHighlighter"],
      }),
    ],
  },
};
