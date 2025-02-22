import { ExtensionType } from '../../extensions/Extensions.mjs';
import { getAdjustedBlendModeBlend } from '../../rendering/renderers/shared/state/getAdjustedBlendModeBlend.mjs';
import { State } from '../../rendering/renderers/shared/state/State.mjs';
import { RendererType } from '../../rendering/renderers/types.mjs';
import { color32BitToUniform } from '../graphics/gpu/colorToUniform.mjs';
import { BatchableMesh } from '../mesh/shared/BatchableMesh.mjs';
import { MeshGeometry } from '../mesh/shared/MeshGeometry.mjs';
import { TilingSpriteShader } from './shader/TilingSpriteShader.mjs';
import { QuadGeometry } from './utils/QuadGeometry.mjs';
import { setPositions } from './utils/setPositions.mjs';
import { setUvs } from './utils/setUvs.mjs';

"use strict";
const sharedQuad = new QuadGeometry();
class TilingSpritePipe {
  constructor(renderer) {
    this._state = State.default2d;
    this._tilingSpriteDataHash = /* @__PURE__ */ Object.create(null);
    this._destroyRenderableBound = this.destroyRenderable.bind(this);
    this._renderer = renderer;
  }
  validateRenderable(renderable) {
    const tilingSpriteData = this._getTilingSpriteData(renderable);
    const couldBatch = tilingSpriteData.canBatch;
    this._updateCanBatch(renderable);
    const canBatch = tilingSpriteData.canBatch;
    if (canBatch && canBatch === couldBatch) {
      const { batchableMesh } = tilingSpriteData;
      if (batchableMesh && batchableMesh.texture._source !== renderable.texture._source) {
        return !batchableMesh._batcher.checkAndUpdateTexture(batchableMesh, renderable.texture);
      }
    }
    return couldBatch !== canBatch;
  }
  addRenderable(tilingSprite, instructionSet) {
    const batcher = this._renderer.renderPipes.batch;
    this._updateCanBatch(tilingSprite);
    const tilingSpriteData = this._getTilingSpriteData(tilingSprite);
    const { geometry, canBatch } = tilingSpriteData;
    if (canBatch) {
      tilingSpriteData.batchableMesh || (tilingSpriteData.batchableMesh = new BatchableMesh());
      const batchableMesh = tilingSpriteData.batchableMesh;
      if (tilingSprite._didTilingSpriteUpdate) {
        tilingSprite._didTilingSpriteUpdate = false;
        this._updateBatchableMesh(tilingSprite);
        batchableMesh.geometry = geometry;
        batchableMesh.renderable = tilingSprite;
        batchableMesh.transform = tilingSprite.groupTransform;
        batchableMesh.texture = tilingSprite._texture;
      }
      batchableMesh.roundPixels = this._renderer._roundPixels | tilingSprite._roundPixels;
      batcher.addToBatch(batchableMesh, instructionSet);
    } else {
      batcher.break(instructionSet);
      tilingSpriteData.shader || (tilingSpriteData.shader = new TilingSpriteShader());
      this.updateRenderable(tilingSprite);
      instructionSet.add(tilingSprite);
    }
  }
  execute(tilingSprite) {
    const { shader } = this._tilingSpriteDataHash[tilingSprite.uid];
    shader.groups[0] = this._renderer.globalUniforms.bindGroup;
    const localUniforms = shader.resources.localUniforms.uniforms;
    localUniforms.uTransformMatrix = tilingSprite.groupTransform;
    localUniforms.uRound = this._renderer._roundPixels | tilingSprite._roundPixels;
    color32BitToUniform(
      tilingSprite.groupColorAlpha,
      localUniforms.uColor,
      0
    );
    this._state.blendMode = getAdjustedBlendModeBlend(tilingSprite.groupBlendMode, tilingSprite.texture._source);
    this._renderer.encoder.draw({
      geometry: sharedQuad,
      shader,
      state: this._state
    });
  }
  updateRenderable(tilingSprite) {
    const tilingSpriteData = this._getTilingSpriteData(tilingSprite);
    const { canBatch } = tilingSpriteData;
    if (canBatch) {
      const { batchableMesh } = tilingSpriteData;
      if (tilingSprite._didTilingSpriteUpdate)
        this._updateBatchableMesh(tilingSprite);
      batchableMesh._batcher.updateElement(batchableMesh);
    } else if (tilingSprite._didTilingSpriteUpdate) {
      const { shader } = tilingSpriteData;
      shader.updateUniforms(
        tilingSprite.width,
        tilingSprite.height,
        tilingSprite._tileTransform.matrix,
        tilingSprite.anchor.x,
        tilingSprite.anchor.y,
        tilingSprite.texture
      );
    }
    tilingSprite._didTilingSpriteUpdate = false;
  }
  destroyRenderable(tilingSprite) {
    const tilingSpriteData = this._getTilingSpriteData(tilingSprite);
    tilingSpriteData.batchableMesh = null;
    tilingSpriteData.shader?.destroy();
    this._tilingSpriteDataHash[tilingSprite.uid] = null;
    tilingSprite.off("destroyed", this._destroyRenderableBound);
  }
  _getTilingSpriteData(renderable) {
    return this._tilingSpriteDataHash[renderable.uid] || this._initTilingSpriteData(renderable);
  }
  _initTilingSpriteData(tilingSprite) {
    const geometry = new MeshGeometry({
      indices: sharedQuad.indices,
      positions: sharedQuad.positions.slice(),
      uvs: sharedQuad.uvs.slice()
    });
    this._tilingSpriteDataHash[tilingSprite.uid] = {
      canBatch: true,
      renderable: tilingSprite,
      geometry
    };
    tilingSprite.on("destroyed", this._destroyRenderableBound);
    return this._tilingSpriteDataHash[tilingSprite.uid];
  }
  _updateBatchableMesh(tilingSprite) {
    const renderableData = this._getTilingSpriteData(tilingSprite);
    const { geometry } = renderableData;
    const style = tilingSprite.texture.source.style;
    if (style.addressMode !== "repeat") {
      style.addressMode = "repeat";
      style.update();
    }
    setUvs(tilingSprite, geometry.uvs);
    setPositions(tilingSprite, geometry.positions);
  }
  destroy() {
    for (const i in this._tilingSpriteDataHash) {
      this.destroyRenderable(this._tilingSpriteDataHash[i].renderable);
    }
    this._tilingSpriteDataHash = null;
    this._renderer = null;
  }
  _updateCanBatch(tilingSprite) {
    const renderableData = this._getTilingSpriteData(tilingSprite);
    const texture = tilingSprite.texture;
    let _nonPowOf2wrapping = true;
    if (this._renderer.type === RendererType.WEBGL) {
      _nonPowOf2wrapping = this._renderer.context.supports.nonPowOf2wrapping;
    }
    renderableData.canBatch = texture.textureMatrix.isSimple && (_nonPowOf2wrapping || texture.source.isPowerOfTwo);
    return renderableData.canBatch;
  }
}
/** @ignore */
TilingSpritePipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "tilingSprite"
};

export { TilingSpritePipe };
//# sourceMappingURL=TilingSpritePipe.mjs.map
