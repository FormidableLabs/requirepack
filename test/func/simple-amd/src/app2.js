define(["./foo"], function (foo) {
  document.querySelector("#content").innerHTML += foo("app2", "App 2");
});
