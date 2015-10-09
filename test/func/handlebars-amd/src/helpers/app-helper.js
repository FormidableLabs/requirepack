/**
 * Prefixes "App " to strings.
 *
 * Usage: `{{#app}}1{{/app}}`
 */
define([
  "handlebars"
], function (Handlebars) {

  var app = function (options) {
    return "App " + options.fn(this);
  };

  Handlebars.registerHelper("app-helper", app);

  return app;
});
