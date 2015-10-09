"use strict";
var path = require("path");
var webpack = require("webpack");
var common = require("./webpack.config.common");

module.exports = {
  context: common.context,
  entry: {
    app1: "./app1.js",
    app2: "./app2.js"
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name].js"
  },
  module: common.module,
  resolve: common.resolve,
  node: common.node,
  plugins: [
    new webpack.DllReferencePlugin({
      context: path.join(__dirname, "src"),
      manifest: require("./dist/webpack/lib-manifest.json")
    })
  ].concat(common.plugins)
};
