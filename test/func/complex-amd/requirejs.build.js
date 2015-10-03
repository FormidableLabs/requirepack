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
  optimize: "none"
})