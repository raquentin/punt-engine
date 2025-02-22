"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ref = exports.parsers = exports.formats = void 0;
var json = _interopRequireWildcard(require("./json.js"));
var _core = require("@citation-js/core");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const scraperLinks = ['fulltext_html', 'fulltext_xml', 'fulltext_pdf'];
const authorNameFields = ['name', 'lastname', 'lastName', 'firstname', 'firstName'];
const ref = exports.ref = '@bibjson';
const parsers = exports.parsers = {
  json
};
const formats = exports.formats = {
  '@bibjson/quickscrape+record+object': {
    parse: json.quickscrapeRecord,
    parseType: {
      propertyConstraint: {
        props: 'link',
        value(links) {
          return scraperLinks.some(link => links.find(({
            type
          }) => type === link));
        }
      },
      extends: '@bibjson/record+object'
    }
  },
  '@bibjson/record+object': {
    parse: json.record,
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: [{
        props: 'title'
      }, {
        props: ['author', 'editor'],
        match: 'some',
        value(authors) {
          return Array.isArray(authors) && authors[0] && authorNameFields.some(field => field in authors[0]);
        }
      }]
    }
  },
  '@bibjson/collection+object': {
    parse(collection) {
      return collection.records;
    },
    parseType: {
      dataType: 'SimpleObject',
      propertyConstraint: [{
        props: 'metadata',
        value(metadata) {
          return 'collection' in metadata;
        }
      }, {
        props: 'records',
        value(records) {
          return Array.isArray(records);
        }
      }]
    }
  }
};
_core.plugins.add(ref, {
  input: formats
});