'use strict';

var Texture = require('../../rendering/renderers/shared/texture/Texture.js');
var deprecation = require('../../utils/logging/deprecation.js');
var View = require('../view/View.js');
var NineSliceGeometry = require('./NineSliceGeometry.js');

"use strict";
const _NineSliceSprite = class _NineSliceSprite extends View.ViewContainer {
  /**
   * @param {scene.NineSliceSpriteOptions|Texture} options - Options to use
   * @param options.texture - The texture to use on the NineSliceSprite.
   * @param options.leftWidth - Width of the left vertical bar (A)
   * @param options.topHeight - Height of the top horizontal bar (C)
   * @param options.rightWidth - Width of the right vertical bar (B)
   * @param options.bottomHeight - Height of the bottom horizontal bar (D)
   * @param options.width - Width of the NineSliceSprite,
   * setting this will actually modify the vertices and not the UV's of this plane.
   * @param options.height - Height of the NineSliceSprite,
   * setting this will actually modify the vertices and not UV's of this plane.
   */
  constructor(options) {
    if (options instanceof Texture.Texture) {
      options = { texture: options };
    }
    const {
      width,
      height,
      leftWidth,
      rightWidth,
      topHeight,
      bottomHeight,
      texture,
      roundPixels,
      ...rest
    } = options;
    super({
      label: "NineSliceSprite",
      ...rest
    });
    this.renderPipeId = "nineSliceSprite";
    this.batched = true;
    this._didSpriteUpdate = true;
    this._leftWidth = leftWidth ?? texture?.defaultBorders?.left ?? NineSliceGeometry.NineSliceGeometry.defaultOptions.leftWidth;
    this._topHeight = topHeight ?? texture?.defaultBorders?.top ?? NineSliceGeometry.NineSliceGeometry.defaultOptions.topHeight;
    this._rightWidth = rightWidth ?? texture?.defaultBorders?.right ?? NineSliceGeometry.NineSliceGeometry.defaultOptions.rightWidth;
    this._bottomHeight = bottomHeight ?? texture?.defaultBorders?.bottom ?? NineSliceGeometry.NineSliceGeometry.defaultOptions.bottomHeight;
    this.bounds.maxX = this._width = width ?? texture.width ?? NineSliceGeometry.NineSliceGeometry.defaultOptions.width;
    this.bounds.maxY = this._height = height ?? texture.height ?? NineSliceGeometry.NineSliceGeometry.defaultOptions.height;
    this.allowChildren = false;
    this.texture = texture ?? _NineSliceSprite.defaultOptions.texture;
    this.roundPixels = roundPixels ?? false;
  }
  /** The local bounds of the view. */
  get bounds() {
    return this._bounds;
  }
  /** The width of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get width() {
    return this._width;
  }
  set width(value) {
    this.bounds.maxX = this._width = value;
    this.onViewUpdate();
  }
  /** The height of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
  get height() {
    return this._height;
  }
  set height(value) {
    this.bounds.maxY = this._height = value;
    this.onViewUpdate();
  }
  /**
   * Sets the size of the NiceSliceSprite to the specified width and height.
   * setting this will actually modify the vertices and UV's of this plane
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(value, height) {
    if (typeof value === "object") {
      height = value.height ?? value.width;
      value = value.width;
    }
    this.bounds.maxX = this._width = value;
    this.bounds.maxY = this._height = height ?? value;
    this.onViewUpdate();
  }
  /**
   * Retrieves the size of the NineSliceSprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the NineSliceSprite.
   */
  getSize(out) {
    out || (out = {});
    out.width = this._width;
    out.height = this._height;
    return out;
  }
  /** The width of the left column (a) of the NineSliceSprite. */
  get leftWidth() {
    return this._leftWidth;
  }
  set leftWidth(value) {
    this._leftWidth = value;
    this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get topHeight() {
    return this._topHeight;
  }
  set topHeight(value) {
    this._topHeight = value;
    this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get rightWidth() {
    return this._rightWidth;
  }
  set rightWidth(value) {
    this._rightWidth = value;
    this.onViewUpdate();
  }
  /** The width of the right column (b) of the NineSliceSprite. */
  get bottomHeight() {
    return this._bottomHeight;
  }
  set bottomHeight(value) {
    this._bottomHeight = value;
    this.onViewUpdate();
  }
  /** The texture that the NineSliceSprite is using. */
  get texture() {
    return this._texture;
  }
  set texture(value) {
    value || (value = Texture.Texture.EMPTY);
    const currentTexture = this._texture;
    if (currentTexture === value)
      return;
    if (currentTexture && currentTexture.dynamic)
      currentTexture.off("update", this.onViewUpdate, this);
    if (value.dynamic)
      value.on("update", this.onViewUpdate, this);
    this._texture = value;
    this.onViewUpdate();
  }
  /** The original width of the texture */
  get originalWidth() {
    return this._texture.width;
  }
  /** The original height of the texture */
  get originalHeight() {
    return this._texture.height;
  }
  onViewUpdate() {
    this._didViewChangeTick++;
    this._didSpriteUpdate = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    const _bounds = this.bounds;
    bounds.addFrame(_bounds.minX, _bounds.minY, _bounds.maxX, _bounds.maxY);
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options) {
    super.destroy(options);
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
  }
};
/** The default options, used to override the initial values of any options passed in the constructor. */
_NineSliceSprite.defaultOptions = {
  /** @default Texture.EMPTY */
  texture: Texture.Texture.EMPTY
};
let NineSliceSprite = _NineSliceSprite;
class NineSlicePlane extends NineSliceSprite {
  constructor(...args) {
    let options = args[0];
    if (options instanceof Texture.Texture) {
      deprecation.deprecation(deprecation.v8_0_0, "NineSlicePlane now uses the options object {texture, leftWidth, rightWidth, topHeight, bottomHeight}");
      options = {
        texture: options,
        leftWidth: args[1],
        topHeight: args[2],
        rightWidth: args[3],
        bottomHeight: args[4]
      };
    }
    deprecation.deprecation(deprecation.v8_0_0, "NineSlicePlane is deprecated. Use NineSliceSprite instead.");
    super(options);
  }
}

exports.NineSlicePlane = NineSlicePlane;
exports.NineSliceSprite = NineSliceSprite;
//# sourceMappingURL=NineSliceSprite.js.map
