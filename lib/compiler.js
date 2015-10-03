"use strict";

var _ = require("lodash");

/**
 * Compile interop layer.
 *
 * @param {Object} opts                   Options object
 * @param {Object} opts.requirejsConfig   RequireJS configuration object (Optional)
 * @param {String} opts.requirejsLibrary  Built, shared library path from RequireJS
 * @param {String} opts.webpackManifest   Built manifest file path from Webpack
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
  opts = _.merge({
    requirejsConfig: {},
    requirejsLibrary: null,
    webpackManifest: null
  }, opts);

  if (!opts.requirejsLibrary) { throw new Error("requirejsLibrary path required"); }
  if (!opts.webpackManifest) { throw new Error("webpackManifest path required"); }

  return opts;
};

/**
 * Compile interop layer.
 *
 * @param {Function} callback Callback `(err)`
 * @returns {Object}          Compiler object
 */
Compiler.prototype.compile = function (callback) {
  callback();
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
