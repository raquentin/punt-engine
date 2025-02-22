"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = citation;
var _core = require("@citation-js/core");
var _engines = _interopRequireDefault(require("./engines.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function prepareCiteItem(citeItem) {
  return typeof citeItem === 'object' ? citeItem : {
    id: citeItem
  };
}
function prepareCitation(citation) {
  if (citation.citationItems) {
    return citation;
  }
  return {
    citationItems: [].concat(citation).map(prepareCiteItem),
    properties: {
      noteIndex: 0
    }
  };
}
function prepareCitations(context) {
  if (!context) {
    return [];
  }
  return context.map(prepareCitation);
}
function citation(data, options = {}) {
  const {
    template = 'apa',
    lang,
    format = 'text'
  } = options;
  const ids = data.map(({
    id
  }) => id);
  const entries = options.entry ? options.entry : ids;
  data = _core.util.downgradeCsl(data);
  const citeproc = (0, _engines.default)(data, template, lang, format);
  const before = prepareCitations(options.citationsPre);
  const citation = prepareCitation(entries);
  const after = prepareCitations(options.citationsPost);
  const output = citeproc.rebuildProcessorState([...before, citation, ...after], format, []);
  return output[before.length][2];
}