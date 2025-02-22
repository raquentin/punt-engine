'use strict';

"use strict";
function collectRenderGroups(renderGroup, out = []) {
  out.push(renderGroup);
  for (let i = 0; i < renderGroup.renderGroupChildren.length; i++) {
    collectRenderGroups(renderGroup.renderGroupChildren[i], out);
  }
  return out;
}

exports.collectRenderGroups = collectRenderGroups;
//# sourceMappingURL=collectRenderGroups.js.map
