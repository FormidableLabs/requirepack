define([
  "hbs!../templates/header"
], function (tmpl, appHelper) {
  return function (id, title) {
    return tmpl({
      id: id,
      title: title
    });
  };
});
