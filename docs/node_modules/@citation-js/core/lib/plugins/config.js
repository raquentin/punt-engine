"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.get = get;
exports.has = has;
exports.list = list;
exports.remove = remove;
const configs = {};
function add(ref, config) {
  configs[ref] = config;
}
function get(ref) {
  return configs[ref];
}
function has(ref) {
  return Object.prototype.hasOwnProperty.call(configs, ref);
}
function remove(ref) {
  delete configs[ref];
}
function list() {
  return Object.keys(configs);
}