"use strict";
function getGlobalRenderableBounds(renderables, bounds) {
  bounds.clear();
  const tempMatrix = bounds.matrix;
  for (let i = 0; i < renderables.length; i++) {
    const renderable = renderables[i];
    if (renderable.globalDisplayStatus < 7) {
      continue;
    }
    bounds.matrix = renderable.worldTransform;
    renderable.addBounds(bounds);
  }
  bounds.matrix = tempMatrix;
  return bounds;
}

export { getGlobalRenderableBounds };
//# sourceMappingURL=getRenderableBounds.mjs.map
