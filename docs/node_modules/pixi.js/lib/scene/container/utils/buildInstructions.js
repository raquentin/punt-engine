'use strict';

"use strict";
function buildInstructions(renderGroup, rendererOrPipes) {
  const root = renderGroup.root;
  const instructionSet = renderGroup.instructionSet;
  instructionSet.reset();
  const renderer = rendererOrPipes.renderPipes ? rendererOrPipes : rendererOrPipes.batch.renderer;
  const renderPipes = renderer.renderPipes;
  renderPipes.batch.buildStart(instructionSet);
  renderPipes.blendMode.buildStart();
  renderPipes.colorMask.buildStart();
  if (root.sortableChildren) {
    root.sortChildren();
  }
  collectAllRenderablesAdvanced(root, instructionSet, renderer, true);
  renderPipes.batch.buildEnd(instructionSet);
  renderPipes.blendMode.buildEnd(instructionSet);
}
function collectAllRenderables(container, instructionSet, rendererOrPipes) {
  const renderer = rendererOrPipes.renderPipes ? rendererOrPipes : rendererOrPipes.batch.renderer;
  if (container.globalDisplayStatus < 7 || !container.includeInBuild)
    return;
  if (container.sortableChildren) {
    container.sortChildren();
  }
  if (container.isSimple) {
    collectAllRenderablesSimple(container, instructionSet, renderer);
  } else {
    collectAllRenderablesAdvanced(container, instructionSet, renderer, false);
  }
}
function collectAllRenderablesSimple(container, instructionSet, renderer) {
  if (container.renderPipeId) {
    const { renderPipes, renderableGC } = renderer;
    renderPipes.blendMode.setBlendMode(container, container.groupBlendMode, instructionSet);
    container.didViewUpdate = false;
    const rp = renderPipes;
    rp[container.renderPipeId].addRenderable(container, instructionSet);
    renderableGC.addRenderable(container, instructionSet);
  }
  if (!container.renderGroup) {
    const children = container.children;
    const length = children.length;
    for (let i = 0; i < length; i++) {
      collectAllRenderables(children[i], instructionSet, renderer);
    }
  }
}
function collectAllRenderablesAdvanced(container, instructionSet, renderer, isRoot) {
  const { renderPipes, renderableGC } = renderer;
  if (!isRoot && container.renderGroup) {
    renderPipes.renderGroup.addRenderGroup(container.renderGroup, instructionSet);
  } else {
    for (let i = 0; i < container.effects.length; i++) {
      const effect = container.effects[i];
      const pipe = renderPipes[effect.pipe];
      pipe.push(effect, container, instructionSet);
    }
    const renderPipeId = container.renderPipeId;
    if (renderPipeId) {
      renderPipes.blendMode.setBlendMode(container, container.groupBlendMode, instructionSet);
      container.didViewUpdate = false;
      const pipe = renderPipes[renderPipeId];
      pipe.addRenderable(container, instructionSet);
      renderableGC.addRenderable(container, instructionSet);
    }
    const children = container.children;
    if (children.length) {
      for (let i = 0; i < children.length; i++) {
        collectAllRenderables(children[i], instructionSet, renderer);
      }
    }
    for (let i = container.effects.length - 1; i >= 0; i--) {
      const effect = container.effects[i];
      const pipe = renderPipes[effect.pipe];
      pipe.pop(effect, container, instructionSet);
    }
  }
}

exports.buildInstructions = buildInstructions;
exports.collectAllRenderables = collectAllRenderables;
//# sourceMappingURL=buildInstructions.js.map
