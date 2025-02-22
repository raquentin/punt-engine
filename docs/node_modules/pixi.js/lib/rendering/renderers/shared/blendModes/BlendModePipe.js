'use strict';

var Extensions = require('../../../../extensions/Extensions.js');
var FilterEffect = require('../../../../filters/FilterEffect.js');
var warn = require('../../../../utils/logging/warn.js');

"use strict";
const BLEND_MODE_FILTERS = {};
Extensions.extensions.handle(Extensions.ExtensionType.BlendMode, (value) => {
  if (!value.name) {
    throw new Error("BlendMode extension must have a name property");
  }
  BLEND_MODE_FILTERS[value.name] = value.ref;
}, (value) => {
  delete BLEND_MODE_FILTERS[value.name];
});
class BlendModePipe {
  constructor(renderer) {
    this._isAdvanced = false;
    this._filterHash = /* @__PURE__ */ Object.create(null);
    this._renderer = renderer;
  }
  /**
   * This ensures that a blendMode switch is added to the instruction set if the blend mode has changed.
   * @param renderable - The renderable we are adding to the instruction set
   * @param blendMode - The blend mode of the renderable
   * @param instructionSet - The instruction set we are adding to
   */
  setBlendMode(renderable, blendMode, instructionSet) {
    if (this._activeBlendMode === blendMode) {
      if (this._isAdvanced)
        this._renderableList.push(renderable);
      return;
    }
    this._activeBlendMode = blendMode;
    if (this._isAdvanced) {
      this._endAdvancedBlendMode(instructionSet);
    }
    this._isAdvanced = !!BLEND_MODE_FILTERS[blendMode];
    if (this._isAdvanced) {
      this._beginAdvancedBlendMode(instructionSet);
      this._renderableList.push(renderable);
    }
  }
  _beginAdvancedBlendMode(instructionSet) {
    this._renderer.renderPipes.batch.break(instructionSet);
    const blendMode = this._activeBlendMode;
    if (!BLEND_MODE_FILTERS[blendMode]) {
      warn.warn(`Unable to assign BlendMode: '${blendMode}'. You may want to include: import 'pixi.js/advanced-blend-modes'`);
      return;
    }
    let filterEffect = this._filterHash[blendMode];
    if (!filterEffect) {
      filterEffect = this._filterHash[blendMode] = new FilterEffect.FilterEffect();
      filterEffect.filters = [new BLEND_MODE_FILTERS[blendMode]()];
    }
    const instruction = {
      renderPipeId: "filter",
      action: "pushFilter",
      renderables: [],
      filterEffect,
      canBundle: false
    };
    this._renderableList = instruction.renderables;
    instructionSet.add(instruction);
  }
  _endAdvancedBlendMode(instructionSet) {
    this._renderableList = null;
    this._renderer.renderPipes.batch.break(instructionSet);
    instructionSet.add({
      renderPipeId: "filter",
      action: "popFilter",
      canBundle: false
    });
  }
  /**
   * called when the instruction build process is starting this will reset internally to the default blend mode
   * @internal
   * @ignore
   */
  buildStart() {
    this._isAdvanced = false;
  }
  /**
   * called when the instruction build process is finished, ensuring that if there is an advanced blend mode
   * active, we add the final render instructions added to the instruction set
   * @param instructionSet - The instruction set we are adding to
   * @internal
   * @ignore
   */
  buildEnd(instructionSet) {
    if (this._isAdvanced) {
      this._endAdvancedBlendMode(instructionSet);
    }
  }
  /**
   * @internal
   * @ignore
   */
  destroy() {
    this._renderer = null;
    this._renderableList = null;
    for (const i in this._filterHash) {
      this._filterHash[i].destroy();
    }
    this._filterHash = null;
  }
}
/** @ignore */
BlendModePipe.extension = {
  type: [
    Extensions.ExtensionType.WebGLPipes,
    Extensions.ExtensionType.WebGPUPipes,
    Extensions.ExtensionType.CanvasPipes
  ],
  name: "blendMode"
};

exports.BlendModePipe = BlendModePipe;
//# sourceMappingURL=BlendModePipe.js.map
