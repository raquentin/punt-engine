"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
exports.fetchFile = fetchFile;
exports.fetchFileAsync = fetchFileAsync;
exports.setUserAgent = setUserAgent;
var _syncFetch = _interopRequireDefault(require("sync-fetch"));
var _fetchPonyfill = _interopRequireDefault(require("fetch-ponyfill"));
var _logger = _interopRequireDefault(require("../logger.js"));
var _package = _interopRequireDefault(require("../../package.json"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const isBrowser = typeof location !== 'undefined' && typeof navigator !== 'undefined';
const {
  fetch: asyncFetch,
  Headers: asyncHeaders
} = typeof fetch === 'function' && isBrowser ? {
  fetch,
  Headers
} : (0, _fetchPonyfill.default)();
let userAgent = `Citation.js/${_package.default.version}`;
if (typeof process !== 'undefined' && process && process.release && process.release.name === 'node' && process.version) {
  userAgent += ` Node.js/${process.version}`;
}
function normaliseHeaders(headers) {
  const result = {};
  const entries = headers instanceof asyncHeaders || headers instanceof _syncFetch.default.Headers ? Array.from(headers) : Object.entries(headers);
  for (const [name, header] of entries) {
    result[name.toLowerCase()] = header.toString();
  }
  return result;
}
function parseOpts(opts = {}) {
  const reqOpts = {
    headers: {
      accept: '*/*'
    },
    method: 'GET',
    checkContentType: opts.checkContentType
  };
  if (userAgent && !isBrowser) {
    reqOpts.headers['user-agent'] = userAgent;
  }
  if (opts.body) {
    reqOpts.method = 'POST';
    const isJson = typeof opts.body !== 'string';
    reqOpts.body = isJson ? JSON.stringify(opts.body) : opts.body;
    reqOpts.headers['content-type'] = isJson ? 'application/json' : 'text/plain';
  }
  if (opts.headers) {
    Object.assign(reqOpts.headers, normaliseHeaders(opts.headers));
  }
  return reqOpts;
}
function sameType(request, response) {
  if (!request.accept || request.accept === '*/*' || !response['content-type']) {
    return true;
  }
  const [a, b] = response['content-type'].split(';')[0].trim().split('/');
  return request.accept.split(',').map(type => type.split(';')[0].trim().split('/')).some(([c, d]) => (c === a || c === '*') && (d === b || d === '*'));
}
function checkResponse(response, opts) {
  const {
    status,
    headers
  } = response;
  let error;
  if (status >= 400) {
    error = new Error(`Server responded with status code ${status}`);
  } else if (opts.checkContentType === true && !sameType(opts.headers, normaliseHeaders(headers))) {
    error = new Error(`Server responded with content-type ${headers.get('content-type')}`);
  }
  if (error) {
    error.status = status;
    error.headers = headers;
    error.body = response.body;
    throw error;
  }
  return response;
}
function fetchFile(url, opts) {
  const reqOpts = parseOpts(opts);
  _logger.default.http('[core]', reqOpts.method, url, reqOpts);
  const response = checkResponse((0, _syncFetch.default)(url, reqOpts), reqOpts);
  return response.text();
}
async function fetchFileAsync(url, opts) {
  const reqOpts = parseOpts(opts);
  _logger.default.http('[core]', reqOpts.method, url, reqOpts);
  return asyncFetch(url, reqOpts).then(response => checkResponse(response, reqOpts)).then(response => response.text());
}
function setUserAgent(newUserAgent) {
  userAgent = newUserAgent;
}
var _default = exports.default = fetchFile;