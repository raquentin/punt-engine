"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.parsers = exports.formats = void 0;
var empty = _interopRequireWildcard(require("./empty.js"));
var json = _interopRequireWildcard(require("./json.js"));
var jquery = _interopRequireWildcard(require("./jquery.js"));
var html = _interopRequireWildcard(require("./html.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const ref = exports.ref = '@else';
const parsers = exports.parsers = {
  empty,
  json,
  jquery,
  html
};
const formats = exports.formats = {
  '@empty/text': {
    parse: empty.parse,
    parseType: {
      dataType: 'String',
      predicate: input => input === ''
    }
  },
  '@empty/whitespace+text': {
    parse: empty.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s+$/
    }
  },
  '@empty': {
    parse: empty.parse,
    parseType: {
      dataType: 'Primitive',
      predicate: input => input == null
    }
  },
  '@else/json': {
    parse: json.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(\{[\S\s]*\}|\[[\S\s]*\])\s*$/
    }
  },
  '@else/url': {
    parseType: {
      dataType: 'String',
      predicate: /^https?:\/\/(([\w-]+\.)*[\w-]+)(:\d+)?(\/[^?/]*)*(\?[^#]*)?(#.*)?$/i
    }
  },
  '@else/jquery': {
    parse: jquery.parse,
    parseType: {
      dataType: 'ComplexObject',
      predicate(input) {
        return typeof jQuery !== 'undefined' && input instanceof jQuery;
      }
    }
  },
  '@else/html': {
    parse: html.parse,
    parseType: {
      dataType: 'ComplexObject',
      predicate(input) {
        return typeof HTMLElement !== 'undefined' && input instanceof HTMLElement;
      }
    }
  }
};