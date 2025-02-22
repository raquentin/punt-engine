"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
var _config = _interopRequireDefault(require("../config.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function formatField(field, value, dict) {
  return dict.listItem.join(`${field} = {${value}},`);
}
function formatEntry(entry, dict) {
  const fields = [];
  for (const field in entry.properties) {
    fields.push(formatField(field, entry.properties[field], dict));
    if (entry.annotations && entry.annotations[field]) {
      for (const annotation in entry.annotations[field]) {
        let annotationField = field + _config.default.biber.annotationMarker;
        if (annotation !== 'default') {
          annotationField += _config.default.biber.namedAnnotationMarker + annotation;
        }
        fields.push(formatField(annotationField, entry.annotations[field][annotation], dict));
      }
    }
  }
  return dict.entry.join(`@${entry.type}{${entry.label},${dict.list.join(fields.join(''))}}`);
}
function format(src, dict) {
  const entries = src.map(entry => formatEntry(entry, dict)).join('');
  return dict.bibliographyContainer.join(entries);
}