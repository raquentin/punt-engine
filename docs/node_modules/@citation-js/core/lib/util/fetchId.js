"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function fetchId(list, prefix) {
  let id;
  while (id === undefined || list.includes(id)) {
    id = `${prefix}${Math.random().toString().slice(2)}`;
  }
  return id;
}
var _default = exports.default = fetchId;