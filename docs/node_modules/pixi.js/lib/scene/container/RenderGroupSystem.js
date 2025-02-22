'use strict';

var Extensions = require('../../extensions/Extensions.js');
var Matrix = require('../../maths/matrix/Matrix.js');
var buildInstructions = require('./utils/buildInstructions.js');
var clearList = require('./utils/clearList.js');
var collectRenderGroups = require('./utils/collectRenderGroups.js');
var executeInstructions = require('./utils/executeInstructions.js');
var updateRenderGroupTransforms = require('./utils/updateRenderGroupTransforms.js');
var validateRenderables = require('./utils/validateRenderables.js');

"use strict";
const tempMatrix = new Matrix.Matrix();
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
    const renderGroups = collectRenderGroups.collectRenderGroups(container.renderGroup, []);
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
        validateRenderables.validateRenderables(renderGroup, renderPipes);
      } else {
        clearList.clearList(renderGroup.childrenRenderablesToUpdate.list, 0);
      }
      updateRenderGroupTransforms.updateRenderGroupTransforms(renderGroup);
      if (renderGroup.structureDidChange) {
        renderGroup.structureDidChange = false;
        buildInstructions.buildInstructions(renderGroup, renderer);
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
    executeInstructions.executeInstructions(container.renderGroup, renderPipes);
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
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
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
  clearList.clearList(list, index);
}

exports.RenderGroupSystem = RenderGroupSystem;
//# sourceMappingURL=RenderGroupSystem.js.map
