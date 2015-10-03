"use strict";
/**
 * SourceMap comment strip loader.
 *
 * ## Background
 *
 * This loader isn't needed for anything specific in interoperability or
 * building, it is just here to reduce the size of the Webpack build to
 * something more sane. (Especially since Webpack should be adding in the
 * sourcemaps, not the underlying lib.)
 *
 * ## Scenario
 *
 * Handlebars runtime contains lots of individual files (good!), but they
 * contain inline really big source map comments (bad!) like:
 *
 * ```js
 * //# sourceMappingURL=data:application/json;base64,DATA_GOES_HERE
 * ```
 *
 * This loader just removes them.
 *
 * @param {String} content  file contents
 * @returns {String}        processed file contents
 */
module.exports = function (content) {
  if (this.cacheable) { this.cacheable(); }

  // TODO: Get a better, more robust URL or string match.
  return content.replace(/^\/\/# sourceMappingURL=.*$/gm, "");
};
