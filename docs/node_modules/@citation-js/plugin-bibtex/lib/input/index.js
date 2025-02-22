"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.formats = void 0;
var _file = require("./file.js");
var _bibtxt = require("./bibtxt.js");
var _entries = require("./entries.js");
const ref = exports.ref = '@bibtex';
const formats = exports.formats = {
  '@biblatex/text': {
    parse: _file.parse,
    parseType: {
      dataType: 'String',
      predicate: /@\s{0,5}[A-Za-z]{1,13}\s{0,5}\{\s{0,5}[^@{}"=,\\\s]{0,100}\s{0,5},[\s\S]*\}/
    }
  },
  '@biblatex/entry+object': {
    parse(input) {
      return (0, _entries.parse)([input]);
    },
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: {
        props: ['type', 'label', 'properties']
      }
    }
  },
  '@biblatex/entries+list': {
    parse: _entries.parse,
    parseType: {
      elementConstraint: '@biblatex/entry+object'
    }
  },
  '@bibtex/text': {
    parse: _file.parse,
    outputs: '@bibtex/entries+list'
  },
  '@bibtex/entry+object': {
    parse(input) {
      return (0, _entries.parseBibtex)([input]);
    }
  },
  '@bibtex/entries+list': {
    parse: _entries.parseBibtex
  },
  '@bibtxt/text': {
    parse: _bibtxt.parse,
    parseType: {
      dataType: 'String',
      predicate: /^\s*(\[(?!\s*[{[]).*?\]\s*(\n\s*[^[]((?!:)\S)+\s*:\s*.+?\s*)*\s*)+$/
    }
  }
};