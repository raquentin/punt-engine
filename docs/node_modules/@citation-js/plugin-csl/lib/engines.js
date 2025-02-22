"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchEngine = exports.default = void 0;
var _citeproc = _interopRequireDefault(require("citeproc"));
var _styles = require("./styles.js");
var _locales = require("./locales.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const proxied = Symbol.for('proxied');
const getWrapperProxy = function (original) {
  const proxy = function (state, entry) {
    if (state.sys.wrapBibliographyEntry) {
      const [prefix, postfix] = state.sys.wrapBibliographyEntry(this.system_id);
      entry = [prefix, entry, postfix].join('');
    }
    return original.call(this, state, entry);
  };
  proxy[proxied] = true;
  return proxy;
};
for (const format in _citeproc.default.Output.Formats) {
  const original = _citeproc.default.Output.Formats[format]['@bibliography/entry'];
  if (!original || original[proxied]) {
    continue;
  }
  _citeproc.default.Output.Formats[format]['@bibliography/entry'] = getWrapperProxy(original);
}
function retrieveLocale(locale) {
  if (_locales.locales.has(locale)) {
    return _locales.locales.get(locale);
  }
  const unnormalised = locale.replace('-', '_');
  if (_locales.locales.has(unnormalised)) {
    return _locales.locales.get(unnormalised);
  }
  return {};
}
const engines = {};
const fetchEngine = function (style, locale, styleXml, retrieveItem, retrieveLocale) {
  const engineHash = `${style}|${locale}`;
  let engine;
  if (engines[engineHash] instanceof _citeproc.default.Engine) {
    engine = engines[engineHash];
    engine.sys.retrieveItem = retrieveItem;
    engine.sys.wrapBibliographyEntry = undefined;
    engine.updateItems([]);
  } else {
    engine = engines[engineHash] = new _citeproc.default.Engine({
      retrieveLocale,
      retrieveItem
    }, styleXml, locale, true);
  }
  return engine;
};
exports.fetchEngine = fetchEngine;
const prepareEngine = function (data, style, locale, format) {
  if (!_citeproc.default.Output.Formats[format] || !_citeproc.default.Output.Formats[format]['@bibliography/entry']) {
    throw new TypeError(`Cannot find format '${format}'`);
  }
  const items = data.reduce((store, entry) => {
    store[entry.id] = entry;
    return store;
  }, {});
  const template = _styles.templates.get(_styles.templates.has(style) ? style : 'apa');
  locale = _locales.locales.has(locale) ? locale : undefined;
  const callback = function (key) {
    if (Object.prototype.hasOwnProperty.call(items, key)) {
      return items[key];
    } else {
      throw new Error(`Cannot find entry with id '${key}'`);
    }
  };
  const engine = fetchEngine(style, locale, template, callback, retrieveLocale);
  engine.setOutputFormat(format);
  engine.opt.development_extensions.wrap_url_and_doi = false;
  return engine;
};
var _default = exports.default = prepareEngine;