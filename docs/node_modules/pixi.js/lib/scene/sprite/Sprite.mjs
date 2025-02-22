import { ObservablePoint } from '../../maths/point/ObservablePoint.mjs';
import { Texture } from '../../rendering/renderers/shared/texture/Texture.mjs';
import { updateQuadBounds } from '../../utils/data/updateQuadBounds.mjs';
import { ViewContainer } from '../view/View.mjs';

"use strict";
class Sprite extends ViewContainer {
  /**
   * @param options - The options for creating the sprite.
   */
  constructor(options = Texture.EMPTY) {
    if (options instanceof Texture) {
      options = { texture: options };
    }
    const { texture = Texture.EMPTY, anchor, roundPixels, width, height, ...rest } = options;
    super({
      label: "Sprite",
      ...rest
    });
    this.renderPipeId = "sprite";
    this.batched = true;
    this._didSpriteUpdate = false;
    this._sourceBounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
    this._sourceBoundsDirty = true;
    this._anchor = new ObservablePoint(
      {
        _onUpdate: () => {
          this.onViewUpdate();
        }
      }
    );
    if (anchor) {
      this.anchor = anchor;
    } else if (texture.defaultAnchor) {
      this.anchor = texture.defaultAnchor;
    }
    this.texture = texture;
    this.allowChildren = false;
    this.roundPixels = roundPixels ?? false;
    if (width !== void 0)
      this.width = width;
    if (height !== void 0)
      this.height = height;
  }
  /**
   * Helper function that creates a new sprite based on the source you provide.
   * The source can be - frame id, image, video, canvas element, video element, texture
   * @param source - Source to create texture from
   * @param [skipCache] - Whether to skip the cache or not
   * @returns The newly created sprite
   */
  static from(source, skipCache = false) {
    if (source instanceof Texture) {
      return new Sprite(source);
    }
    return new Sprite(Texture.from(source, skipCache));
  }
  set texture(value) {
    value || (value = Texture.EMPTY);
    const currentTexture = this._texture;
    if (currentTexture === value)
      return;
    if (currentTexture && currentTexture.dynamic)
      currentTexture.off("update", this.onViewUpdate, this);
    if (value.dynamic)
      value.on("update", this.onViewUpdate, this);
    this._texture = value;
    if (this._width) {
      this._setWidth(this._width, this._texture.orig.width);
    }
    if (this._height) {
      this._setHeight(this._height, this._texture.orig.height);
    }
    this.onViewUpdate();
  }
  /** The texture that the sprite is using. */
  get texture() {
    return this._texture;
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
  /**
   * The bounds of the sprite, taking the texture's trim into account.
   * @type {rendering.Bounds}
   */
  get sourceBounds() {
    if (this._sourceBoundsDirty) {
      this._updateSourceBounds();
      this._sourceBoundsDirty = false;
    }
    return this._sourceBounds;
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    const bounds = this.sourceBounds;
    if (point.x >= bounds.maxX && point.x <= bounds.minX) {
      if (point.y >= bounds.maxY && point.y <= bounds.minY) {
        return true;
      }
    }
    return false;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    const _bounds = this._texture.trim ? this.sourceBounds : this.bounds;
    bounds.addFrame(_bounds.minX, _bounds.minY, _bounds.maxX, _bounds.maxY);
  }
  onViewUpdate() {
    this._didViewChangeTick++;
    this._didSpriteUpdate = true;
    this._sourceBoundsDirty = this._boundsDirty = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  _updateBounds() {
    updateQuadBounds(this._bounds, this._anchor, this._texture, 0);
  }
  _updateSourceBounds() {
    const anchor = this._anchor;
    const texture = this._texture;
    const sourceBounds = this._sourceBounds;
    const { width, height } = texture.orig;
    sourceBounds.maxX = -anchor._x * width;
    sourceBounds.minX = sourceBounds.maxX + width;
    sourceBounds.maxY = -anchor._y * height;
    sourceBounds.minY = sourceBounds.maxY + height;
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
    const destroyTexture = typeof options === "boolean" ? options : options?.texture;
    if (destroyTexture) {
      const destroyTextureSource = typeof options === "boolean" ? options : options?.textureSource;
      this._texture.destroy(destroyTextureSource);
    }
    this._texture = null;
    this._bounds = null;
    this._sourceBounds = null;
    this._anchor = null;
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
   * import { Sprite } from 'pixi.js';
   *
   * const sprite = new Sprite({texture: Texture.WHITE});
   * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
   */
  get anchor() {
    return this._anchor;
  }
  set anchor(value) {
    typeof value === "number" ? this._anchor.set(value) : this._anchor.copyFrom(value);
  }
  /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
  get width() {
    return Math.abs(this.scale.x) * this._texture.orig.width;
  }
  set width(value) {
    this._setWidth(value, this._texture.orig.width);
    this._width = value;
  }
  /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
  get height() {
    return Math.abs(this.scale.y) * this._texture.orig.height;
  }
  set height(value) {
    this._setHeight(value, this._texture.orig.height);
    this._height = value;
  }
  /**
   * Retrieves the size of the Sprite as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the Sprite.
   */
  getSize(out) {
    out || (out = {});
    out.width = Math.abs(this.scale.x) * this._texture.orig.width;
    out.height = Math.abs(this.scale.y) * this._texture.orig.height;
    return out;
  }
  /**
   * Sets the size of the Sprite to the specified width and height.
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
    value !== void 0 && this._setWidth(value, this._texture.orig.width);
    height !== void 0 && this._setHeight(height, this._texture.orig.height);
  }
}

export { Sprite };
//# sourceMappingURL=Sprite.mjs.map
