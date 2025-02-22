"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.getJsonWrapper = getJsonWrapper;
var plugins = _interopRequireWildcard(require("../../plugins/index.js"));
var util = _interopRequireWildcard(require("../../util/index.js"));
var _logger = _interopRequireDefault(require("../../logger.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function appendCommas(string, index, array) {
  return string + (index < array.length - 1 ? ',' : '');
}
function getJsonObject(src, dict) {
  const isArray = Array.isArray(src);
  let entries;
  if (isArray) {
    entries = src.map(entry => getJsonValue(entry, dict));
  } else {
    entries = Object.keys(src).filter(prop => JSON.stringify(src[prop])).map(prop => `"${prop}": ${getJsonValue(src[prop], dict)}`);
  }
  entries = entries.map(appendCommas).map(entry => dict.listItem.join(entry));
  entries = dict.list.join(entries.join(''));
  return isArray ? `[${entries}]` : `{${entries}}`;
}
function getJsonValue(src, dict) {
  if (typeof src === 'object' && src !== null) {
    if (src.length === 0) {
      return '[]';
    } else if (Object.keys(src).length === 0) {
      return '{}';
    } else {
      return getJsonObject(src, dict);
    }
  } else {
    return JSON.stringify(src);
  }
}
function getJson(src, dict) {
  let entries = src.map(entry => getJsonObject(entry, dict));
  entries = entries.map(appendCommas).map(entry => dict.entry.join(entry));
  entries = entries.join('');
  return dict.bibliographyContainer.join(`[${entries}]`);
}
function getJsonWrapper(src) {
  return getJson(src, plugins.dict.get('html'));
}
var _default = exports.default = {
  data(data, {
    type,
    format = type || 'text',
    version = '1.0.2'
  } = {}) {
    if (version < '1.0.2') {
      data = util.downgradeCsl(data);
    }
    if (format === 'object') {
      return util.deepCopy(data);
    } else if (format === 'text') {
      return JSON.stringify(data, null, 2);
    } else {
      _logger.default.warn('[core]', 'This feature (JSON output with special formatting) is unstable. See https://github.com/larsgw/citation.js/issues/144');
      return getJson(data, plugins.dict.get(format));
    }
  },
  ndjson(data, {
    version = '1.0.2'
  } = {}) {
    if (version < '1.0.2') {
      data = util.downgradeCsl(data);
    }
    return data.map(entry => JSON.stringify(entry)).join('\n');
  }
};