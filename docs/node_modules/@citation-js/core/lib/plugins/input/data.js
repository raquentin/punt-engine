"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addDataParser = addDataParser;
exports.data = data;
exports.dataAsync = dataAsync;
exports.hasDataParser = hasDataParser;
exports.listDataParser = listDataParser;
exports.removeDataParser = removeDataParser;
var _chain = require("./chain.js");
const parsers = {};
const asyncParsers = {};
const nativeParsers = {
  '@csl/object': input => [input],
  '@csl/list+object': input => input,
  '@else/list+object': input => input.map(_chain.chain).flat(),
  '@invalid': () => {
    throw new Error('This format is not supported or recognized');
  }
};
const nativeAsyncParsers = {
  '@else/list+object': async input => (await Promise.all(input.map(_chain.chainAsync))).flat()
};
function data(input, type) {
  if (typeof parsers[type] === 'function') {
    return parsers[type](input);
  } else if (typeof nativeParsers[type] === 'function') {
    return nativeParsers[type](input);
  } else {
    throw new TypeError(`No synchronous parser found for ${type}`);
  }
}
async function dataAsync(input, type) {
  if (typeof asyncParsers[type] === 'function') {
    return asyncParsers[type](input);
  } else if (typeof nativeAsyncParsers[type] === 'function') {
    return nativeAsyncParsers[type](input);
  } else if (hasDataParser(type, false)) {
    return data(input, type);
  } else {
    throw new TypeError(`No parser found for ${type}`);
  }
}
function addDataParser(format, {
  parser,
  async
}) {
  if (async) {
    asyncParsers[format] = parser;
  } else {
    parsers[format] = parser;
  }
}
function hasDataParser(type, async) {
  return async ? asyncParsers[type] || nativeAsyncParsers[type] : parsers[type] || nativeParsers[type];
}
function removeDataParser(type, async) {
  delete (async ? asyncParsers : parsers)[type];
}
function listDataParser(async) {
  return Object.keys(async ? asyncParsers : parsers);
}