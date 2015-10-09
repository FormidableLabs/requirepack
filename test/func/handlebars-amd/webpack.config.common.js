"use strict";
var path = require("path");
var webpack = require("webpack");
var stripLoader = path.resolve(__dirname, "../../util/webpack/strip-sourcemaps-loader.js");

module.exports = {
  context: path.join(__dirname, "src"),
  module: {
    preLoaders: [
      // Strip Handlebars inlined sourcemap comments.
      { test: /node_modules\/handlebars\/.*\.js$/, loader: stripLoader }
    ],
    loaders: [
      {
        test: /\.hbs$/,
        loader: "handlebars-loader",
        query: {
          runtime: require.resolve("handlebars/runtime"),
          helperDirs: path.join(__dirname, "src/helpers")
        }
      }
    ]
  },
  resolve: {
    extensions: ["", ".js", ".hbs"],
    alias: {
      "custom-alias": path.join(__dirname, "src")
    }
  },
  // Avoid `Cannot resolve module 'fs'` errors.
  // https://github.com/webpack/jade-loader/issues/8
  node: {
    fs: "empty"
  },
  plugins: [
    // Rewrite "hbs!/path/to/template" to "/path/to/template.hbs" for
    // compatibility with `hbs!` in RequireJS land.
    new webpack.NormalModuleReplacementPlugin(/^hbs!+/, function (result) {
      result.request = result.request.slice(4) + ".hbs";
    })
  ]
};
