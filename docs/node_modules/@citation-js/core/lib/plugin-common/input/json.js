"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.parse = parseJSON;
var _logger = _interopRequireDefault(require("../../logger.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const substituters = [[/((?:\[|:|,)\s*)'((?:\\'|[^'])*?[^\\])?'(?=\s*(?:\]|}|,))/g, '$1"$2"'], [/((?:(?:"|]|}|\/[gmiuys]|\.|(?:\d|\.|-)*\d)\s*,|{)\s*)(?:"([^":\n]+?)"|'([^":\n]+?)'|([^":\n]+?))(\s*):/g, '$1"$2$3$4"$5:']];
function parseJSON(str) {
  if (typeof str !== 'string') {
    return JSON.parse(str);
  }
  try {
    return JSON.parse(str);
  } catch (e) {
    _logger.default.debug('[plugin-common]', 'Invalid JSON, switching to experimental parser');
    substituters.forEach(([regex, subst]) => {
      str = str.replace(regex, subst);
    });
    return JSON.parse(str);
  }
}