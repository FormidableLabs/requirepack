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
        "    <div id=\"content\" />"
      ],
      (scripts || []).map(function (script) {
        // Convert script object of attributes to HTML string attributes.
        var attrs = _.map(script, function (val, key) {
          return [key, "\"" + val + "\""].join("=");
        }).join(" ");

        return "    <script " + attrs +"></script>";
      }),
      [
        "  </body>",
        "</html>"
      ]
    ).join("\n");
  }
};
