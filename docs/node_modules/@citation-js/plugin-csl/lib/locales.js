"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.locales = exports.default = void 0;
var _core = require("@citation-js/core");
var _locales = _interopRequireDefault(require("./locales.json"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const locales = exports.locales = new _core.util.Register(_locales.default);
const fetchLocale = lang => {
  if (locales.has(lang)) {
    return locales.get(lang);
  } else {
    return locales.get('en-US');
  }
};
var _default = exports.default = fetchLocale;