"use strict";

var _core = require("@citation-js/core");
var _index = require("./input/index.js");
var _config = _interopRequireDefault(require("./config.js"));
var _index2 = _interopRequireDefault(require("./output/index.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
_core.plugins.add(_index.ref, {
  input: _index.formats,
  output: _index2.default,
  config: _config.default
});