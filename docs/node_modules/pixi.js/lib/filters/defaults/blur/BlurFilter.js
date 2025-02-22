'use strict';

var TexturePool = require('../../../rendering/renderers/shared/texture/TexturePool.js');
var types = require('../../../rendering/renderers/types.js');
var deprecation = require('../../../utils/logging/deprecation.js');
var Filter = require('../../Filter.js');
var BlurFilterPass = require('./BlurFilterPass.js');

"use strict";
class BlurFilter extends Filter.Filter {
  constructor(...args) {
    let options = args[0] ?? {};
    if (typeof options === "number") {
      deprecation.deprecation(deprecation.v8_0_0, "BlurFilter constructor params are now options object. See params: { strength, quality, resolution, kernelSize }");
      options = { strength: options };
      if (args[1] !== void 0)
        options.quality = args[1];
      if (args[2] !== void 0)
        options.resolution = args[2] || "inherit";
      if (args[3] !== void 0)
        options.kernelSize = args[3];
    }
    options = { ...BlurFilterPass.BlurFilterPass.defaultOptions, ...options };
    const { strength, strengthX, strengthY, quality, ...rest } = options;
    super({
      ...rest,
      compatibleRenderers: types.RendererType.BOTH,
      resources: {}
    });
    this._repeatEdgePixels = false;
    this.blurXFilter = new BlurFilterPass.BlurFilterPass({ horizontal: true, ...options });
    this.blurYFilter = new BlurFilterPass.BlurFilterPass({ horizontal: false, ...options });
    this.quality = quality;
    this.strengthX = strengthX ?? strength;
    this.strengthY = strengthY ?? strength;
    this.repeatEdgePixels = false;
  }
  /**
   * Applies the filter.
   * @param filterManager - The manager.
   * @param input - The input target.
   * @param output - The output target.
   * @param clearMode - How to clear
   */
  apply(filterManager, input, output, clearMode) {
    const xStrength = Math.abs(this.blurXFilter.strength);
    const yStrength = Math.abs(this.blurYFilter.strength);
    if (xStrength && yStrength) {
      const tempTexture = TexturePool.TexturePool.getSameSizeTexture(input);
      this.blurXFilter.blendMode = "normal";
      this.blurXFilter.apply(filterManager, input, tempTexture, true);
      this.blurYFilter.blendMode = this.blendMode;
      this.blurYFilter.apply(filterManager, tempTexture, output, clearMode);
      TexturePool.TexturePool.returnTexture(tempTexture);
    } else if (yStrength) {
      this.blurYFilter.blendMode = this.blendMode;
      this.blurYFilter.apply(filterManager, input, output, clearMode);
    } else {
      this.blurXFilter.blendMode = this.blendMode;
      this.blurXFilter.apply(filterManager, input, output, clearMode);
    }
  }
  updatePadding() {
    if (this._repeatEdgePixels) {
      this.padding = 0;
    } else {
      this.padding = Math.max(Math.abs(this.blurXFilter.blur), Math.abs(this.blurYFilter.blur)) * 2;
    }
  }
  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   * @default 8
   */
  get strength() {
    if (this.strengthX !== this.strengthY) {
      throw new Error("BlurFilter's strengthX and strengthY are different");
    }
    return this.strengthX;
  }
  set strength(value) {
    this.blurXFilter.blur = this.blurYFilter.blur = value;
    this.updatePadding();
  }
  /**
   * Sets the number of passes for blur. More passes means higher quality bluring.
   * @default 1
   */
  get quality() {
    return this.blurXFilter.quality;
  }
  set quality(value) {
    this.blurXFilter.quality = this.blurYFilter.quality = value;
  }
  /**
   * Sets the strength of horizontal blur
   * @default 8
   */
  get strengthX() {
    return this.blurXFilter.blur;
  }
  set strengthX(value) {
    this.blurXFilter.blur = value;
    this.updatePadding();
  }
  /**
   * Sets the strength of the vertical blur
   * @default 8
   */
  get strengthY() {
    return this.blurYFilter.blur;
  }
  set strengthY(value) {
    this.blurYFilter.blur = value;
    this.updatePadding();
  }
  /**
   * Sets the strength of both the blurX and blurY properties simultaneously
   * @default 2
   * @deprecated since 8.3.0
   * @see BlurFilter.strength
   */
  get blur() {
    deprecation.deprecation("8.3.0", "BlurFilter.blur is deprecated, please use BlurFilter.strength instead.");
    return this.strength;
  }
  set blur(value) {
    deprecation.deprecation("8.3.0", "BlurFilter.blur is deprecated, please use BlurFilter.strength instead.");
    this.strength = value;
  }
  /**
   * Sets the strength of the blurX property
   * @default 2
   * @deprecated since 8.3.0
   * @see BlurFilter.strengthX
   */
  get blurX() {
    deprecation.deprecation("8.3.0", "BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead.");
    return this.strengthX;
  }
  set blurX(value) {
    deprecation.deprecation("8.3.0", "BlurFilter.blurX is deprecated, please use BlurFilter.strengthX instead.");
    this.strengthX = value;
  }
  /**
   * Sets the strength of the blurY property
   * @default 2
   * @deprecated since 8.3.0
   * @see BlurFilter.strengthY
   */
  get blurY() {
    deprecation.deprecation("8.3.0", "BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead.");
    return this.strengthY;
  }
  set blurY(value) {
    deprecation.deprecation("8.3.0", "BlurFilter.blurY is deprecated, please use BlurFilter.strengthY instead.");
    this.strengthY = value;
  }
  /**
   * If set to true the edge of the target will be clamped
   * @default false
   */
  get repeatEdgePixels() {
    return this._repeatEdgePixels;
  }
  set repeatEdgePixels(value) {
    this._repeatEdgePixels = value;
    this.updatePadding();
  }
}
/** Default blur filter options */
BlurFilter.defaultOptions = {
  /** The strength of the blur filter. */
  strength: 8,
  /** The quality of the blur filter. */
  quality: 4,
  /** The kernelSize of the blur filter.Options: 5, 7, 9, 11, 13, 15. */
  kernelSize: 5
};

exports.BlurFilter = BlurFilter;
//# sourceMappingURL=BlurFilter.js.map
