import { Matrix } from '../../../../maths/matrix/Matrix.mjs';
import { uid } from '../../../../utils/data/uid.mjs';

"use strict";
const repetitionMap = {
  repeat: {
    addressModeU: "repeat",
    addressModeV: "repeat"
  },
  "repeat-x": {
    addressModeU: "repeat",
    addressModeV: "clamp-to-edge"
  },
  "repeat-y": {
    addressModeU: "clamp-to-edge",
    addressModeV: "repeat"
  },
  "no-repeat": {
    addressModeU: "clamp-to-edge",
    addressModeV: "clamp-to-edge"
  }
};
class FillPattern {
  constructor(texture, repetition) {
    /** unique id for this fill pattern */
    this.uid = uid("fillPattern");
    this.transform = new Matrix();
    this._styleKey = null;
    this.texture = texture;
    this.transform.scale(
      1 / texture.frame.width,
      1 / texture.frame.height
    );
    if (repetition) {
      texture.source.style.addressModeU = repetitionMap[repetition].addressModeU;
      texture.source.style.addressModeV = repetitionMap[repetition].addressModeV;
    }
  }
  setTransform(transform) {
    const texture = this.texture;
    this.transform.copyFrom(transform);
    this.transform.invert();
    this.transform.scale(
      1 / texture.frame.width,
      1 / texture.frame.height
    );
    this._styleKey = null;
  }
  get styleKey() {
    if (this._styleKey)
      return this._styleKey;
    this._styleKey = `fill-pattern-${this.uid}-${this.texture.uid}-${this.transform.toArray().join("-")}`;
    return this._styleKey;
  }
}

export { FillPattern };
//# sourceMappingURL=FillPattern.mjs.map
