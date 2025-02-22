"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Grammar", {
  enumerable: true,
  get: function () {
    return _grammar.Grammar;
  }
});
Object.defineProperty(exports, "Register", {
  enumerable: true,
  get: function () {
    return _register.default;
  }
});
Object.defineProperty(exports, "TokenStack", {
  enumerable: true,
  get: function () {
    return _stack.default;
  }
});
Object.defineProperty(exports, "Translator", {
  enumerable: true,
  get: function () {
    return _translator.Translator;
  }
});
Object.defineProperty(exports, "deepCopy", {
  enumerable: true,
  get: function () {
    return _deepCopy.default;
  }
});
Object.defineProperty(exports, "downgradeCsl", {
  enumerable: true,
  get: function () {
    return _csl.downgradeCsl;
  }
});
Object.defineProperty(exports, "fetchFile", {
  enumerable: true,
  get: function () {
    return _fetchFile.fetchFile;
  }
});
Object.defineProperty(exports, "fetchFileAsync", {
  enumerable: true,
  get: function () {
    return _fetchFile.fetchFileAsync;
  }
});
Object.defineProperty(exports, "fetchId", {
  enumerable: true,
  get: function () {
    return _fetchId.default;
  }
});
Object.defineProperty(exports, "setUserAgent", {
  enumerable: true,
  get: function () {
    return _fetchFile.setUserAgent;
  }
});
Object.defineProperty(exports, "upgradeCsl", {
  enumerable: true,
  get: function () {
    return _csl.upgradeCsl;
  }
});
var _csl = require("./csl.js");
var _deepCopy = _interopRequireDefault(require("./deepCopy.js"));
var _fetchFile = require("./fetchFile.js");
var _fetchId = _interopRequireDefault(require("./fetchId.js"));
var _stack = _interopRequireDefault(require("./stack.js"));
var _register = _interopRequireDefault(require("./register.js"));
var _grammar = require("./grammar.js");
var _translator = require("./translator.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }