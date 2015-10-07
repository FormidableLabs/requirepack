"use strict";

var path = require("path");

var _ = require("lodash");

/**
 * Webpack manifest path / number lookup for RequireJS
 *
 * @param {Object} opts RequirePack parsed options object
 * @returns {void}
 */
var Manifest = module.exports = function (opts) {
  if (!opts.webpackManifest) { throw new Error("webpackManifest is required"); }

  this.name = opts.webpackManifest.name;
  this.content = this._normalizeContent(opts.webpackManifest.content);

  var rjsCfg = opts.requirejsConfig;
  this.paths = this._normalizePaths(rjsCfg.paths);

  // Stash other options.
  this._opts = opts;
};

/**
 * Normalizes RequireJS path mappings
 *
 * @param {Object} paths    RequireJS path mappings
 * @returns {Object}        Normalized RequireJS path mappings
 */
Manifest.prototype._normalizePaths = function (paths) {
  return _.mapValues(paths, function (filePath) {
    filePath = path.normalize(filePath);
    return filePath;
  });
};

/**
 * Normalizes Webpack content path.
 *
 * @param {Object} filePath   Webpack path
 * @returns {Object}          Normalized path
 */
Manifest.prototype._normalizeWebpackPath = function (filePath) {
  // Normalize the prefix of the path.
  filePath = path.normalize(filePath);

  // Remove extensions.
  // TODO: Handle more extensions (maybe from webpack config)
  // TODO: Probably have interop work for RequireJS if allows extensions.
  filePath = filePath.replace(/\.js$/, "");

  return filePath;
};

/**
 * Normalizes Webpack content paths.
 *
 * @param {Object} content  Webpack manifest content object
 * @returns {Object}        Normalized paths for manifest
 */
Manifest.prototype._normalizeContent = function (content) {
  return _.mapKeys(content, function (num, filePath) {
    /*eslint-disable no-invalid-this*/
    return this._normalizeWebpackPath(filePath);
  }, this);
};

/**
 * Maps a RequireJS name to a Webpack lookup number.
 *
 * Throws exception if number is not found.
 *
 * @param {String}    name  RequireJS dependency name
 * @returns {Number}        Webpack lookup number
 */
/*eslint-disable max-statements*/
Manifest.prototype.mapNameToNum = function (name) {
  var num;

  // Swap name if aliased.
  // Typically used for NPM resolutions to alternate libraries from RequireJS to Webpack.
  // Example: `hbs/handlebars` -> `handlebars/runtime`
  name = this._opts.alias[name] || name;

  // Attempt straight lookup of RequireJS name.
  num = this.content[name];
  if (num) { return num; }

  // Attempt straight match of RequireJS explicit path.
  var rjsPath = this.paths[name];
  num = this.content[rjsPath];
  if (num) { return num; }

  // Resolve as NPM name.
  var npmPath;
  try {
    npmPath = require.resolve(name);
  } catch (err) {
    // Pass through
  }
  if (npmPath) {
    // Get relative path to match manifest.
    npmPath = path.relative(this._opts.webpackContext, npmPath);

    // Normalize for Webpack
    npmPath = this._normalizeWebpackPath(npmPath);

    // Attempt manifest match.
    num = this.content[npmPath];
    if (num) { return num; }
  }


  // TODO HERE -- hbs/handlebars
  console.log("TODO HERE", name, npmPath);



  // Bail if cannot find number.
  if (_.isUndefined(num)) { throw new Error("Unable to match name: " + name); }

  return num;
};
/*eslint-enable max-statements*/
