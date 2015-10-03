/*eslint-disable strict*/
(function () {
  // Hack: Make the config directly importable in Node.
  if (typeof require.config === "undefined") {
    /*global module:false*/
    require.config = function (obj) { module.exports = obj; };
  }

  // Configure RequireJS.
  require.config({
    baseUrl: "./src"
  });

  // For `requirejs.build.js`, see:
  // https://github.com/jrburke/r.js/blob/master/build/example.build.js
}());
