define([
  "hbs!custom-alias/templates/message"
], function (tmpl) {
  return function (id, msg) {
    return tmpl({
      id: id,
      msg: msg
    });
  };
});
