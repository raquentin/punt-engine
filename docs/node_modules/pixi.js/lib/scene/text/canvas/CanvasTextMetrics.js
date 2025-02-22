'use strict';

var adapter = require('../../../environment/adapter.js');
var fontStringFromTextStyle = require('./utils/fontStringFromTextStyle.js');

"use strict";
const contextSettings = {
  // TextMetrics requires getImageData readback for measuring fonts.
  willReadFrequently: true
};
const _CanvasTextMetrics = class _CanvasTextMetrics {
  /**
   * Checking that we can use modern canvas 2D API.
   *
   * Note: This is an unstable API, Chrome < 94 use `textLetterSpacing`, later versions use `letterSpacing`.
   * @see TextMetrics.experimentalLetterSpacing
   * @see https://developer.mozilla.org/en-US/docs/Web/API/ICanvasRenderingContext2D/letterSpacing
   * @see https://developer.chrome.com/origintrials/#/view_trial/3585991203293757441
   */
  static get experimentalLetterSpacingSupported() {
    let result = _CanvasTextMetrics._experimentalLetterSpacingSupported;
    if (result !== void 0) {
      const proto = adapter.DOMAdapter.get().getCanvasRenderingContext2D().prototype;
      result = _CanvasTextMetrics._experimentalLetterSpacingSupported = "letterSpacing" in proto || "textLetterSpacing" in proto;
    }
    return result;
  }
  /**
   * @param text - the text that was measured
   * @param style - the style that was measured
   * @param width - the measured width of the text
   * @param height - the measured height of the text
   * @param lines - an array of the lines of text broken by new lines and wrapping if specified in style
   * @param lineWidths - an array of the line widths for each line matched to `lines`
   * @param lineHeight - the measured line height for this style
   * @param maxLineWidth - the maximum line width for all measured lines
   * @param {FontMetrics} fontProperties - the font properties object from TextMetrics.measureFont
   */
  constructor(text, style, width, height, lines, lineWidths, lineHeight, maxLineWidth, fontProperties) {
    this.text = text;
    this.style = style;
    this.width = width;
    this.height = height;
    this.lines = lines;
    this.lineWidths = lineWidths;
    this.lineHeight = lineHeight;
    this.maxLineWidth = maxLineWidth;
    this.fontProperties = fontProperties;
  }
  /**
   * Measures the supplied string of text and returns a Rectangle.
   * @param text - The text to measure.
   * @param style - The text style to use for measuring
   * @param canvas - optional specification of the canvas to use for measuring.
   * @param wordWrap
   * @returns Measured width and height of the text.
   */
  static measureText(text = " ", style, canvas = _CanvasTextMetrics._canvas, wordWrap = style.wordWrap) {
    const textKey = `${text}:${style.styleKey}`;
    if (_CanvasTextMetrics._measurementCache[textKey])
      return _CanvasTextMetrics._measurementCache[textKey];
    const font = fontStringFromTextStyle.fontStringFromTextStyle(style);
    const fontProperties = _CanvasTextMetrics.measureFont(font);
    if (fontProperties.fontSize === 0) {
      fontProperties.fontSize = style.fontSize;
      fontProperties.ascent = style.fontSize;
    }
    const context = _CanvasTextMetrics.__context;
    context.font = font;
    const outputText = wordWrap ? _CanvasTextMetrics._wordWrap(text, style, canvas) : text;
    const lines = outputText.split(/(?:\r\n|\r|\n)/);
    const lineWidths = new Array(lines.length);
    let maxLineWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const lineWidth = _CanvasTextMetrics._measureText(lines[i], style.letterSpacing, context);
      lineWidths[i] = lineWidth;
      maxLineWidth = Math.max(maxLineWidth, lineWidth);
    }
    const strokeWidth = style._stroke?.width || 0;
    let width = maxLineWidth + strokeWidth;
    if (style.dropShadow) {
      width += style.dropShadow.distance;
    }
    const lineHeight = style.lineHeight || fontProperties.fontSize;
    let height = Math.max(lineHeight, fontProperties.fontSize + strokeWidth) + (lines.length - 1) * (lineHeight + style.leading);
    if (style.dropShadow) {
      height += style.dropShadow.distance;
    }
    const measurements = new _CanvasTextMetrics(
      text,
      style,
      width,
      height,
      lines,
      lineWidths,
      lineHeight + style.leading,
      maxLineWidth,
      fontProperties
    );
    return measurements;
  }
  static _measureText(text, letterSpacing, context) {
    let useExperimentalLetterSpacing = false;
    if (_CanvasTextMetrics.experimentalLetterSpacingSupported) {
      if (_CanvasTextMetrics.experimentalLetterSpacing) {
        context.letterSpacing = `${letterSpacing}px`;
        context.textLetterSpacing = `${letterSpacing}px`;
        useExperimentalLetterSpacing = true;
      } else {
        context.letterSpacing = "0px";
        context.textLetterSpacing = "0px";
      }
    }
    let width = context.measureText(text).width;
    if (width > 0) {
      if (useExperimentalLetterSpacing) {
        width -= letterSpacing;
      } else {
        width += (_CanvasTextMetrics.graphemeSegmenter(text).length - 1) * letterSpacing;
      }
    }
    return width;
  }
  /**
   * Applies newlines to a string to have it optimally fit into the horizontal
   * bounds set by the Text object's wordWrapWidth property.
   * @param text - String to apply word wrapping to
   * @param style - the style to use when wrapping
   * @param canvas - optional specification of the canvas to use for measuring.
   * @returns New string with new lines applied where required
   */
  static _wordWrap(text, style, canvas = _CanvasTextMetrics._canvas) {
    const context = canvas.getContext("2d", contextSettings);
    let width = 0;
    let line = "";
    let lines = "";
    const cache = /* @__PURE__ */ Object.create(null);
    const { letterSpacing, whiteSpace } = style;
    const collapseSpaces = _CanvasTextMetrics._collapseSpaces(whiteSpace);
    const collapseNewlines = _CanvasTextMetrics._collapseNewlines(whiteSpace);
    let canPrependSpaces = !collapseSpaces;
    const wordWrapWidth = style.wordWrapWidth + letterSpacing;
    const tokens = _CanvasTextMetrics._tokenize(text);
    for (let i = 0; i < tokens.length; i++) {
      let token = tokens[i];
      if (_CanvasTextMetrics._isNewline(token)) {
        if (!collapseNewlines) {
          lines += _CanvasTextMetrics._addLine(line);
          canPrependSpaces = !collapseSpaces;
          line = "";
          width = 0;
          continue;
        }
        token = " ";
      }
      if (collapseSpaces) {
        const currIsBreakingSpace = _CanvasTextMetrics.isBreakingSpace(token);
        const lastIsBreakingSpace = _CanvasTextMetrics.isBreakingSpace(line[line.length - 1]);
        if (currIsBreakingSpace && lastIsBreakingSpace) {
          continue;
        }
      }
      const tokenWidth = _CanvasTextMetrics._getFromCache(token, letterSpacing, cache, context);
      if (tokenWidth > wordWrapWidth) {
        if (line !== "") {
          lines += _CanvasTextMetrics._addLine(line);
          line = "";
          width = 0;
        }
        if (_CanvasTextMetrics.canBreakWords(token, style.breakWords)) {
          const characters = _CanvasTextMetrics.wordWrapSplit(token);
          for (let j = 0; j < characters.length; j++) {
            let char = characters[j];
            let lastChar = char;
            let k = 1;
            while (characters[j + k]) {
              const nextChar = characters[j + k];
              if (!_CanvasTextMetrics.canBreakChars(lastChar, nextChar, token, j, style.breakWords)) {
                char += nextChar;
              } else {
                break;
              }
              lastChar = nextChar;
              k++;
            }
            j += k - 1;
            const characterWidth = _CanvasTextMetrics._getFromCache(char, letterSpacing, cache, context);
            if (characterWidth + width > wordWrapWidth) {
              lines += _CanvasTextMetrics._addLine(line);
              canPrependSpaces = false;
              line = "";
              width = 0;
            }
            line += char;
            width += characterWidth;
          }
        } else {
          if (line.length > 0) {
            lines += _CanvasTextMetrics._addLine(line);
            line = "";
            width = 0;
          }
          const isLastToken = i === tokens.length - 1;
          lines += _CanvasTextMetrics._addLine(token, !isLastToken);
          canPrependSpaces = false;
          line = "";
          width = 0;
        }
      } else {
        if (tokenWidth + width > wordWrapWidth) {
          canPrependSpaces = false;
          lines += _CanvasTextMetrics._addLine(line);
          line = "";
          width = 0;
        }
        if (line.length > 0 || !_CanvasTextMetrics.isBreakingSpace(token) || canPrependSpaces) {
          line += token;
          width += tokenWidth;
        }
      }
    }
    lines += _CanvasTextMetrics._addLine(line, false);
    return lines;
  }
  /**
   * Convenience function for logging each line added during the wordWrap method.
   * @param line    - The line of text to add
   * @param newLine - Add new line character to end
   * @returns A formatted line
   */
  static _addLine(line, newLine = true) {
    line = _CanvasTextMetrics._trimRight(line);
    line = newLine ? `${line}
` : line;
    return line;
  }
  /**
   * Gets & sets the widths of calculated characters in a cache object
   * @param key            - The key
   * @param letterSpacing  - The letter spacing
   * @param cache          - The cache
   * @param context        - The canvas context
   * @returns The from cache.
   */
  static _getFromCache(key, letterSpacing, cache, context) {
    let width = cache[key];
    if (typeof width !== "number") {
      width = _CanvasTextMetrics._measureText(key, letterSpacing, context) + letterSpacing;
      cache[key] = width;
    }
    return width;
  }
  /**
   * Determines whether we should collapse breaking spaces.
   * @param whiteSpace - The TextStyle property whiteSpace
   * @returns Should collapse
   */
  static _collapseSpaces(whiteSpace) {
    return whiteSpace === "normal" || whiteSpace === "pre-line";
  }
  /**
   * Determines whether we should collapse newLine chars.
   * @param whiteSpace - The white space
   * @returns should collapse
   */
  static _collapseNewlines(whiteSpace) {
    return whiteSpace === "normal";
  }
  /**
   * Trims breaking whitespaces from string.
   * @param text - The text
   * @returns Trimmed string
   */
  static _trimRight(text) {
    if (typeof text !== "string") {
      return "";
    }
    for (let i = text.length - 1; i >= 0; i--) {
      const char = text[i];
      if (!_CanvasTextMetrics.isBreakingSpace(char)) {
        break;
      }
      text = text.slice(0, -1);
    }
    return text;
  }
  /**
   * Determines if char is a newline.
   * @param char - The character
   * @returns True if newline, False otherwise.
   */
  static _isNewline(char) {
    if (typeof char !== "string") {
      return false;
    }
    return _CanvasTextMetrics._newlines.includes(char.charCodeAt(0));
  }
  /**
   * Determines if char is a breaking whitespace.
   *
   * It allows one to determine whether char should be a breaking whitespace
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param char - The character
   * @param [_nextChar] - The next character
   * @returns True if whitespace, False otherwise.
   */
  static isBreakingSpace(char, _nextChar) {
    if (typeof char !== "string") {
      return false;
    }
    return _CanvasTextMetrics._breakingSpaces.includes(char.charCodeAt(0));
  }
  /**
   * Splits a string into words, breaking-spaces and newLine characters
   * @param text - The text
   * @returns A tokenized array
   */
  static _tokenize(text) {
    const tokens = [];
    let token = "";
    if (typeof text !== "string") {
      return tokens;
    }
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      const nextChar = text[i + 1];
      if (_CanvasTextMetrics.isBreakingSpace(char, nextChar) || _CanvasTextMetrics._isNewline(char)) {
        if (token !== "") {
          tokens.push(token);
          token = "";
        }
        tokens.push(char);
        continue;
      }
      token += char;
    }
    if (token !== "") {
      tokens.push(token);
    }
    return tokens;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to customise which words should break
   * Examples are if the token is CJK or numbers.
   * It must return a boolean.
   * @param _token - The token
   * @param breakWords - The style attr break words
   * @returns Whether to break word or not
   */
  static canBreakWords(_token, breakWords) {
    return breakWords;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It allows one to determine whether a pair of characters
   * should be broken by newlines
   * For example certain characters in CJK langs or numbers.
   * It must return a boolean.
   * @param _char - The character
   * @param _nextChar - The next character
   * @param _token - The token/word the characters are from
   * @param _index - The index in the token of the char
   * @param _breakWords - The style attr break words
   * @returns whether to break word or not
   */
  static canBreakChars(_char, _nextChar, _token, _index, _breakWords) {
    return true;
  }
  /**
   * Overridable helper method used internally by TextMetrics, exposed to allow customizing the class's behavior.
   *
   * It is called when a token (usually a word) has to be split into separate pieces
   * in order to determine the point to break a word.
   * It must return an array of characters.
   * @param token - The token to split
   * @returns The characters of the token
   * @see CanvasTextMetrics.graphemeSegmenter
   */
  static wordWrapSplit(token) {
    return _CanvasTextMetrics.graphemeSegmenter(token);
  }
  /**
   * Calculates the ascent, descent and fontSize of a given font-style
   * @param font - String representing the style of the font
   * @returns Font properties object
   */
  static measureFont(font) {
    if (_CanvasTextMetrics._fonts[font]) {
      return _CanvasTextMetrics._fonts[font];
    }
    const context = _CanvasTextMetrics._context;
    context.font = font;
    const metrics = context.measureText(_CanvasTextMetrics.METRICS_STRING + _CanvasTextMetrics.BASELINE_SYMBOL);
    const properties = {
      ascent: metrics.actualBoundingBoxAscent,
      descent: metrics.actualBoundingBoxDescent,
      fontSize: metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent
    };
    _CanvasTextMetrics._fonts[font] = properties;
    return properties;
  }
  /**
   * Clear font metrics in metrics cache.
   * @param {string} [font] - font name. If font name not set then clear cache for all fonts.
   */
  static clearMetrics(font = "") {
    if (font) {
      delete _CanvasTextMetrics._fonts[font];
    } else {
      _CanvasTextMetrics._fonts = {};
    }
  }
  /**
   * Cached canvas element for measuring text
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _canvas() {
    if (!_CanvasTextMetrics.__canvas) {
      let canvas;
      try {
        const c = new OffscreenCanvas(0, 0);
        const context = c.getContext("2d", contextSettings);
        if (context?.measureText) {
          _CanvasTextMetrics.__canvas = c;
          return c;
        }
        canvas = adapter.DOMAdapter.get().createCanvas();
      } catch (ex) {
        canvas = adapter.DOMAdapter.get().createCanvas();
      }
      canvas.width = canvas.height = 10;
      _CanvasTextMetrics.__canvas = canvas;
    }
    return _CanvasTextMetrics.__canvas;
  }
  /**
   * TODO: this should be private, but isn't because of backward compat, will fix later.
   * @ignore
   */
  static get _context() {
    if (!_CanvasTextMetrics.__context) {
      _CanvasTextMetrics.__context = _CanvasTextMetrics._canvas.getContext("2d", contextSettings);
    }
    return _CanvasTextMetrics.__context;
  }
};
/**
 * String used for calculate font metrics.
 * These characters are all tall to help calculate the height required for text.
 */
_CanvasTextMetrics.METRICS_STRING = "|\xC9q\xC5";
/** Baseline symbol for calculate font metrics. */
_CanvasTextMetrics.BASELINE_SYMBOL = "M";
/** Baseline multiplier for calculate font metrics. */
_CanvasTextMetrics.BASELINE_MULTIPLIER = 1.4;
/** Height multiplier for setting height of canvas to calculate font metrics. */
_CanvasTextMetrics.HEIGHT_MULTIPLIER = 2;
/**
 * A Unicode "character", or "grapheme cluster", can be composed of multiple Unicode code points,
 * such as letters with diacritical marks (e.g. `'\u0065\u0301'`, letter e with acute)
 * or emojis with modifiers (e.g. `'\uD83E\uDDD1\u200D\uD83D\uDCBB'`, technologist).
 * The new `Intl.Segmenter` API in ES2022 can split the string into grapheme clusters correctly. If it is not available,
 * PixiJS will fallback to use the iterator of String, which can only spilt the string into code points.
 * If you want to get full functionality in environments that don't support `Intl.Segmenter` (such as Firefox),
 * you can use other libraries such as [grapheme-splitter]{@link https://www.npmjs.com/package/grapheme-splitter}
 * or [graphemer]{@link https://www.npmjs.com/package/graphemer} to create a polyfill. Since these libraries can be
 * relatively large in size to handle various Unicode grapheme clusters properly, PixiJS won't use them directly.
 */
_CanvasTextMetrics.graphemeSegmenter = (() => {
  if (typeof Intl?.Segmenter === "function") {
    const segmenter = new Intl.Segmenter();
    return (s) => [...segmenter.segment(s)].map((x) => x.segment);
  }
  return (s) => [...s];
})();
/**
 * New rendering behavior for letter-spacing which uses Chrome's new native API. This will
 * lead to more accurate letter-spacing results because it does not try to manually draw
 * each character. However, this Chrome API is experimental and may not serve all cases yet.
 * @see TextMetrics.experimentalLetterSpacingSupported
 */
_CanvasTextMetrics.experimentalLetterSpacing = false;
/** Cache of {@see TextMetrics.FontMetrics} objects. */
_CanvasTextMetrics._fonts = {};
/** Cache of new line chars. */
_CanvasTextMetrics._newlines = [
  10,
  // line feed
  13
  // carriage return
];
/** Cache of breaking spaces. */
_CanvasTextMetrics._breakingSpaces = [
  9,
  // character tabulation
  32,
  // space
  8192,
  // en quad
  8193,
  // em quad
  8194,
  // en space
  8195,
  // em space
  8196,
  // three-per-em space
  8197,
  // four-per-em space
  8198,
  // six-per-em space
  8200,
  // punctuation space
  8201,
  // thin space
  8202,
  // hair space
  8287,
  // medium mathematical space
  12288
  // ideographic space
];
_CanvasTextMetrics._measurementCache = {};
let CanvasTextMetrics = _CanvasTextMetrics;

exports.CanvasTextMetrics = CanvasTextMetrics;
//# sourceMappingURL=CanvasTextMetrics.js.map
