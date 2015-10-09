/**
 * Prefixes "Message " to strings.
 *
 * Usage: `{{message "1"}}`
 */
define([
  "handlebars"
], function (Handlebars) {

  var message = function (input) {
    return "Message " + input;
  };

  Handlebars.registerHelper("message-helper", message);

  return message;
});
