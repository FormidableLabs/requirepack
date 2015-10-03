"use strict";

var _ = require("lodash");
var fs = require("fs-extra");

/**
 * Compile interop layer.
 *
 * @param {Object} opts                         Options object
 * @param {String|Object} opts.requirejsConfig  RequireJS config file path or object (Optional)
 * @param {String} opts.requirejsLibrary        Built, shared library path from RequireJS
 * @param {String|Object} opts.webpackManifest  Built manifest file path / object from Webpack
 * @param {String} opts.output                  Output path for interop
 * @returns {void}
 */
var Compiler = module.exports = function (opts) {
  this.opts = this._initOptions(opts);
};

/**
 * Initialize and verify options.
 *
 * @param {Object} opts Options object
 * @returns {void}
 */
Compiler.prototype._initOptions = function (opts) {
  /*eslint-disable max-statements*/
  // Add defaults
  opts = _.merge({
    requirejsConfig: {},
    requirejsLibrary: null,
    webpackManifest: {},
    output: null
  }, opts);

  // Validate
  if (!opts.requirejsLibrary) { throw new Error("requirejsLibrary path required"); }
  if (!opts.webpackManifest) { throw new Error("webpackManifest path|obj required"); }
  if (_.isEmpty(opts.webpackManifest)) { throw new Error("webpackManifest is empty"); }
  if (!opts.output) { throw new Error("output path required"); }
  if (opts.output === opts.requirejsLibrary) { throw new Error("output same as requirejsLibrary"); }
  if (opts.output === opts.webpackManifest) { throw new Error("output same as webpackManifest"); }

  // Import configurations
  opts.requirejsConfig = _.isString(opts.requirejsConfig) ?
    require(opts.requirejsConfig) :
    opts.requirejsConfig;
  opts.webpackManifest = _.isString(opts.webpackManifest) ?
    require(opts.webpackManifest) :
    opts.webpackManifest;

  return opts;
  /*eslint-enable max-statements*/
};

/**
 * Generate code for interop from template.
 *
 * @returns {String} code string
 */
Compiler.prototype.template = function () {
  return [].concat(
    [
      "(function () {",
      "  var lib = window[\"" + "TODO-wpLibName" + "\"];",
      "  var def = window.define;",
      "  function translate(num) { return function () { return lib(num); }; }"
    ],
    [
      "}());"
    ]).join("\n");
};

/**
 *
 * @param {String}    code     String of generated code.
 * @param {Function}  callback Callback `(err)`
 * @returns {void}
 */
Compiler.prototype.outputInterop = function (code, callback) {
  // TODO: Handle streams and output to a stream.
  var filePath = this.opts.output;
  fs.outputFile(filePath, code, callback);
};

/**
 * Compile interop layer.
 *
 * @param {Function} callback Callback `(err)`
 * @returns {Object}          Compiler object
 */
Compiler.prototype.compile = function (callback) {
  var code = this.template();
  this.outputInterop(code, callback);

  return this;
};

/**
 * Compiler wrapper function.
 *
 * @param {Object}    opts      Options object
 * @param {Function}  callback  Callback `(err)`
 * @returns {Object}            Compiler object
 */
Compiler.compile = function (opts, callback) {
  return (new Compiler(opts)).compile(callback);
};
