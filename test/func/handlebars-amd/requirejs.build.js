({
  appDir: "src",
  baseUrl: ".",
  dir: "build/requirejs",
  mainConfigFile: "./requirejs.config.js",
  modules: [
    {
      name: "lib"
    },
    {
      name: "app1",
      exclude: ["lib"],
      insertRequire: ["app1"]
    },
    {
      name: "app2",
      exclude: ["lib"],
      insertRequire: ["app2"]
    }
  ],
  optimize: "none",

  // The hbs plugin does not properly exclude `hbs/handlebars`, the compiler.
  // See: https://github.com/SlexAxton/require-handlebars-plugin/issues/77
  //
  // So, we're diving in with chainsaws and crowbars and beating the build
  // into shape. :(
  onBuildWrite: function (moduleName, path, contents) {
    if (moduleName === "hbs/handlebars") {
      return "// Manually replace HBS compiler from Atlas build.\n" +
        "define('hbs/handlebars', ['hbs/handlebars.runtime'], " +
        "function (Handlebars) { return Handlebars; });";
    }

    return contents;
  }
})