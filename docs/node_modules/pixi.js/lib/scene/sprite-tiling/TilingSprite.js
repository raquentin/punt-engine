'use strict';

var Cache = require('../../assets/cache/Cache.js');
var ObservablePoint = require('../../maths/point/ObservablePoint.js');
var Texture = require('../../rendering/renderers/shared/texture/Texture.js');
var deprecation = require('../../utils/logging/deprecation.js');
var Transform = require('../../utils/misc/Transform.js');
var View = require('../view/View.js');

"use strict";
const _TilingSprite = class _TilingSprite extends View.ViewContainer {
  constructor(...args) {
    let options = args[0] || {};
    if (options instanceof Texture.Texture) {
      options = { texture: options };
    }
    if (args.length > 1) {
      deprecation.deprecation(deprecation.v8_0_0, "use new TilingSprite({ texture, width:100, height:100 }) instead");
      options.width = args[1];
      options.height = args[2];
    }
    options = { ..._TilingSprite.defaultOptions, ...options };
    const {
      texture,
      anchor,
      tilePosition,
      tileScale,
      tileRotation,
      width,
      height,
      applyAnchorToTexture,
      roundPixels,
      ...rest
    } = options ?? {};
    super({
      label: "TilingSprite",
      ...rest
    });
    this.renderPipeId = "tilingSprite";
    this.batched = true;
    this.allowChildren = false;
    this._anchor = new ObservablePoint.ObservablePoint(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    );
    this._applyAnchorToTexture = applyAnchorToTexture;
    this.texture = texture;
    this._width = width ?? texture.width;
    this._height = height ?? texture.height;
    this._tileTransform = new Transform.Transform({
      observer: {
        _onUpdate: () => this.onViewUpdate()
      }
    });
    if (anchor)
      this.anchor = anchor;
    this.tilePosition = tilePosition;
    this.tileScale = tileScale;
    this.tileRotation = tileRotation;
    this.roundPixels = roundPixels ?? false;
  }
  /**
   * Creates a new tiling sprite.
   * @param source - The source to create the texture from.
   * @param options - The options for creating the tiling sprite.
   * @returns A new tiling sprite.
   */
  static from(source, options = {}) {
    if (typeof source === "string") {
      return new _TilingSprite({
        texture: Cache.Cache.get(source),
        ...options
      });
    }
    return new _TilingSprite({
      texture: source,
      ...options
    });
  }
  /**
   * Changes frame clamping in corresponding textureMatrix
   * Change to -0.5 to add a pixel to the edge, recommended for transparent trimmed textures in atlas
   * @default 0.5
   * @member {number}
   */
  get clampMargin() {
    return this._texture.textureMatrix.clampMargin;
  }
  set clampMargin(value) {
    this._texture.textureMatrix.clampMargin = value;
  }
  /**
   * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
   * and passed to the constructor.
   *
   * The default is `(0,0)`, this means the sprite's origin is the top left.
   *
   * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
   *
   * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
   *
   * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
   * @example
   * import { TilingSprite } from 'pixi.js';
   *
   * const sprite = new TilingSprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    typeof value === "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
  }
  /** The offset of the image that is being tiled. */
  get tilePosition() {
    return this._tileTransform.position;
  }
  set tilePosition(value) {
    this._tileTransform.position.copyFrom(value);
  }
  /** The scaling of the image that is being tiled. */
  get tileScale() {
    return this._tileTransform.scale;
  }
  set tileScale(value) {
    typeof value === "number" ? this._tileTransform.scale.set(value) : this._tileTransform.scale.copyFrom(value);
  }
  set tileRotation(value) {
    this._tileTransform.rotation = value;
  }
  /** The rotation of the image that is being tiled. */
  get tileRotation() {
    return this._tileTransform.rotation;
  }
  /** The transform of the image that is being tiled. */
  get tileTransform() {
    return this._tileTransform;
  }
  /**
   * The local bounds of the sprite.
   * @type {rendering.Bounds}
   */
  get bounds() {
    if (this._boundsDirty) {
      this._updateBounds();
      this._boundsDirty = false;
    }
    return this._bounds;
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
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
  }
  /** The width of the tiling area. */
  set width(value) {
    this._width = value;
    this.onViewUpdate();
  }
  get width() {
    return this._width;
  }
  set height(value) {
    this._height = value;
    this.onViewUpdate();
  }
  /** The height of the tiling area. */
  get height() {
    return this._height;
  }
  /**
   * Sets the size of the TilingSprite to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   */
  setSize(value, height) {
    if (typeof value === "object") {
      height = value.height ?? value.width;
      value = value.width;
    }
    this._width = value;
    this._height = height ?? value;
    this.onViewUpdate();
  }
  /**
   * Retrieves the size of the TilingSprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the TilingSprite.
   */
  getSize(out) {
    out || (out = {});
    out.width = this._width;
    out.height = this._height;
    return out;
  }
  _updateBounds() {
    const bounds = this._bounds;
    const anchor = this._anchor;
    const width = this._width;
    const height = this._height;
    bounds.maxX = -anchor._x * width;
    bounds.minX = bounds.maxX + width;
    bounds.maxY = -anchor._y * height;
    bounds.minY = bounds.maxY + height;
  }
  /**
   * Adds the bounds of this object to the bounds object.
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
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const width = this._width;
    const height = this._height;
    const x1 = -width * this._anchor._x;
    let y1 = 0;
    if (point.x >= x1 && point.x <= x1 + width) {
      y1 = -height * this._anchor._y;
      if (point.y >= y1 && point.y <= y1 + height)
        return true;
    }
    return false;
  }
  onViewUpdate() {
    this._boundsDirty = true;
    this._didTilingSpriteUpdate = true;
    this._didViewChangeTick++;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  /**
   * Destroys this sprite renderable and optionally its texture.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
   * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
   */
  destroy(options = false) {
    super.destroy(options);
    this._anchor = null;
    this._tileTransform = null;
    this._bounds = null;
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
  }
};
/** default options for the TilingSprite */
_TilingSprite.defaultOptions = {
  /** The texture to use for the sprite. */
  texture: Texture.Texture.EMPTY,
  /** The anchor point of the sprite */
  anchor: { x: 0, y: 0 },
  /** The offset of the image that is being tiled. */
  tilePosition: { x: 0, y: 0 },
  /** Scaling of the image that is being tiled. */
  tileScale: { x: 1, y: 1 },
  /** The rotation of the image that is being tiled. */
  tileRotation: 0,
  /** TODO */
  applyAnchorToTexture: false
};
let TilingSprite = _TilingSprite;

exports.TilingSprite = TilingSprite;
//# sourceMappingURL=TilingSprite.js.map
