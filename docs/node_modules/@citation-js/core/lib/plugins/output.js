"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.format = format;
exports.has = has;
exports.list = list;
exports.register = void 0;
exports.remove = remove;
var _register = _interopRequireDefault(require("../util/register.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function validate(name, formatter) {
  if (typeof name !== 'string') {
    throw new TypeError(`Invalid output format name, expected string, got ${typeof name}`);
  } else if (typeof formatter !== 'function') {
    throw new TypeError(`Invalid formatter, expected function, got ${typeof formatter}`);
  }
}
const register = exports.register = new _register.default();
function add(name, formatter) {
  validate(name, formatter);
  register.set(name, formatter);
}
function remove(name) {
  register.remove(name);
}
function has(name) {
  return register.has(name);
}
function list() {
  return register.list();
}
function format(name, data, ...options) {
  if (!register.has(name)) {
    throw new Error(`Output format "${name}" unavailable`);
  }
  return register.get(name)(data, ...options);
}