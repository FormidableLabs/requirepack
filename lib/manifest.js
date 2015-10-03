"use strict";

var path = require("path");

var _ = require("lodash");

/**
 * Webpack manifest path / number lookup for RequireJS
 *
 * @param {Object} opts           Options object
 * @param {String} opts.context   Context for webpack manifest paths (Default: `./`)
 * @param {Object} opts.manifest  Webpack manifest object
 * @returns {void}
 */
var Manifest = module.exports = function (opts) {
  opts = _.extend({
    context: "./",
    manifest: null
  }, opts);

  if (!opts.manifest) { throw new Error("manifest is required"); }

  this.name = opts.manifest.name;
  this.content = this._normalizeContent(opts.context, opts.manifest.content);
};

/**
 * Normalizes Webpack content paths.
 *
 * @param {String} context  Context for webpack manifest paths
 * @param {Object} content  Webpack manifest content object
 * @returns {Object}        Normalized paths for manifest.
 */
Manifest.prototype._normalizeContent = function (context, content) {
  context = context || "./";
  return _.mapKeys(content, function (num, filePath) {
    // Relative to context.
    filePath = path.relative(context, filePath);

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

  // Bail if cannot find number.
  if (_.isUndefined(num)) { throw new Error("Unable to match name: " + name); }

  return num;
};
