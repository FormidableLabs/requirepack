/*eslint-disable strict*/
(function () {
  // Hack: Make the config directly importable in Node.
  if (typeof require.config === "undefined") {
    /*global module:false*/
    require.config = function (obj) { module.exports = obj; };
  }

  // Configure RequireJS.
  require.config({
    baseUrl: "./src",

    // HBS options / build.
    //
    // TODO: Switch to `hbs/handlebars.runtime`. The
    // `require-handlebars-plugin` is just the worst at this. We've got the
    // **full** compiler currently in the RequireJS bundle. But, as we're
    // targeting interop with the Webpack HBS, skipping for now.
    hbs: {
      helpers: false
    },
    pragmasOnSave: {
      // Removes Handlebars.Parser code (used to compile template strings).
      excludeHbsParser: true,
      // Kills the entire plugin set once it's built.
      excludeHbs: true,
      // Removes i18n precompiler, handlebars and json2
      excludeAfterBuild: true
    },

    paths: {
      "custom-alias": "./",
      jquery: "../../../../node_modules/jquery/dist/jquery",
      hbs: "../../../../node_modules/require-handlebars-plugin/hbs"
    }
  });

  // For `requirejs.build.js`, see:
  // https://github.com/jrburke/r.js/blob/master/build/example.build.js
}());
