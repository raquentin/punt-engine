"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
exports.formatBibtex = formatBibtex;
var _index = require("../mapping/index.js");
var _value = require("./value.js");
function formatEntryValues({
  type,
  label,
  properties
}) {
  const output = {
    type,
    label,
    properties: {}
  };
  for (const property in properties) {
    const value = properties[property];
    const [field, annotation] = property.split('+an:');
    if (annotation) {
      if (!output.annotations) {
        output.annotations = {};
      }
      if (!output.annotations[field]) {
        output.annotations[field] = {};
      }
      output.annotations[field][annotation] = (0, _value.formatAnnotation)(value);
    } else {
      output.properties[property] = (0, _value.format)(property, value);
    }
  }
  return output;
}
function format(entries) {
  return (0, _index.format)(entries).map(formatEntryValues);
}
function formatBibtex(entries) {
  return (0, _index.formatBibtex)(entries).map(formatEntryValues);
}