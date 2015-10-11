/*eslint-disable max-params*/
define([
  "jquery",
  "custom-alias/views/header",
  "./views/message",
  "hbs!custom-alias/templates/divider"
], function ($, header, message, divider) {
  $("#content")
    .append(header("app1", "1"))
    .append(message("msg1", "1"))
    .append(divider());
});
