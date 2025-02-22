"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

const monthMap = {
  jan: 1,
  feb: 2,
  mar: 3,
  apr: 4,
  may: 5,
  jun: 6,
  jul: 7,
  aug: 8,
  sep: 9,
  oct: 10,
  nov: 11,
  dec: 12
};
const dateRangeDelimiters = / (?:to|[-/]) | ?(?:--|[–—]) ?/;
const dateRangePattern = /^(\d{4}-\d{2}-\d{2})\/(\d{4}-\d{2}-\d{2})$/;

function getMonth(monthName) {
  return monthMap[monthName.toLowerCase().slice(0, 3)];
}

function parseEpoch(date) {
  const epoch = new Date(date);

  if (typeof date === 'number' && !isNaN(epoch.valueOf())) {
    return [epoch.getFullYear(), epoch.getMonth() + 1, epoch.getDate()];
  } else {
    return null;
  }
}

const parseIso8601 = function parseIso8601(date) {
  const pattern = /^(\d{4}|[-+]\d{6,})-(\d{2})(?:-(\d{2}))?/;

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null;
  }

  const _date$match = date.match(pattern),
        _date$match2 = _slicedToArray(_date$match, 4),
        year = _date$match2[1],
        month = _date$match2[2],
        day = _date$match2[3];

  if (!+month) {
    return [year];
  } else if (!+day) {
    return [year, month];
  } else {
    return [year, month, day];
  }
};

const parseRfc2822 = function parseRfc2822(date) {
  const pattern = /^(?:[a-z]{3},\s*)?(\d{1,2}) ([a-z]{3}) (\d{4,})/i;

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null;
  }

  let _date$match3 = date.match(pattern),
      _date$match4 = _slicedToArray(_date$match3, 4),
      day = _date$match4[1],
      month = _date$match4[2],
      year = _date$match4[3];

  month = getMonth(month);

  if (!month) {
    return null;
  }

  return [year, month, day];
};

function parseAmericanDay(date) {
  const pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{2}(?:\d{2})?)/;

  if (typeof date !== 'string' || !pattern.test(date)) {
    return null;
  }

  const _date$match5 = date.match(pattern),
        _date$match6 = _slicedToArray(_date$match5, 4),
        month = _date$match6[1],
        day = _date$match6[2],
        year = _date$match6[3];

  const check = new Date(year, month, day);

  if (check.getMonth() === parseInt(month)) {
    return [year, month, day];
  } else {
    return null;
  }
}

function parseDay(date) {
  const pattern = /^(\d{1,2})[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](-?\d+)/i;
  const reversePattern = /^(-?\d+)[ .\-/](\d{1,2}|[a-z]{3,10})[ .\-/](\d{1,2})/i;
  let year;
  let month;
  let day;

  if (typeof date !== 'string') {
    return null;
  } else if (pattern.test(date)) {
    var _date$match7 = date.match(pattern);

    var _date$match8 = _slicedToArray(_date$match7, 4);

    day = _date$match8[1];
    month = _date$match8[2];
    year = _date$match8[3];
  } else if (reversePattern.test(date)) {
    var _date$match9 = date.match(reversePattern);

    var _date$match10 = _slicedToArray(_date$match9, 4);

    year = _date$match10[1];
    month = _date$match10[2];
    day = _date$match10[3];
  } else {
    return null;
  }

  if (getMonth(month)) {
    month = getMonth(month);
  } else if (isNaN(month)) {
    return null;
  }

  return [year, month, day];
}

function parseMonth(date) {
  const pattern = /^([a-z]{3,10}|-?\d+)[^\w-]+([a-z]{3,10}|-?\d+)$/i;

  if (typeof date === 'string' && pattern.test(date)) {
    const values = date.match(pattern).slice(1, 3);
    let month;

    if (getMonth(values[1])) {
      month = getMonth(values.pop());
    } else if (getMonth(values[0])) {
      month = getMonth(values.shift());
    } else if (values.some(isNaN) || values.every(value => +value < 0)) {
      return null;
    } else if (+values[0] < 0) {
      month = values.pop();
    } else if (+values[0] > +values[1] && +values[1] > 0) {
      month = values.pop();
    } else {
      month = values.shift();
    }

    const year = values.pop();
    return [year, month];
  } else {
    return null;
  }
}

function parseYear(date) {
  if (typeof date !== 'string') {
    return null;
  }

  const adBc = date.match(/^(\d+) ?(a\.?d\.?|b\.?c\.?)$/i);

  if (adBc) {
    const _adBc$slice = adBc.slice(1),
          _adBc$slice2 = _slicedToArray(_adBc$slice, 2),
          date = _adBc$slice2[0],
          suffix = _adBc$slice2[1];

    return [date * (suffix.toLowerCase()[0] === 'a' ? 1 : -1)];
  } else if (/^-?\d+$/.test(date)) {
    return [date];
  } else {
    return null;
  }
}

function parseDateParts(value) {
  const dateParts = parseEpoch(value) || parseIso8601(value) || parseRfc2822(value) || parseAmericanDay(value) || parseDay(value) || parseMonth(value) || parseYear(value);
  return dateParts && dateParts.map(string => parseInt(string));
}

function splitDateRange(range) {
  if (dateRangePattern.test(range)) {
    return range.match(dateRangePattern).slice(1, 3);
  } else {
    return range.split(dateRangeDelimiters);
  }
}

function parseDate(rangeStart, rangeEnd) {
  const range = [];
  const rangeStartAsRange = typeof rangeStart === 'string' && splitDateRange(rangeStart);

  if (rangeEnd) {
    range.push(rangeStart, rangeEnd);
  } else if (rangeStartAsRange && rangeStartAsRange.length === 2) {
    range.push(...rangeStartAsRange);
  } else {
    range.push(rangeStart);
  }

  const dateParts = range.map(parseDateParts);

  if (dateParts.filter(Boolean).length === range.length) {
    return {
      'date-parts': dateParts
    };
  } else {
    return {
      raw: rangeEnd ? range.join('/') : rangeStart
    };
  }
}

var _default = parseDate;
exports.default = _default;