'use strict';

var Extensions = require('../../../extensions/Extensions.js');
var updateQuadBounds = require('../../../utils/data/updateQuadBounds.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var BatchableSprite = require('../../sprite/BatchableSprite.js');

"use strict";
class CanvasTextPipe {
  constructor(renderer) {
    this._gpuText = /* @__PURE__ */ Object.create(null);
    this._destroyRenderableBound = this.destroyRenderable.bind(this);
    this._renderer = renderer;
    this._renderer.runners.resolutionChange.add(this);
  }
  resolutionChange() {
    for (const i in this._gpuText) {
      const gpuText = this._gpuText[i];
      if (!gpuText)
        continue;
      const text = gpuText.batchableSprite.renderable;
      if (text._autoResolution) {
        text._resolution = this._renderer.resolution;
        text.onViewUpdate();
      }
    }
  }
  validateRenderable(text) {
    const gpuText = this._getGpuText(text);
    const newKey = text._getKey();
    if (gpuText.currentKey !== newKey) {
      const { width, height } = this._renderer.canvasText.getTextureSize(
        text.text,
        text.resolution,
        text._style
      );
      if (
        // is only being used by this text:
        this._renderer.canvasText.getReferenceCount(gpuText.currentKey) === 1 && width === gpuText.texture._source.width && height === gpuText.texture._source.height
      ) {
        return false;
      }
      return true;
    }
    return false;
  }
  addRenderable(text, instructionSet) {
    const gpuText = this._getGpuText(text);
    const batchableSprite = gpuText.batchableSprite;
    if (text._didTextUpdate) {
      this._updateText(text);
    }
    this._renderer.renderPipes.batch.addToBatch(batchableSprite, instructionSet);
  }
  updateRenderable(text) {
    const gpuText = this._getGpuText(text);
    const batchableSprite = gpuText.batchableSprite;
    if (text._didTextUpdate) {
      this._updateText(text);
    }
    batchableSprite._batcher.updateElement(batchableSprite);
  }
  destroyRenderable(text) {
    text.off("destroyed", this._destroyRenderableBound);
    this._destroyRenderableById(text.uid);
  }
  _destroyRenderableById(textUid) {
    const gpuText = this._gpuText[textUid];
    this._renderer.canvasText.decreaseReferenceCount(gpuText.currentKey);
    PoolGroup.BigPool.return(gpuText.batchableSprite);
    this._gpuText[textUid] = null;
  }
  _updateText(text) {
    const newKey = text._getKey();
    const gpuText = this._getGpuText(text);
    const batchableSprite = gpuText.batchableSprite;
    if (gpuText.currentKey !== newKey) {
      this._updateGpuText(text);
    }
    text._didTextUpdate = false;
    const padding = text._style.padding;
    updateQuadBounds.updateQuadBounds(batchableSprite.bounds, text._anchor, batchableSprite.texture, padding);
  }
  _updateGpuText(text) {
    const gpuText = this._getGpuText(text);
    const batchableSprite = gpuText.batchableSprite;
    if (gpuText.texture) {
      this._renderer.canvasText.decreaseReferenceCount(gpuText.currentKey);
    }
    gpuText.texture = batchableSprite.texture = this._renderer.canvasText.getManagedTexture(text);
    gpuText.currentKey = text._getKey();
    batchableSprite.texture = gpuText.texture;
  }
  _getGpuText(text) {
    return this._gpuText[text.uid] || this.initGpuText(text);
  }
  initGpuText(text) {
    const gpuTextData = {
      texture: null,
      currentKey: "--",
      batchableSprite: PoolGroup.BigPool.get(BatchableSprite.BatchableSprite)
    };
    gpuTextData.batchableSprite.renderable = text;
    gpuTextData.batchableSprite.transform = text.groupTransform;
    gpuTextData.batchableSprite.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
    gpuTextData.batchableSprite.roundPixels = this._renderer._roundPixels | text._roundPixels;
    this._gpuText[text.uid] = gpuTextData;
    text._resolution = text._autoResolution ? this._renderer.resolution : text.resolution;
    this._updateText(text);
    text.on("destroyed", this._destroyRenderableBound);
    return gpuTextData;
  }
  destroy() {
    for (const i in this._gpuText) {
      this._destroyRenderableById(i);
    }
    this._gpuText = null;
    this._renderer = null;
  }
}
/** @ignore */
CanvasTextPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "text"
};

exports.CanvasTextPipe = CanvasTextPipe;
//# sourceMappingURL=CanvasTextPipe.js.map
