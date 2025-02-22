"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _biblatexTypes = _interopRequireDefault(require("./mapping/biblatexTypes.json"));
var _bibtexTypes = _interopRequireDefault(require("./mapping/bibtexTypes.json"));
var constants = _interopRequireWildcard(require("./input/constants.js"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var _default = exports.default = {
  constants,
  types: {
    biblatex: _biblatexTypes.default,
    bibtex: _bibtexTypes.default
  },
  parse: {
    biblatex: true,
    strict: false,
    sentenceCase: 'never'
  },
  format: {
    useIdAsLabel: false,
    checkLabel: true,
    asciiOnly: true
  },
  biber: {
    annotationMarker: '+an',
    namedAnnotationMarker: ':'
  }
};