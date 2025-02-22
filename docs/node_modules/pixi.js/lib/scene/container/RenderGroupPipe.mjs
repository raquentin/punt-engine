import { ExtensionType } from '../../extensions/Extensions.mjs';
import { executeInstructions } from './utils/executeInstructions.mjs';

"use strict";
class RenderGroupPipe {
  constructor(renderer) {
    this._renderer = renderer;
  }
  addRenderGroup(renderGroup, instructionSet) {
    this._renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add(renderGroup);
  }
  execute(renderGroup) {
    if (!renderGroup.isRenderable)
      return;
    this._renderer.globalUniforms.push({
      worldTransformMatrix: renderGroup.worldTransform,
      worldColor: renderGroup.worldColorAlpha
    });
    executeInstructions(renderGroup, this._renderer.renderPipes);
    this._renderer.globalUniforms.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
RenderGroupPipe.extension = {
  type: [
    ExtensionType.WebGLPipes,
    ExtensionType.WebGPUPipes,
    ExtensionType.CanvasPipes
  ],
  name: "renderGroup"
};

export { RenderGroupPipe };
//# sourceMappingURL=RenderGroupPipe.mjs.map
