"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.dict = exports.config = void 0;
exports.has = has;
exports.input = void 0;
exports.list = list;
exports.output = void 0;
exports.remove = remove;
var input = _interopRequireWildcard(require("./input/index.js"));
exports.input = input;
var output = _interopRequireWildcard(require("./output.js"));
exports.output = output;
var dict = _interopRequireWildcard(require("./dict.js"));
exports.dict = dict;
var config = _interopRequireWildcard(require("./config.js"));
exports.config = config;
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const registers = {
  input,
  output,
  dict,
  config
};
const indices = {};
function add(ref, plugins = {}) {
  const mainIndex = indices[ref] = {};
  for (const type in plugins) {
    if (type === 'config') {
      mainIndex.config = {
        [ref]: plugins.config
      };
      registers.config.add(ref, plugins.config);
      continue;
    }
    const typeIndex = mainIndex[type] = {};
    const typePlugins = plugins[type];
    for (const name in typePlugins) {
      const typePlugin = typePlugins[name];
      typeIndex[name] = true;
      registers[type].add(name, typePlugin);
    }
  }
}
function remove(ref) {
  const mainIndex = indices[ref];
  for (const type in mainIndex) {
    const typeIndex = mainIndex[type];
    for (const name in typeIndex) {
      registers[type].remove(name);
    }
  }
  delete indices[ref];
}
function has(ref) {
  return ref in indices;
}
function list() {
  return Object.keys(indices);
}