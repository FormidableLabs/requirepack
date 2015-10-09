"use strict";
var path = require("path");
var webpack = require("webpack");
var common = require("./webpack.config.common");

module.exports = {
  context: common.context,
  entry: {
    lib: ["./lib"]
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name].js",
    library: "[name]_[hash]"
  },
  module: common.module,
  resolve: common.resolve,
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist/webpack/[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ].concat(common.plugins)
};
