"use strict";
function collectRenderGroups(renderGroup, out = []) {
  out.push(renderGroup);
  for (let i = 0; i < renderGroup.renderGroupChildren.length; i++) {
    collectRenderGroups(renderGroup.renderGroupChildren[i], out);
  }
  return out;
}

export { collectRenderGroups };
//# sourceMappingURL=collectRenderGroups.mjs.map
