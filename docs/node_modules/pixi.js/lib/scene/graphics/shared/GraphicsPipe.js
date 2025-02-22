'use strict';

var Extensions = require('../../../extensions/Extensions.js');
var State = require('../../../rendering/renderers/shared/state/State.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var colorToUniform = require('../gpu/colorToUniform.js');
var BatchableGraphics = require('./BatchableGraphics.js');

"use strict";
class GraphicsPipe {
  constructor(renderer, adaptor) {
    this.state = State.State.for2d();
    // batchable graphics list, used to render batches
    this._graphicsBatchesHash = /* @__PURE__ */ Object.create(null);
    this._destroyRenderableBound = this.destroyRenderable.bind(this);
    this.renderer = renderer;
    this._adaptor = adaptor;
    this._adaptor.init();
  }
  validateRenderable(graphics) {
    const context = graphics.context;
    const wasBatched = !!this._graphicsBatchesHash[graphics.uid];
    const gpuContext = this.renderer.graphicsContext.updateGpuContext(context);
    if (gpuContext.isBatchable || wasBatched !== gpuContext.isBatchable) {
      return true;
    }
    return false;
  }
  addRenderable(graphics, instructionSet) {
    const gpuContext = this.renderer.graphicsContext.updateGpuContext(graphics.context);
    if (graphics._didGraphicsUpdate) {
      graphics._didGraphicsUpdate = false;
      this._rebuild(graphics);
    }
    if (gpuContext.isBatchable) {
      this._addToBatcher(graphics, instructionSet);
    } else {
      this.renderer.renderPipes.batch.break(instructionSet);
      instructionSet.add(graphics);
    }
  }
  updateRenderable(graphics) {
    const batches = this._graphicsBatchesHash[graphics.uid];
    if (batches) {
      for (let i = 0; i < batches.length; i++) {
        const batch = batches[i];
        batch._batcher.updateElement(batch);
      }
    }
  }
  destroyRenderable(graphics) {
    if (this._graphicsBatchesHash[graphics.uid]) {
      this._removeBatchForRenderable(graphics.uid);
    }
    graphics.off("destroyed", this._destroyRenderableBound);
  }
  execute(graphics) {
    if (!graphics.isRenderable)
      return;
    const renderer = this.renderer;
    const context = graphics.context;
    const contextSystem = renderer.graphicsContext;
    if (!contextSystem.getGpuContext(context).batches.length) {
      return;
    }
    const shader = context.customShader || this._adaptor.shader;
    this.state.blendMode = graphics.groupBlendMode;
    const localUniforms = shader.resources.localUniforms.uniforms;
    localUniforms.uTransformMatrix = graphics.groupTransform;
    localUniforms.uRound = renderer._roundPixels | graphics._roundPixels;
    colorToUniform.color32BitToUniform(
      graphics.groupColorAlpha,
      localUniforms.uColor,
      0
    );
    this._adaptor.execute(this, graphics);
  }
  _rebuild(graphics) {
    const wasBatched = !!this._graphicsBatchesHash[graphics.uid];
    const gpuContext = this.renderer.graphicsContext.updateGpuContext(graphics.context);
    if (wasBatched) {
      this._removeBatchForRenderable(graphics.uid);
    }
    if (gpuContext.isBatchable) {
      this._initBatchesForRenderable(graphics);
    }
    graphics.batched = gpuContext.isBatchable;
  }
  _addToBatcher(graphics, instructionSet) {
    const batchPipe = this.renderer.renderPipes.batch;
    const batches = this._getBatchesForRenderable(graphics);
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      batchPipe.addToBatch(batch, instructionSet);
    }
  }
  _getBatchesForRenderable(graphics) {
    return this._graphicsBatchesHash[graphics.uid] || this._initBatchesForRenderable(graphics);
  }
  _initBatchesForRenderable(graphics) {
    const context = graphics.context;
    const gpuContext = this.renderer.graphicsContext.getGpuContext(context);
    const roundPixels = this.renderer._roundPixels | graphics._roundPixels;
    const batches = gpuContext.batches.map((batch) => {
      const batchClone = PoolGroup.BigPool.get(BatchableGraphics.BatchableGraphics);
      batch.copyTo(batchClone);
      batchClone.renderable = graphics;
      batchClone.roundPixels = roundPixels;
      return batchClone;
    });
    if (this._graphicsBatchesHash[graphics.uid] === void 0) {
      graphics.on("destroyed", this._destroyRenderableBound);
    }
    this._graphicsBatchesHash[graphics.uid] = batches;
    return batches;
  }
  _removeBatchForRenderable(graphicsUid) {
    this._graphicsBatchesHash[graphicsUid].forEach((batch) => {
      PoolGroup.BigPool.return(batch);
    });
    this._graphicsBatchesHash[graphicsUid] = null;
  }
  destroy() {
    this.renderer = null;
    this._adaptor.destroy();
    this._adaptor = null;
    this.state = null;
    for (const i in this._graphicsBatchesHash) {
      this._removeBatchForRenderable(i);
    }
    this._graphicsBatchesHash = null;
  }
}
/** @ignore */
GraphicsPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "graphics"
};

exports.GraphicsPipe = GraphicsPipe;
//# sourceMappingURL=GraphicsPipe.js.map
