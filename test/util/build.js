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
var requirepack = require("../../index");

var html = require("./templates").html;

/**
 * Create builder.
 *
 * @param {Object} opts           Options object
 * @param {String} opts.rootDir   Sceanrio root directory
 * @param {String} opts.destDir   Destination output directory
 * @param {String} opts.buildDir  Built, shared library path from RequireJS
 * @returns {void}
 */
var Build = module.exports = function (opts) {
  opts = opts || {};
  this.rootDir = opts.rootDir;
  if (!this.rootDir) { throw new Error("rootDir is required"); }

  this.destDir = opts.destDir || path.join(this.rootDir, "dist");
  this.buildDir = opts.buildDir || path.join(this.rootDir, "build");

  // Scenario is relative to root of this project.
  this.scenario = path.relative(path.join(__dirname, "../.."), this.rootDir);
};

// Declare and export which pages are created / tested.
Build.prototype.PAGES = {
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
    { src: "webpack/lib.js" },
    { src: "../../../../node_modules/requirejs/require.js" },
    { src: "requirepack/lib-interop.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ],

  "requirepack-almond.html": [
    { src: "webpack/lib.js" },
    { src: "../../../../node_modules/almond/almond.js" },
    { src: "requirepack/lib-interop.js" },
    { src: "requirejs/app1.js" },
    { src: "requirejs/app2.js" }
  ],

  "requirepack-build-mixed.html": [
    { src: "webpack/lib.js" },
    { src: "../../../../node_modules/requirejs/require.js" },
    { src: "requirepack/lib-interop.js" },
    { src: "webpack/app1.js" },
    { src: "requirejs/app2.js" }
  ],

  "requirepack-almond-mixed.html": [
    { src: "webpack/lib.js" },
    { src: "../../../../node_modules/almond/almond.js" },
    { src: "requirepack/lib-interop.js" },
    { src: "requirejs/app1.js" },
    { src: "webpack/app2.js" }
  ]
};

// Helpers
Build.prototype._writeHtml = function (destPath, scripts, callback) {
  var dest = path.join(this.destDir, destPath);
  fs.outputFile(dest, html(scripts), callback);
};

// Wrapper function for a configuration.
Build.prototype._webpackCompile = function (cfgPath, callback) {
  var cfg = require(path.join(this.rootDir, cfgPath));

  webpack(cfg, function (err, stats) {
    err = err || stats.compilation.errors[0];
    callback(err);
  });
};

// Clean
Build.prototype.clean = function (callback) {
  fs.emptyDir(this.destDir, callback);
};

// Build HTML templates
Build.prototype.templates = function (callback) {
  var self = this;

  async.each(_.keys(self.PAGES), function (page, cb) {
    var scripts = self.PAGES[page];
    self._writeHtml(page, scripts, cb);
  }, callback);
};

// Build Webpack
Build.prototype.buildWebpack = function (callback) {
  var self = this;

  // Series, because lib-manifest.json needs to exist before app can build.
  async.series([
    function (cb) { self._webpackCompile("./webpack.config.lib", cb); },
    function (cb) { self._webpackCompile("./webpack.config.app", cb); }
  ], callback);
};

// Build RequireJS
Build.prototype.buildRequirejs = function (callback) {
  var self = this;
  async.auto({
    requirejs: function (cb) {
      cb = _.once(cb);
      requirejs.optimize({
        buildFile: path.join(self.rootDir, "requirejs.build.js")
      }, cb.bind(null, null), cb);
    },
    destDir: function (cb) {
      fs.ensureDir(path.join(self.destDir, "requirejs"), cb);
    },
    copyLib: ["requirejs", "destDir", function (cb) {
      fs.copy(
        path.join(self.buildDir, "requirejs/lib.js"),
        path.join(self.destDir, "requirejs/lib.js"), cb);
    }],
    copyApp1: ["requirejs", "destDir", function (cb) {
      fs.copy(
        path.join(self.buildDir, "requirejs/app1.js"),
        path.join(self.destDir, "requirejs/app1.js"), cb);
    }],
    copyApp2: ["requirejs", "destDir", function (cb) {
      fs.copy(
        path.join(self.buildDir, "requirejs/app2.js"),
        path.join(self.destDir, "requirejs/app2.js"), cb);
    }]
  }, callback);
};

// Build interop.
Build.prototype.buildRequirePack = function (callback) {
  requirepack.compile({
    requirejsConfig: path.join(this.rootDir, "requirejs.config"),
    requirejsLibrary: path.join(this.destDir, "requirejs/lib.js"),
    webpackManifest: path.join(this.destDir, "webpack/lib-manifest.json"),
    output: path.join(this.destDir, "requirepack/lib-interop.js")
  }, callback);
};

// Build everything
Build.prototype.build = function (callback) {
  async.auto({
    clean: this.clean.bind(this),
    templates: ["clean", this.templates.bind(this)],
    buildWebpack: ["clean", this.buildWebpack.bind(this)],
    buildRequirejs: ["clean", this.buildRequirejs.bind(this)],
    buildRequirePack: ["buildWebpack", "buildRequirejs", this.buildRequirePack.bind(this)]
  }, callback);
};

// Run script and process exit if bad.
Build.prototype.run = function () {
  var self = this;

  self.build(function (err) {
    if (err) {
      /*eslint-disable no-console, no-process-exit*/
      console.log("ERROR: " + self.scenario, err);
      process.exit(1);
    }
  });
};
