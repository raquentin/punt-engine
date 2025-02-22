import EventEmitter from 'eventemitter3';
import { Color } from '../../color/Color.mjs';
import { deprecation, v8_0_0 } from '../../utils/logging/deprecation.mjs';
import { FillGradient } from '../graphics/shared/fill/FillGradient.mjs';
import { FillPattern } from '../graphics/shared/fill/FillPattern.mjs';
import { GraphicsContext } from '../graphics/shared/GraphicsContext.mjs';
import { toFillStyle, toStrokeStyle } from '../graphics/shared/utils/convertFillInputToFillStyle.mjs';
import { generateTextStyleKey } from './utils/generateTextStyleKey.mjs';

"use strict";
const _TextStyle = class _TextStyle extends EventEmitter {
  constructor(style = {}) {
    super();
    convertV7Tov8Style(style);
    const fullStyle = { ..._TextStyle.defaultTextStyle, ...style };
    for (const key in fullStyle) {
      const thisKey = key;
      this[thisKey] = fullStyle[key];
    }
    this.update();
  }
  /**
   * Alignment for multiline text, does not affect single line text.
   * @member {'left'|'center'|'right'|'justify'}
   */
  get align() {
    return this._align;
  }
  set align(value) {
    this._align = value;
    this.update();
  }
  /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
  get breakWords() {
    return this._breakWords;
  }
  set breakWords(value) {
    this._breakWords = value;
    this.update();
  }
  /** Set a drop shadow for the text. */
  get dropShadow() {
    return this._dropShadow;
  }
  set dropShadow(value) {
    if (value !== null && typeof value === "object") {
      this._dropShadow = this._createProxy({ ..._TextStyle.defaultDropShadow, ...value });
    } else {
      this._dropShadow = value ? this._createProxy({ ..._TextStyle.defaultDropShadow }) : null;
    }
    this.update();
  }
  /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
  get fontFamily() {
    return this._fontFamily;
  }
  set fontFamily(value) {
    this._fontFamily = value;
    this.update();
  }
  /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
  get fontSize() {
    return this._fontSize;
  }
  set fontSize(value) {
    if (typeof value === "string") {
      this._fontSize = parseInt(value, 10);
    } else {
      this._fontSize = value;
    }
    this.update();
  }
  /**
   * The font style.
   * @member {'normal'|'italic'|'oblique'}
   */
  get fontStyle() {
    return this._fontStyle;
  }
  set fontStyle(value) {
    this._fontStyle = value;
    this.update();
  }
  /**
   * The font variant.
   * @member {'normal'|'small-caps'}
   */
  get fontVariant() {
    return this._fontVariant;
  }
  set fontVariant(value) {
    this._fontVariant = value;
    this.update();
  }
  /**
   * The font weight.
   * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  get fontWeight() {
    return this._fontWeight;
  }
  set fontWeight(value) {
    this._fontWeight = value;
    this.update();
  }
  /** The space between lines. */
  get leading() {
    return this._leading;
  }
  set leading(value) {
    this._leading = value;
    this.update();
  }
  /** The amount of spacing between letters, default is 0. */
  get letterSpacing() {
    return this._letterSpacing;
  }
  set letterSpacing(value) {
    this._letterSpacing = value;
    this.update();
  }
  /** The line height, a number that represents the vertical space that a letter uses. */
  get lineHeight() {
    return this._lineHeight;
  }
  set lineHeight(value) {
    this._lineHeight = value;
    this.update();
  }
  /**
   * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
   * by adding padding to all sides of the text.
   */
  get padding() {
    return this._padding;
  }
  set padding(value) {
    this._padding = value;
    this.update();
  }
  /** Trim transparent borders. This is an expensive operation so only use this if you have to! */
  get trim() {
    return this._trim;
  }
  set trim(value) {
    this._trim = value;
    this.update();
  }
  /**
   * The baseline of the text that is rendered.
   * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  get textBaseline() {
    return this._textBaseline;
  }
  set textBaseline(value) {
    this._textBaseline = value;
    this.update();
  }
  /**
   * How newlines and spaces should be handled.
   * Default is 'pre' (preserve, preserve).
   *
   *  value       | New lines     |   Spaces
   *  ---         | ---           |   ---
   * 'normal'     | Collapse      |   Collapse
   * 'pre'        | Preserve      |   Preserve
   * 'pre-line'   | Preserve      |   Collapse
   * @member {'normal'|'pre'|'pre-line'}
   */
  get whiteSpace() {
    return this._whiteSpace;
  }
  set whiteSpace(value) {
    this._whiteSpace = value;
    this.update();
  }
  /** Indicates if word wrap should be used. */
  get wordWrap() {
    return this._wordWrap;
  }
  set wordWrap(value) {
    this._wordWrap = value;
    this.update();
  }
  /** The width at which text will wrap, it needs wordWrap to be set to true. */
  get wordWrapWidth() {
    return this._wordWrapWidth;
  }
  set wordWrapWidth(value) {
    this._wordWrapWidth = value;
    this.update();
  }
  /** A fillstyle that will be used on the text e.g., 'red', '#00FF00'. */
  get fill() {
    return this._originalFill;
  }
  set fill(value) {
    if (value === this._originalFill)
      return;
    this._originalFill = value;
    if (this._isFillStyle(value)) {
      this._originalFill = this._createProxy({ ...GraphicsContext.defaultFillStyle, ...value }, () => {
        this._fill = toFillStyle(
          { ...this._originalFill },
          GraphicsContext.defaultFillStyle
        );
      });
    }
    this._fill = toFillStyle(
      value === 0 ? "black" : value,
      GraphicsContext.defaultFillStyle
    );
    this.update();
  }
  /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
  get stroke() {
    return this._originalStroke;
  }
  set stroke(value) {
    if (value === this._originalStroke)
      return;
    this._originalStroke = value;
    if (this._isFillStyle(value)) {
      this._originalStroke = this._createProxy({ ...GraphicsContext.defaultStrokeStyle, ...value }, () => {
        this._stroke = toStrokeStyle(
          { ...this._originalStroke },
          GraphicsContext.defaultStrokeStyle
        );
      });
    }
    this._stroke = toStrokeStyle(value, GraphicsContext.defaultStrokeStyle);
    this.update();
  }
  _generateKey() {
    this._styleKey = generateTextStyleKey(this);
    return this._styleKey;
  }
  update() {
    this._styleKey = null;
    this.emit("update", this);
  }
  /** Resets all properties to the default values */
  reset() {
    const defaultStyle = _TextStyle.defaultTextStyle;
    for (const key in defaultStyle) {
      this[key] = defaultStyle[key];
    }
  }
  get styleKey() {
    return this._styleKey || this._generateKey();
  }
  /**
   * Creates a new TextStyle object with the same values as this one.
   * @returns New cloned TextStyle object
   */
  clone() {
    return new _TextStyle({
      align: this.align,
      breakWords: this.breakWords,
      dropShadow: this._dropShadow ? { ...this._dropShadow } : null,
      fill: this._fill,
      fontFamily: this.fontFamily,
      fontSize: this.fontSize,
      fontStyle: this.fontStyle,
      fontVariant: this.fontVariant,
      fontWeight: this.fontWeight,
      leading: this.leading,
      letterSpacing: this.letterSpacing,
      lineHeight: this.lineHeight,
      padding: this.padding,
      stroke: this._stroke,
      textBaseline: this.textBaseline,
      whiteSpace: this.whiteSpace,
      wordWrap: this.wordWrap,
      wordWrapWidth: this.wordWrapWidth
    });
  }
  /**
   * Destroys this text style.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
   */
  destroy(options = false) {
    this.removeAllListeners();
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      if (this._fill?.texture) {
        this._fill.texture.destroy(destroyTextureSource);
      }
      if (this._originalFill?.texture) {
        this._originalFill.texture.destroy(destroyTextureSource);
      }
      if (this._stroke?.texture) {
        this._stroke.texture.destroy(destroyTextureSource);
      }
      if (this._originalStroke?.texture) {
        this._originalStroke.texture.destroy(destroyTextureSource);
      }
    }
    this._fill = null;
    this._stroke = null;
    this.dropShadow = null;
    this._originalStroke = null;
    this._originalFill = null;
  }
  _createProxy(value, cb) {
    return new Proxy(value, {
      set: (target, property, newValue) => {
        target[property] = newValue;
        cb?.(property, newValue);
        this.update();
        return true;
      }
    });
  }
  _isFillStyle(value) {
    return (value ?? null) !== null && !(Color.isColorLike(value) || value instanceof FillGradient || value instanceof FillPattern);
  }
};
/** The default drop shadow settings */
_TextStyle.defaultDropShadow = {
  /** Set alpha for the drop shadow */
  alpha: 1,
  /** Set a angle of the drop shadow */
  angle: Math.PI / 6,
  /** Set a shadow blur radius */
  blur: 0,
  /** A fill style to be used on the  e.g., 'red', '#00FF00' */
  color: "black",
  /** Set a distance of the drop shadow */
  distance: 5
};
/** The default text style settings */
_TextStyle.defaultTextStyle = {
  /**
   * See {@link TextStyle.align}
   * @type {'left'|'center'|'right'|'justify'}
   */
  align: "left",
  /** See {@link TextStyle.breakWords} */
  breakWords: false,
  /** See {@link TextStyle.dropShadow} */
  dropShadow: null,
  /**
   * See {@link TextStyle.fill}
   * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
   */
  fill: "black",
  /**
   * See {@link TextStyle.fontFamily}
   * @type {string|string[]}
   */
  fontFamily: "Arial",
  /**
   * See {@link TextStyle.fontSize}
   * @type {number|string}
   */
  fontSize: 26,
  /**
   * See {@link TextStyle.fontStyle}
   * @type {'normal'|'italic'|'oblique'}
   */
  fontStyle: "normal",
  /**
   * See {@link TextStyle.fontVariant}
   * @type {'normal'|'small-caps'}
   */
  fontVariant: "normal",
  /**
   * See {@link TextStyle.fontWeight}
   * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
   */
  fontWeight: "normal",
  /** See {@link TextStyle.leading} */
  leading: 0,
  /** See {@link TextStyle.letterSpacing} */
  letterSpacing: 0,
  /** See {@link TextStyle.lineHeight} */
  lineHeight: 0,
  /** See {@link TextStyle.padding} */
  padding: 0,
  /**
   * See {@link TextStyle.stroke}
   * @type {string|number}
   */
  stroke: null,
  /**
   * See {@link TextStyle.textBaseline}
   * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
   */
  textBaseline: "alphabetic",
  /** See {@link TextStyle.trim} */
  trim: false,
  /**
   * See {@link TextStyle.whiteSpace}
   * @type {'normal'|'pre'|'pre-line'}
   */
  whiteSpace: "pre",
  /** See {@link TextStyle.wordWrap} */
  wordWrap: false,
  /** See {@link TextStyle.wordWrapWidth} */
  wordWrapWidth: 100
};
let TextStyle = _TextStyle;
function convertV7Tov8Style(style) {
  const oldStyle = style;
  if (typeof oldStyle.dropShadow === "boolean" && oldStyle.dropShadow) {
    const defaults = TextStyle.defaultDropShadow;
    style.dropShadow = {
      alpha: oldStyle.dropShadowAlpha ?? defaults.alpha,
      angle: oldStyle.dropShadowAngle ?? defaults.angle,
      blur: oldStyle.dropShadowBlur ?? defaults.blur,
      color: oldStyle.dropShadowColor ?? defaults.color,
      distance: oldStyle.dropShadowDistance ?? defaults.distance
    };
  }
  if (oldStyle.strokeThickness !== void 0) {
    deprecation(v8_0_0, "strokeThickness is now a part of stroke");
    const color = oldStyle.stroke;
    let obj = {};
    if (Color.isColorLike(color)) {
      obj.color = color;
    } else if (color instanceof FillGradient || color instanceof FillPattern) {
      obj.fill = color;
    } else if (Object.hasOwnProperty.call(color, "color") || Object.hasOwnProperty.call(color, "fill")) {
      obj = color;
    } else {
      throw new Error("Invalid stroke value.");
    }
    style.stroke = {
      ...obj,
      width: oldStyle.strokeThickness
    };
  }
  if (Array.isArray(oldStyle.fillGradientStops)) {
    deprecation(v8_0_0, "gradient fill is now a fill pattern: `new FillGradient(...)`");
    let fontSize;
    if (style.fontSize == null) {
      style.fontSize = TextStyle.defaultTextStyle.fontSize;
    } else if (typeof style.fontSize === "string") {
      fontSize = parseInt(style.fontSize, 10);
    } else {
      fontSize = style.fontSize;
    }
    const gradientFill = new FillGradient(0, 0, 0, fontSize * 1.7);
    const fills = oldStyle.fillGradientStops.map((color) => Color.shared.setValue(color).toNumber());
    fills.forEach((number, index) => {
      const ratio = index / (fills.length - 1);
      gradientFill.addColorStop(ratio, number);
    });
    style.fill = {
      fill: gradientFill
    };
  }
}

export { TextStyle };
//# sourceMappingURL=TextStyle.mjs.map
