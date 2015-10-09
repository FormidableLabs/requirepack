/*eslint-disable max-params*/
define([
  "jquery",
  "./views/header",
  "custom-alias/views/message",
  "hbs!./templates/divider"
], function ($, header, message, divider) {
  $("#content")
    .append(header("app2", "2"))
    .append(message("msg2", "2"))
    .append(divider());
});
