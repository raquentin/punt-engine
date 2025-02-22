'use strict';

var Extensions = require('../../extensions/Extensions.js');
var executeInstructions = require('./utils/executeInstructions.js');

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
    executeInstructions.executeInstructions(renderGroup, this._renderer.renderPipes);
    this._renderer.globalUniforms.pop();
  }
  destroy() {
    this._renderer = null;
  }
}
RenderGroupPipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "renderGroup"
};

exports.RenderGroupPipe = RenderGroupPipe;
//# sourceMappingURL=RenderGroupPipe.js.map
