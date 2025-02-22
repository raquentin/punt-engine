import { ExtensionType } from '../../extensions/Extensions.mjs';
import { BigPool } from '../../utils/pool/PoolGroup.mjs';
import { BatchableSprite } from './BatchableSprite.mjs';

"use strict";
class SpritePipe {
  constructor(renderer) {
    this._gpuSpriteHash = /* @__PURE__ */ Object.create(null);
    this._destroyRenderableBound = this.destroyRenderable.bind(this);
    this._renderer = renderer;
  }
  addRenderable(sprite, instructionSet) {
    const gpuSprite = this._getGpuSprite(sprite);
    if (sprite._didSpriteUpdate)
      this._updateBatchableSprite(sprite, gpuSprite);
    this._renderer.renderPipes.batch.addToBatch(gpuSprite, instructionSet);
  }
  updateRenderable(sprite) {
    const gpuSprite = this._gpuSpriteHash[sprite.uid];
    if (sprite._didSpriteUpdate)
      this._updateBatchableSprite(sprite, gpuSprite);
    gpuSprite._batcher.updateElement(gpuSprite);
  }
  validateRenderable(sprite) {
    const texture = sprite._texture;
    const gpuSprite = this._getGpuSprite(sprite);
    if (gpuSprite.texture._source !== texture._source) {
      return !gpuSprite._batcher.checkAndUpdateTexture(gpuSprite, texture);
    }
    return false;
  }
  destroyRenderable(sprite) {
    const batchableSprite = this._gpuSpriteHash[sprite.uid];
    BigPool.return(batchableSprite);
    this._gpuSpriteHash[sprite.uid] = null;
    sprite.off("destroyed", this._destroyRenderableBound);
  }
  _updateBatchableSprite(sprite, batchableSprite) {
    sprite._didSpriteUpdate = false;
    batchableSprite.bounds = sprite.bounds;
    batchableSprite.texture = sprite._texture;
  }
  _getGpuSprite(sprite) {
    return this._gpuSpriteHash[sprite.uid] || this._initGPUSprite(sprite);
  }
  _initGPUSprite(sprite) {
    const batchableSprite = BigPool.get(BatchableSprite);
    batchableSprite.renderable = sprite;
    batchableSprite.transform = sprite.groupTransform;
    batchableSprite.texture = sprite._texture;
    batchableSprite.bounds = sprite.bounds;
    batchableSprite.roundPixels = this._renderer._roundPixels | sprite._roundPixels;
    this._gpuSpriteHash[sprite.uid] = batchableSprite;
    sprite._didSpriteUpdate = false;
    sprite.on("destroyed", this._destroyRenderableBound);
    return batchableSprite;
  }
  destroy() {
    for (const i in this._gpuSpriteHash) {
      BigPool.return(this._gpuSpriteHash[i]);
    }
    this._gpuSpriteHash = null;
    this._renderer = null;
  }
}
/** @ignore */
SpritePipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "sprite"
};

export { SpritePipe };
//# sourceMappingURL=SpritePipe.mjs.map
