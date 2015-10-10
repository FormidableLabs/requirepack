define([
  "hbs!../templates/header"
], function (tmpl) {
  return function (id, title) {
    return tmpl({
      id: id,
      title: title
    });
  };
});
