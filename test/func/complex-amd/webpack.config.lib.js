"use strict";
var path = require("path");
var webpack = require("webpack");

module.exports = {
  context: path.join(__dirname, "src"),
  entry: {
    lib: ["./lib"]
  },
  output: {
    path: path.join(__dirname, "dist/webpack"),
    filename: "[name].js",
    library: "[name]_[hash]"
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, "dist/webpack/[name]-manifest.json"),
      name: "[name]_[hash]"
    })
  ]
};
