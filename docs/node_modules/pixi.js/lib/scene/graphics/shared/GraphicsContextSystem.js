'use strict';

var Extensions = require('../../../extensions/Extensions.js');
var getTextureBatchBindGroup = require('../../../rendering/batcher/gpu/getTextureBatchBindGroup.js');
var DefaultBatcher = require('../../../rendering/batcher/shared/DefaultBatcher.js');
var InstructionSet = require('../../../rendering/renderers/shared/instructions/InstructionSet.js');
var deprecation = require('../../../utils/logging/deprecation.js');
var PoolGroup = require('../../../utils/pool/PoolGroup.js');
var buildContextBatches = require('./utils/buildContextBatches.js');

"use strict";
class GpuGraphicsContext {
  constructor() {
    this.batches = [];
    this.geometryData = {
      vertices: [],
      uvs: [],
      indices: []
    };
  }
}
class GraphicsContextRenderData {
  constructor() {
    this.batcher = new DefaultBatcher.DefaultBatcher();
    this.instructions = new InstructionSet.InstructionSet();
  }
  init() {
    this.instructions.reset();
  }
  /**
   * @deprecated since version 8.0.0
   * Use `batcher.geometry` instead.
   * @see {Batcher#geometry}
   */
  get geometry() {
    deprecation.deprecation(deprecation.v8_3_4, "GraphicsContextRenderData#geometry is deprecated, please use batcher.geometry instead.");
    return this.batcher.geometry;
  }
}
const _GraphicsContextSystem = class _GraphicsContextSystem {
  constructor() {
    // the root context batches, used to either make a batch or geometry
    // all graphics use this as a base
    this._gpuContextHash = {};
    // used for non-batchable graphics
    this._graphicsDataContextHash = /* @__PURE__ */ Object.create(null);
  }
  /**
   * Runner init called, update the default options
   * @ignore
   */
  init(options) {
    _GraphicsContextSystem.defaultOptions.bezierSmoothness = options?.bezierSmoothness ?? _GraphicsContextSystem.defaultOptions.bezierSmoothness;
  }
  getContextRenderData(context) {
    return this._graphicsDataContextHash[context.uid] || this._initContextRenderData(context);
  }
  // Context management functions
  updateGpuContext(context) {
    let gpuContext = this._gpuContextHash[context.uid] || this._initContext(context);
    if (context.dirty) {
      if (gpuContext) {
        this._cleanGraphicsContextData(context);
      } else {
        gpuContext = this._initContext(context);
      }
      buildContextBatches.buildContextBatches(context, gpuContext);
      const batchMode = context.batchMode;
      if (context.customShader || batchMode === "no-batch") {
        gpuContext.isBatchable = false;
      } else if (batchMode === "auto") {
        gpuContext.isBatchable = gpuContext.geometryData.vertices.length < 400;
      }
      context.dirty = false;
    }
    return gpuContext;
  }
  getGpuContext(context) {
    return this._gpuContextHash[context.uid] || this._initContext(context);
  }
  _initContextRenderData(context) {
    const graphicsData = PoolGroup.BigPool.get(GraphicsContextRenderData);
    const { batches, geometryData } = this._gpuContextHash[context.uid];
    const vertexSize = geometryData.vertices.length;
    const indexSize = geometryData.indices.length;
    for (let i = 0; i < batches.length; i++) {
      batches[i].applyTransform = false;
    }
    const batcher = graphicsData.batcher;
    batcher.ensureAttributeBuffer(vertexSize);
    batcher.ensureIndexBuffer(indexSize);
    batcher.begin();
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      batcher.add(batch);
    }
    batcher.finish(graphicsData.instructions);
    const geometry = batcher.geometry;
    geometry.indexBuffer.setDataWithSize(batcher.indexBuffer, batcher.indexSize, true);
    geometry.buffers[0].setDataWithSize(batcher.attributeBuffer.float32View, batcher.attributeSize, true);
    const drawBatches = batcher.batches;
    for (let i = 0; i < drawBatches.length; i++) {
      const batch = drawBatches[i];
      batch.bindGroup = getTextureBatchBindGroup.getTextureBatchBindGroup(batch.textures.textures, batch.textures.count);
    }
    this._graphicsDataContextHash[context.uid] = graphicsData;
    return graphicsData;
  }
  _initContext(context) {
    const gpuContext = new GpuGraphicsContext();
    gpuContext.context = context;
    this._gpuContextHash[context.uid] = gpuContext;
    context.on("destroy", this.onGraphicsContextDestroy, this);
    return this._gpuContextHash[context.uid];
  }
  onGraphicsContextDestroy(context) {
    this._cleanGraphicsContextData(context);
    context.off("destroy", this.onGraphicsContextDestroy, this);
    this._gpuContextHash[context.uid] = null;
  }
  _cleanGraphicsContextData(context) {
    const gpuContext = this._gpuContextHash[context.uid];
    if (!gpuContext.isBatchable) {
      if (this._graphicsDataContextHash[context.uid]) {
        PoolGroup.BigPool.return(this.getContextRenderData(context));
        this._graphicsDataContextHash[context.uid] = null;
      }
    }
    if (gpuContext.batches) {
      gpuContext.batches.forEach((batch) => {
        PoolGroup.BigPool.return(batch);
      });
    }
  }
  destroy() {
    for (const i in this._gpuContextHash) {
      if (this._gpuContextHash[i]) {
        this.onGraphicsContextDestroy(this._gpuContextHash[i].context);
      }
    }
  }
};
/** @ignore */
_GraphicsContextSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
  ],
  name: "graphicsContext"
};
/** The default options for the GraphicsContextSystem. */
_GraphicsContextSystem.defaultOptions = {
  /**
   * A value from 0 to 1 that controls the smoothness of bezier curves (the higher the smoother)
   * @default 0.5
   */
  bezierSmoothness: 0.5
};
let GraphicsContextSystem = _GraphicsContextSystem;

exports.GpuGraphicsContext = GpuGraphicsContext;
exports.GraphicsContextRenderData = GraphicsContextRenderData;
exports.GraphicsContextSystem = GraphicsContextSystem;
//# sourceMappingURL=GraphicsContextSystem.js.map
