"use strict";

var _ = require("lodash");

/**
 * Test template generation.
 */
module.exports = {
  /**
   * Generate an HTML page with script tags in order.
   *
   * @param   {Array<Object>} scripts   Script object attributes to expand.
   * @returns {String}                  HTML string.
   */
  html: function (scripts) {
    return [].concat(
      [
        "<!DOCTYPE html>",
        "<html>",
        "  <head>",
        "    <title>Demo</title>",
        "  </head>",
        "  <body>",
        "    <div id=\"content\"></div>",
        "    <div id=\"error\"></div>",
        "    <script>",
        "      window.onerror = function (msg, file, line, col, error) {",
        "        var content = document.querySelector('#error');",
        "        content.innerHTML += '<code>'",
        "          + 'msg: ' + msg + '<br />\\n'",
        "          + 'file: ' + file + '<br />\\n'",
        "          + 'line: ' + line + '<br />\\n'",
        "          + 'col: ' + col + '<br />\\n'",
        "          + 'error: ' + error + '<br />\\n'",
        "          + '</code>';",
        "      };",
        "    </script>"
      ],
      (scripts || []).map(function (script) {
        // Strings are treated as inline functions to wrap in a closure.
        if (_.isString(script)) {
          return "    <script>(" + script + "());</script>";
        }

        // Convert script object of attributes to HTML string attributes.
        var attrs = _.map(script, function (val, key) {
          return [key, "\"" + val + "\""].join("=");
        }).join(" ");

        return "    <script " + attrs + "></script>";
      }),
      [
        "  </body>",
        "</html>"
      ]
    ).join("\n");
  }
};
