/*eslint-disable max-params*/
define([
  "jquery",
  "custom-alias/views/header",
  "./views/message",
  "hbs!custom-alias/templates/divider"
], function ($, header, message, divider) {
  $("#content")
    .append(header("app1", "App 1"))
    .append(message("message 1"))
    .append(divider());
});
