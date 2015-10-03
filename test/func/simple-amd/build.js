"use strict";
/**
 * Build test distribution
 */
var fs = require("fs-extra");
var path = require("path");

var _ = require("lodash");
var async = require("async");
var webpack = require("webpack");
var requirejs = require("requirejs");
var requirejsConfig = require("./requirejs.config");
var requirepack = require("../../../index");

var html = require("../../util/templates").html;
var DEST_DIR = path.join(__dirname, "dist");
var BUILD_DIR = path.join(__dirname, "build");

// Declare and export which pages are created / tested.
var PAGES = module.exports.PAGES = {
  // **Note**: No requirepack integration with straight lib, since webpack is base.
  "webpack-baseline.html": [
    { src: "webpack/lib.js" },
    { src: "webpack/app1.js" },
    { src: "webpack/app2.js" }
  ],

  // **Note**: Don't have requirepack version because `lib` is live downloaded even if not properly
  // bridged by requirepack interop.
  "requirejs-baseline-dev.html": [
    { src: "../../../../node_modules/requirejs/require.js" },
    { src: "../requirejs.config.js" },
    function () {
      require.config({
        baseUrl: "../src"
      });
      require(["lib"], function () {
        require(["app1", "app2"]);
      });
    }.toString()
  ],

  "requirejs-baseline-build.html": [
    { src: "../../../../node_modules/requirejs/require.js" },
    { src: "requirejs/lib.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ],

  "requirejs-baseline-almond.html": [
    { src: "../../../../node_modules/almond/almond.js" },
    { src: "requirejs/lib.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ],

  "requirepack-build.html": [
    { src: "../../../../node_modules/requirejs/require.js" },
    { src: "webpack/lib.js" },
    { src: "requirepack/lib-interop.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ],

  "requirepack-almond.html": [
    { src: "../../../../node_modules/almond/almond.js" },
    { src: "webpack/lib.js" },
    { src: "requirepack/lib-interop.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ]
};

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
  async.each(_.keys(PAGES), function (page, cb) {
    var scripts = PAGES[page];
    writeHtml(page, scripts, cb);
  }, callback);
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
var buildRequire = function (callback) {
  async.auto({
    requirejs: function (cb) {
      cb = _.once(cb);
      requirejs.optimize({
        buildFile: path.join(__dirname, "requirejs.build.js")
      }, cb.bind(null, null), cb);
    },
    destDir: function (cb) {
      fs.ensureDir(path.join(DEST_DIR, "requirejs"), cb);
    },
    copyLib: ["requirejs", "destDir", function (cb) {
      fs.copy(
        path.join(BUILD_DIR, "requirejs/lib.js"),
        path.join(DEST_DIR, "requirejs/lib.js"), cb);
    }],
    copyApp1: ["requirejs", "destDir", function (cb) {
      fs.copy(
        path.join(BUILD_DIR, "requirejs/app1.js"),
        path.join(DEST_DIR, "requirejs/app1.js"), cb);
    }],
    copyApp2: ["requirejs", "destDir", function (cb) {
      fs.copy(
        path.join(BUILD_DIR, "requirejs/app2.js"),
        path.join(DEST_DIR, "requirejs/app2.js"), cb);
    }]
  }, callback);
};

// Build interop.
var buildRequirePack = function (callback) {
  requirepack.compile({
    requirejsConfig: requirejsConfig,
    requirejsLibrary: path.join(DEST_DIR, "requirejs/lib.js"),
    webpackManifest: path.join(DEST_DIR, "webpack/lib-manifest.json"),
    output: path.join(DEST_DIR, "requirepack/lib-interop.js")
  }, callback);
};

// Build everything
var build = module.exports.build = function (callback) {
  async.auto({
    clean: clean,
    templates: ["clean", templates],
    buildWebpack: ["clean", buildWebpack],
    buildRequire: ["clean", buildRequire],
    buildRequirePack: ["buildWebpack", "buildRequire", buildRequirePack]
  }, callback);
};

// Script
if (require.main === module) {
  buildRequirePack/*TODO*/(function (err) {
  //build/*TODO*/(function (err) {
    if (err) { throw err; }
  });
}
