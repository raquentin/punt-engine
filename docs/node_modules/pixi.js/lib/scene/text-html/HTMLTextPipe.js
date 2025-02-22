'use strict';

var Extensions = require('../../extensions/Extensions.js');
var Texture = require('../../rendering/renderers/shared/texture/Texture.js');
var updateQuadBounds = require('../../utils/data/updateQuadBounds.js');
var PoolGroup = require('../../utils/pool/PoolGroup.js');
var BatchableSprite = require('../sprite/BatchableSprite.js');

"use strict";
class HTMLTextPipe {
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
  validateRenderable(htmlText) {
    const gpuText = this._getGpuText(htmlText);
    const newKey = htmlText._getKey();
    if (gpuText.textureNeedsUploading) {
      gpuText.textureNeedsUploading = false;
      return true;
    }
    if (gpuText.currentKey !== newKey) {
      return true;
    }
    return false;
  }
  addRenderable(htmlText, instructionSet) {
    const gpuText = this._getGpuText(htmlText);
    const batchableSprite = gpuText.batchableSprite;
    if (htmlText._didTextUpdate) {
      this._updateText(htmlText);
    }
    this._renderer.renderPipes.batch.addToBatch(batchableSprite, instructionSet);
  }
  updateRenderable(htmlText) {
    const gpuText = this._getGpuText(htmlText);
    const batchableSprite = gpuText.batchableSprite;
    if (htmlText._didTextUpdate) {
      this._updateText(htmlText);
    }
    batchableSprite._batcher.updateElement(batchableSprite);
  }
  destroyRenderable(htmlText) {
    htmlText.off("destroyed", this._destroyRenderableBound);
    this._destroyRenderableById(htmlText.uid);
  }
  _destroyRenderableById(htmlTextUid) {
    const gpuText = this._gpuText[htmlTextUid];
    this._renderer.htmlText.decreaseReferenceCount(gpuText.currentKey);
    PoolGroup.BigPool.return(gpuText.batchableSprite);
    this._gpuText[htmlTextUid] = null;
  }
  _updateText(htmlText) {
    const newKey = htmlText._getKey();
    const gpuText = this._getGpuText(htmlText);
    const batchableSprite = gpuText.batchableSprite;
    if (gpuText.currentKey !== newKey) {
      this._updateGpuText(htmlText).catch((e) => {
        console.error(e);
      });
    }
    htmlText._didTextUpdate = false;
    const padding = htmlText._style.padding;
    updateQuadBounds.updateQuadBounds(batchableSprite.bounds, htmlText._anchor, batchableSprite.texture, padding);
  }
  async _updateGpuText(htmlText) {
    htmlText._didTextUpdate = false;
    const gpuText = this._getGpuText(htmlText);
    if (gpuText.generatingTexture)
      return;
    const newKey = htmlText._getKey();
    this._renderer.htmlText.decreaseReferenceCount(gpuText.currentKey);
    gpuText.generatingTexture = true;
    gpuText.currentKey = newKey;
    const resolution = htmlText.resolution ?? this._renderer.resolution;
    const texture = await this._renderer.htmlText.getManagedTexture(
      htmlText.text,
      resolution,
      htmlText._style,
      htmlText._getKey()
    );
    const batchableSprite = gpuText.batchableSprite;
    batchableSprite.texture = gpuText.texture = texture;
    gpuText.generatingTexture = false;
    gpuText.textureNeedsUploading = true;
    htmlText.onViewUpdate();
    const padding = htmlText._style.padding;
    updateQuadBounds.updateQuadBounds(batchableSprite.bounds, htmlText._anchor, batchableSprite.texture, padding);
  }
  _getGpuText(htmlText) {
    return this._gpuText[htmlText.uid] || this.initGpuText(htmlText);
  }
  initGpuText(htmlText) {
    const gpuTextData = {
      texture: Texture.Texture.EMPTY,
      currentKey: "--",
      batchableSprite: PoolGroup.BigPool.get(BatchableSprite.BatchableSprite),
      textureNeedsUploading: false,
      generatingTexture: false
    };
    const batchableSprite = gpuTextData.batchableSprite;
    batchableSprite.renderable = htmlText;
    batchableSprite.transform = htmlText.groupTransform;
    batchableSprite.texture = Texture.Texture.EMPTY;
    batchableSprite.bounds = { minX: 0, maxX: 1, minY: 0, maxY: 0 };
    batchableSprite.roundPixels = this._renderer._roundPixels | htmlText._roundPixels;
    htmlText._resolution = htmlText._autoResolution ? this._renderer.resolution : htmlText.resolution;
    this._gpuText[htmlText.uid] = gpuTextData;
    htmlText.on("destroyed", this._destroyRenderableBound);
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
HTMLTextPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "htmlText"
};

exports.HTMLTextPipe = HTMLTextPipe;
//# sourceMappingURL=HTMLTextPipe.js.map
