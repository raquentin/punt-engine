"use strict";

var _core = require("@citation-js/core");
var _locales = require("./locales.js");
var _styles = require("./styles.js");
var _engines = _interopRequireDefault(require("./engines.js"));
var _bibliography = _interopRequireDefault(require("./bibliography.js"));
var _citation = _interopRequireDefault(require("./citation.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_core.plugins.add('@csl', {
  output: {
    bibliography: _bibliography.default,
    citation: _citation.default
  },
  config: {
    engine: _engines.default,
    locales: _locales.locales,
    templates: _styles.templates
  }
});