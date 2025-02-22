"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.get = get;
exports.has = has;
exports.list = list;
exports.remove = remove;
var _parser = require("./parser.js");
var _type = require("./type.js");
var _data = require("./data.js");
const formats = {};
function add(format, parsers) {
  const formatParser = new _parser.FormatParser(format, parsers);
  formatParser.validate();
  const index = formats[format] || (formats[format] = {});
  if (formatParser.typeParser) {
    (0, _type.addTypeParser)(format, formatParser.typeParser);
    index.type = true;
  }
  if (formatParser.dataParser) {
    (0, _data.addDataParser)(format, formatParser.dataParser);
    index.data = true;
  }
  if (formatParser.asyncDataParser) {
    (0, _data.addDataParser)(format, formatParser.asyncDataParser);
    index.asyncData = true;
  }
  if (parsers.outputs) {
    index.outputs = parsers.outputs;
  }
}
function get(format) {
  return formats[format];
}
function remove(format) {
  const index = formats[format];
  if (!index) {
    return;
  }
  if (index.type) {
    (0, _type.removeTypeParser)(format);
  }
  if (index.data) {
    (0, _data.removeDataParser)(format);
  }
  if (index.asyncData) {
    (0, _data.removeDataParser)(format, true);
  }
  delete formats[format];
}
function has(format) {
  return format in formats;
}
function list() {
  return Object.keys(formats);
}