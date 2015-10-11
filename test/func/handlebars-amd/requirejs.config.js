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
    hbs: {
      helperDirectory: "helpers/"
    },
    pragmasOnSave: {
      // Removes Handlebars.Parser code (used to compile template strings).
      excludeHbsParser: true,
      // Kills the entire plugin set once it's built.
      excludeHbs: true,
      // Removes i18n precompiler, handlebars and json2
      excludeAfterBuild: true
    },


    map: {
      "*": {
        // Direct imports can only use runtime.
        "handlebars": "hbs/handlebars.runtime",
        "Handlebars": "hbs/handlebars.runtime"
      }
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
