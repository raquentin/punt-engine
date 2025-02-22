"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.get = get;
exports.getIds = getIds;
var _validate = require("./validate.js");
var _output = require("../plugins/output.js");
var _csl = require("../plugins/input/csl.js");
function getIds() {
  return this.data.map(entry => entry.id);
}
function format(format, ...options) {
  return (0, _output.format)(format, (0, _csl.clean)(this.data), ...options);
}
function get(options = {}) {
  (0, _validate.validateOutputOptions)(options);
  const parsedOptions = Object.assign({}, this.defaultOptions, this._options.output, options);
  const {
    type,
    style
  } = parsedOptions;
  const [styleType, styleFormat] = style.split('-');
  const newStyle = styleType === 'citation' ? 'bibliography' : styleType === 'csl' ? 'data' : styleType;
  const newType = type === 'string' ? 'text' : type === 'json' ? 'object' : type;
  let formatOptions;
  switch (newStyle) {
    case 'bibliography':
      {
        const {
          lang,
          append,
          prepend
        } = parsedOptions;
        formatOptions = {
          template: styleFormat,
          lang,
          format: newType,
          append,
          prepend
        };
        break;
      }
    case 'data':
    case 'bibtex':
    case 'bibtxt':
    case 'ndjson':
    case 'ris':
      formatOptions = {
        type: newType
      };
      break;
    default:
      throw new Error(`Invalid style "${newStyle}"`);
  }
  const result = this.format(newStyle, Object.assign(formatOptions, options._newOptions));
  const {
    format
  } = parsedOptions;
  if (format === 'real' && newType === 'html' && typeof document !== 'undefined' && typeof document.createElement === 'function') {
    const tmp = document.createElement('div');
    tmp.innerHTML = result;
    return tmp.firstChild;
  } else if (format === 'string' && typeof result === 'object') {
    return JSON.stringify(result);
  } else {
    return result;
  }
}