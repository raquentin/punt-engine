"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "format", {
  enumerable: true,
  get: function get() {
    return _output.default;
  }
});
Object.defineProperty(exports, "parse", {
  enumerable: true,
  get: function get() {
    return _input.default;
  }
});

var _input = _interopRequireDefault(require("./input"));

var _output = _interopRequireDefault(require("./output"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }