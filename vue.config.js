const path = require("path");
module.exports = {
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true,
      },
    },
  },
  configureWebpack: {
    resolve: {
      alias: {
        vue$: "vue/dist/vue.esm.js",
      },
    },
  },
  devServer: {
    proxy: "http://127.0.0.1:8000",
  },
  publicPath: "/",
  productionSourceMap: false, //生产环境的source map
  chainWebpack: (config) => {
    // Add "node_modules" alias
    config.resolve.alias.set(
      "node_modules",
      path.join(__dirname, "./node_modules")
    );

    // Disable "prefetch" plugin since it's not properly working in some browsers
    config.plugins.delete("prefetch");
    if (process.env.npm_config_report) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
    // Do not remove whitespaces
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      });
  },
};
