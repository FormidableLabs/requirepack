"use strict";

var _ = require("lodash");
var async = require("async");
var amdetective = require("amdetective");
var fs = require("fs-extra");

var Manifest = require("./manifest");

/**
 * Compile interop layer.
 *
 * @param {Object} opts                         Options object
 * @param {String|Object} opts.requirejsConfig  RequireJS config file path or object (Optional)
 * @param {String} opts.requirejsLibrary        Built, shared library path from RequireJS
 * @param {String} opts.webpackContext          Context for webpack manifest (Default: `./`)
 * @param {String|Object} opts.webpackManifest  Built manifest file path / object from Webpack
 * @param {String} opts.output                  Output path for interop
 * @returns {void}
 */
var Compiler = module.exports = function (opts) {
  this._opts = this._initOptions(opts);
  this._manifest = new Manifest({
    context: this._opts.webpackContext,
    manifest: this._opts.webpackManifest
  });
};

/**
 * Initialize and verify options.
 *
 * @param {Object} opts Options object
 * @returns {void}
 */
/*eslint-disable max-statements*/
Compiler.prototype._initOptions = function (opts) {
  // Add defaults
  opts = _.extend({
    requirejsConfig: {},
    requirejsLibrary: null,
    webpackContext: null,
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

  // Import configuration.
  opts.requirejsConfig = _.isString(opts.requirejsConfig) ?
    require(opts.requirejsConfig) :
    opts.requirejsConfig;

  // Import and validate manifest.
  var manifest = opts.webpackManifest = _.isString(opts.webpackManifest) ?
    require(opts.webpackManifest) :
    opts.webpackManifest;
  if (_.isEmpty(manifest.name)) { throw new Error("webpackManifest name is empty"); }
  if (_.isEmpty(manifest.content)) { throw new Error("webpackManifest content is empty"); }

  return opts;
};
/*eslint-enable max-statements*/

/**
 * Get RequireJS names from built library file.
 *
 * @param {String}    filePath  File path to RequireJS library
 * @param {Function}  callback  Callback `(err, names)`
 * @returns {void}
 */
Compiler.prototype._getRequirejsNames = function (filePath, callback) {
  fs.readFile(filePath, function (err, data) {
    if (err) { return callback(err); }
    var tree;

    try {
      tree = amdetective(data.toString(), {
        findNestedDependencies: false
      });
    } catch (error) {
      return callback(error);
    }

    // Convert to top-level names.
    var names = _.pluck(tree, "name");

    callback(null, names);
  });
};

/**
 * Generate code for interop from template.
 *
 * @param {Array<String>} names   RequireJS dependency names to map.
 * @returns {String}              Code string
 */
Compiler.prototype.template = function (names) {
  var manifest = this._manifest;

  return [].concat(
    [
      "(function () {",
      "  var lib = window[\"" + manifest.name + "\"];",
      "  var def = window.define;",
      "  function translate(num) { return function () { return lib(num); }; }"
    ],
    _.map(names, function (name) {
      var num = manifest.mapNameToNum(name);
      return "  def(\"" + name + "\", translate(" + num + "));";
    }),
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
  var filePath = this._opts.output;
  fs.outputFile(filePath, code, callback);
};

/**
 * Compile interop layer.
 *
 * @param {Function} callback Callback `(err)`
 * @returns {Object}          Compiler object
 */
Compiler.prototype.compile = function (callback) {
  async.auto({
    // Infer AMD names.
    requirejsNames: function (cb) {
      this._getRequirejsNames(this._opts.requirejsLibrary, cb);
    }.bind(this),

    // Output.
    outputInterop: ["requirejsNames", function (cb, results) {
      var code = this.template(results.requirejsNames);
      this.outputInterop(code, cb);
    }.bind(this)]
  }, callback);

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