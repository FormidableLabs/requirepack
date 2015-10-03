define(["./foo"], function (foo) {
  document.querySelector("#content").innerHTML += foo("app1", "App 1");
});
