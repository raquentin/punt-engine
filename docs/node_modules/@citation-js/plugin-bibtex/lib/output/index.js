"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _core = require("@citation-js/core");
var _entries = require("./entries.js");
var _bibtex = require("./bibtex.js");
var _bibtxt = require("./bibtxt.js");
const factory = function (mapper, formatter) {
  return function (data, opts = {}) {
    const {
      type,
      format = type || 'text'
    } = opts;
    data = mapper(data);
    if (format === 'object') {
      return data;
    } else if (_core.plugins.dict.has(format)) {
      return formatter(data, _core.plugins.dict.get(format), opts);
    } else {
      throw new RangeError(`Output dictionary "${format}" not available`);
    }
  };
};
var _default = exports.default = {
  bibtex: factory(_entries.formatBibtex, _bibtex.format),
  biblatex: factory(_entries.format, _bibtex.format),
  bibtxt: factory(_entries.formatBibtex, _bibtxt.format)
};