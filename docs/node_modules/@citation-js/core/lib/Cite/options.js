"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultOptions = void 0;
exports.options = options;
var _validate = require("./validate.js");
const defaultOptions = exports.defaultOptions = {
  format: 'real',
  type: 'json',
  style: 'csl',
  lang: 'en-US'
};
function options(options, log) {
  (0, _validate.validateOutputOptions)(options);
  if (log) {
    this.save();
  }
  Object.assign(this._options, options);
  return this;
}