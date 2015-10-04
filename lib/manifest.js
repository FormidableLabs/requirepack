"use strict";

var path = require("path");

var _ = require("lodash");

/**
 * Webpack manifest path / number lookup for RequireJS
 *
 * @param {Object} opts                 Options object
 * @param {Object} opts.manifest        Webpack manifest object
 * @param {Object} opts.requirejsConfig RequireJS configuration object
 * @returns {void}
 */
var Manifest = module.exports = function (opts) {
  opts = _.merge({
    manifest: null,
    requirejsConfig: {
      paths: {}
    }
  }, opts);

  if (!opts.manifest) { throw new Error("manifest is required"); }

  this.name = opts.manifest.name;
  this.content = this._normalizeContent(opts.manifest.content);

  var rjsCfg = opts.requirejsConfig;
  this.paths = this._normalizePaths(rjsCfg.paths);
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
 * Normalizes Webpack content paths.
 *
 * @param {Object} content  Webpack manifest content object
 * @returns {Object}        Normalized paths for manifest.
 */
Manifest.prototype._normalizeContent = function (content) {
  return _.mapKeys(content, function (num, filePath) {
    // Normalize the prefix of the path.
    filePath = path.normalize(filePath);

    // Remove extensions.
    // TODO: Handle more extensions (maybe from webpack config)
    // TODO: Probably have interop work for RequireJS if allows extensions.
    filePath = filePath.replace(/\.js$/, "");

    return filePath;
  });
};

/**
 * Maps a RequireJS name to a Webpack lookup number.
 *
 * Throws exception if number is not found.
 *
 * @param {String}    name  RequireJS dependency name
 * @returns {Number}        Webpack lookup number
 */
Manifest.prototype.mapNameToNum = function (name) {
  var num;

  // Attempt straight lookup of RequireJS name.
  num = this.content[name];
  if (num) { return num; }

  // Attempt straight match of RequireJS explicit path.
  var rjsPath = this.paths[name];
  num = this.content[rjsPath];
  if (num) { return num; }

  // TODO HERE -- hbs/handlebars
  console.log("TODO HERE", name, this.paths);


  // Bail if cannot find number.
  if (_.isUndefined(num)) { throw new Error("Unable to match name: " + name); }

  return num;
};
