"use strict";
/**
 * Build test distribution
 */
var fs = require("fs-extra");
var path = require("path");

var async = require("async");
var webpack = require("webpack");

var html = require("../../util/templates").html;
var DEST_DIR = path.join(__dirname, "dist");

// Helpers
var writeHtml = function (destPath, scripts, callback) {
  var dest = path.join(DEST_DIR, destPath);
  fs.outputFile(dest, html(scripts), callback);
};

// Wrapper function for a configuration.
var webpackCompile = function (cfg, callback) {
  webpack(cfg, function (err, stats) {
    err = err || stats.compilation.errors[0];
    callback(err);
  });
};

// Clean
var clean = module.exports.clean = function (callback) {
  fs.emptyDir(DEST_DIR, callback);
};

// Build HTML templates
var templates = module.exports.templates = function (callback) {
  async.parallel([
    // **Baseline**: Use existing loaders to verify original builds are honest.
    function (cb) {
      writeHtml("webpack-baseline.html", [
        { src: "webpack/lib.js" },
        { src: "webpack/app1.js" },
        { src: "webpack/app2.js" }
      ], cb);
    },

    function (cb) {
      writeHtml("requirejs-baseline-build.html", [
        { src: "../../../node_modules/requirejs/require.js" },
        { src: "requirejs/lib.js" },
        { src: "requirejs/app1.js" },
        { src: "requirejs/app2.js" }
      ], cb);
    },

    function (cb) {
      writeHtml("requirejs-baseline-almond.html", [
        { src: "../../../node_modules/almond/almond.js" },
        { src: "requirejs/lib.js" },
        { src: "requirejs/app1.js" },
        { src: "requirejs/app2.js" }
      ], cb);
    }
  ], callback);
};

// Build Webpack
var buildWebpack = function (callback) {

  // Series, because lib-manifest.json needs to exist before app can build.
  async.series([
    function (cb) { webpackCompile(require("./webpack.config.lib"), cb); },
    function (cb) { webpackCompile(require("./webpack.config.app"), cb); }
  ], callback);
};

// Build RequireJS
// TODO

// Build interop.
// TODO

// Build everything
var build = module.exports.build = function (callback) {
  async.auto({
    clean: clean,
    templates: ["clean", templates],
    buildWebpack: ["clean", buildWebpack]
  }, callback);
};

// Script
if (require.main === module) {
  build(function (err) {
    if (err) { throw err; }
    /*eslint-disable no-console*/
    console.log("Done.");
    /*eslint-enable no-console*/
  });
}
