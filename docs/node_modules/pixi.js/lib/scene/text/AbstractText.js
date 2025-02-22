'use strict';

var ObservablePoint = require('../../maths/point/ObservablePoint.js');
var deprecation = require('../../utils/logging/deprecation.js');
var View = require('../view/View.js');

"use strict";
class AbstractText extends View.ViewContainer {
  constructor(options, styleClass) {
    const { text, resolution, style, anchor, width, height, roundPixels, ...rest } = options;
    super({
      ...rest
    });
    this.batched = true;
    this._resolution = null;
    this._autoResolution = true;
    this._didTextUpdate = true;
    this._styleClass = styleClass;
    this.text = text ?? "";
    this.style = style;
    this.resolution = resolution ?? null;
    this.allowChildren = false;
    this._anchor = new ObservablePoint.ObservablePoint(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    );
    if (anchor)
      this.anchor = anchor;
    this.roundPixels = roundPixels ?? false;
    if (width !== void 0)
      this.width = width;
    if (height !== void 0)
      this.height = height;
  }
  /**
   * The anchor sets the origin point of the text.
   * The default is `(0,0)`, this means the text's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { Text } from 'pixi.js';
   *
   * const text = new Text('hello world');
   * text.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    typeof value === "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
  }
  /** Set the copy for the text object. To split a line you can use '\n'. */
  set text(value) {
    value = value.toString();
    if (this._text === value)
      return;
    this._text = value;
    this.onViewUpdate();
  }
  get text() {
    return this._text;
  }
  /**
   * The resolution / device pixel ratio of the canvas.
   * @default 1
   */
  set resolution(value) {
    this._autoResolution = value === null;
    this._resolution = value;
    this.onViewUpdate();
  }
  get resolution() {
    return this._resolution;
  }
  get style() {
    return this._style;
  }
  /**
   * Set the style of the text.
   *
   * Set up an event listener to listen for changes on the style object and mark the text as dirty.
   *
   * If setting the `style` can also be partial {@link AnyTextStyleOptions}.
   * @type {
   * text.TextStyle |
   * Partial<text.TextStyle> |
   * text.TextStyleOptions |
   * text.HTMLTextStyle |
   * Partial<text.HTMLTextStyle> |
   * text.HTMLTextStyleOptions
   * }
   */
  set style(style) {
    style = style || {};
    this._style?.off("update", this.onViewUpdate, this);
    if (style instanceof this._styleClass) {
      this._style = style;
    } else {
      this._style = new this._styleClass(style);
    }
    this._style.on("update", this.onViewUpdate, this);
    this.onViewUpdate();
  }
  /**
   * The local bounds of the Text.
   * @type {rendering.Bounds}
   */
  get bounds() {
    if (this._boundsDirty) {
      this._updateBounds();
      this._boundsDirty = false;
    }
    return this._bounds;
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this.bounds.width;
  }
  set width(value) {
    this._setWidth(value, this.bounds.width);
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this.bounds.height;
  }
  set height(value) {
    this._setHeight(value, this.bounds.height);
  }
  /**
   * Retrieves the size of the Text as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Text.
   */
  getSize(out) {
    out || (out = {});
    out.width = Math.abs(this.scale.x) * this.bounds.width;
    out.height = Math.abs(this.scale.y) * this.bounds.height;
    return out;
  }
  /**
   * Sets the size of the Text to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(value, height) {
    if (typeof value === "object") {
      height = value.height ?? value.width;
      value = value.width;
    } else {
      height ?? (height = value);
    }
    value !== void 0 && this._setWidth(value, this.bounds.width);
    height !== void 0 && this._setHeight(height, this.bounds.height);
  }
  /**
   * Adds the bounds of this text to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    const _bounds = this.bounds;
    bounds.addFrame(
      _bounds.minX,
      _bounds.minY,
      _bounds.maxX,
      _bounds.maxY
    );
  }
  /**
   * Checks if the text contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const width = this.bounds.width;
    const height = this.bounds.height;
    const x1 = -width * this.anchor.x;
    let y1 = 0;
    if (point.x >= x1 && point.x <= x1 + width) {
      y1 = -height * this.anchor.y;
      if (point.y >= y1 && point.y <= y1 + height)
        return true;
    }
    return false;
  }
  onViewUpdate() {
    this._didViewChangeTick++;
    this._boundsDirty = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    this._didTextUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  _getKey() {
    return `${this.text}:${this._style.styleKey}:${this._resolution}`;
  }
  /**
   * Destroys this text renderable and optionally its style texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
   * @param {boolean} [options.style=false] - Should it destroy the style of the text
   */
  destroy(options = false) {
    super.destroy(options);
    this.owner = null;
    this._bounds = null;
    this._anchor = null;
    if (typeof options === "boolean" ? options : options?.style) {
      this._style.destroy(options);
    }
    this._style = null;
    this._text = null;
  }
}
function ensureOptions(args, name) {
  let options = args[0] ?? {};
  if (typeof options === "string" || args[1]) {
    deprecation.deprecation(deprecation.v8_0_0, `use new ${name}({ text: "hi!", style }) instead`);
    options = {
      text: options,
      style: args[1]
    };
  }
  return options;
}

exports.AbstractText = AbstractText;
exports.ensureOptions = ensureOptions;
//# sourceMappingURL=AbstractText.js.map
