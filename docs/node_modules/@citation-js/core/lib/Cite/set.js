"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.add = add;
exports.addAsync = addAsync;
exports.reset = reset;
exports.set = set;
exports.setAsync = setAsync;
var _index = require("../plugins/input/index.js");
var _fetchId = _interopRequireDefault(require("../util/fetchId.js"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function add(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data.push(...(0, _index.chain)(data, options));
  this.data.filter(entry => !Object.prototype.hasOwnProperty.call(entry, 'id')).forEach(entry => {
    entry.id = (0, _fetchId.default)(this.getIds(), 'temp_id_');
  });
  return this;
}
async function addAsync(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data.push(...(await (0, _index.chainAsync)(data, options)));
  this.data.filter(entry => !Object.prototype.hasOwnProperty.call(entry, 'id')).forEach(entry => {
    entry.id = (0, _fetchId.default)(this.getIds(), 'temp_id_');
  });
  return this;
}
function set(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data = [];
  return typeof options !== 'boolean' ? this.add(data, options) : this.add(data);
}
async function setAsync(data, options = {}, log = false) {
  if (options === true || log === true) {
    this.save();
  }
  this.data = [];
  return typeof options !== 'boolean' ? this.addAsync(data, options) : this.addAsync(data);
}
function reset(log) {
  if (log) {
    this.save();
  }
  this.data = [];
  this._options = {};
  return this;
}