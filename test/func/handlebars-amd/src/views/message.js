define([
  "hbs!custom-alias/templates/message",

  // BUG: RequireJS plugin doesn't work. Explicitly include.
  "../helpers/app-helper"
], function (tmpl) {
  return function (id, msg) {
    return tmpl({
      id: id,
      msg: msg
    });
  };
});
