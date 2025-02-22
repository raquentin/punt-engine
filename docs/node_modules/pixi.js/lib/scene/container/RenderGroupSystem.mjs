import { ExtensionType } from '../../extensions/Extensions.mjs';
import { Matrix } from '../../maths/matrix/Matrix.mjs';
import { buildInstructions } from './utils/buildInstructions.mjs';
import { clearList } from './utils/clearList.mjs';
import { collectRenderGroups } from './utils/collectRenderGroups.mjs';
import { executeInstructions } from './utils/executeInstructions.mjs';
import { updateRenderGroupTransforms } from './utils/updateRenderGroupTransforms.mjs';
import { validateRenderables } from './utils/validateRenderables.mjs';

"use strict";
const tempMatrix = new Matrix();
class RenderGroupSystem {
  constructor(renderer) {
    this._renderer = renderer;
  }
  render({ container, transform }) {
    container.isRenderGroup = true;
    const parent = container.parent;
    const renderGroupParent = container.renderGroup.renderGroupParent;
    container.parent = null;
    container.renderGroup.renderGroupParent = null;
    const renderer = this._renderer;
    const renderGroups = collectRenderGroups(container.renderGroup, []);
    let originalLocalTransform = tempMatrix;
    if (transform) {
      originalLocalTransform = originalLocalTransform.copyFrom(container.renderGroup.localTransform);
      container.renderGroup.localTransform.copyFrom(transform);
    }
    const renderPipes = renderer.renderPipes;
    for (let i = 0; i < renderGroups.length; i++) {
      const renderGroup = renderGroups[i];
      renderGroup.runOnRender();
      renderGroup.instructionSet.renderPipes = renderPipes;
      if (!renderGroup.structureDidChange) {
        validateRenderables(renderGroup, renderPipes);
      } else {
        clearList(renderGroup.childrenRenderablesToUpdate.list, 0);
      }
      updateRenderGroupTransforms(renderGroup);
      if (renderGroup.structureDidChange) {
        renderGroup.structureDidChange = false;
        buildInstructions(renderGroup, renderer);
      } else {
        updateRenderables(renderGroup);
      }
      renderGroup.childrenRenderablesToUpdate.index = 0;
      renderer.renderPipes.batch.upload(renderGroup.instructionSet);
    }
    renderer.globalUniforms.start({
      worldTransformMatrix: transform ? container.renderGroup.localTransform : container.renderGroup.worldTransform,
      worldColor: container.renderGroup.worldColorAlpha
    });
    executeInstructions(container.renderGroup, renderPipes);
    if (renderPipes.uniformBatch) {
      renderPipes.uniformBatch.renderEnd();
    }
    if (transform) {
      container.renderGroup.localTransform.copyFrom(originalLocalTransform);
    }
    container.parent = parent;
    container.renderGroup.renderGroupParent = renderGroupParent;
  }
  destroy() {
    this._renderer = null;
  }
}
/** @ignore */
RenderGroupSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "renderGroup"
};
function updateRenderables(renderGroup) {
  const { list, index } = renderGroup.childrenRenderablesToUpdate;
  for (let i = 0; i < index; i++) {
    const container = list[i];
    if (container.didViewUpdate) {
      renderGroup.updateRenderable(container);
    }
  }
  clearList(list, index);
}

export { RenderGroupSystem };
//# sourceMappingURL=RenderGroupSystem.mjs.map
