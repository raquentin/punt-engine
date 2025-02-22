"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
function async(data, options, callback) {
  if (typeof options === 'function' && !callback) {
    callback = options;
    options = undefined;
  }
  const promise = new this().setAsync(data, options);
  if (typeof callback === 'function') {
    promise.then(callback);
    return undefined;
  } else {
    return promise;
  }
}
var _default = exports.default = async;