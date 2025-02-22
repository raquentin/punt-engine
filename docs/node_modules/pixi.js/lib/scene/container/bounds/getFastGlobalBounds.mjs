import { Matrix } from '../../../maths/matrix/Matrix.mjs';
import { boundsPool } from './utils/matrixAndBoundsPool.mjs';

"use strict";
const tempMatrix = new Matrix();
function getFastGlobalBounds(target, bounds) {
  bounds.clear();
  _getGlobalBoundsRecursive(target, bounds);
  if (!bounds.isValid) {
    bounds.set(0, 0, 0, 0);
  }
  if (!target.renderGroup) {
    bounds.applyMatrix(target.parentRenderGroup.worldTransform);
  } else {
    bounds.applyMatrix(target.renderGroup.localTransform);
  }
  return bounds;
}
function _getGlobalBoundsRecursive(target, bounds) {
  if (target.localDisplayStatus !== 7 || !target.measurable) {
    return;
  }
  const manageEffects = !!target.effects.length;
  let localBounds = bounds;
  if (target.renderGroup || manageEffects) {
    localBounds = boundsPool.get().clear();
  }
  if (target.boundsArea) {
    bounds.addRect(target.boundsArea, target.worldTransform);
  } else {
    if (target.renderPipeId) {
      const viewBounds = target.bounds;
      localBounds.addFrame(
        viewBounds.minX,
        viewBounds.minY,
        viewBounds.maxX,
        viewBounds.maxY,
        target.groupTransform
      );
    }
    const children = target.children;
    for (let i = 0; i < children.length; i++) {
      _getGlobalBoundsRecursive(children[i], localBounds);
    }
  }
  if (manageEffects) {
    let advanced = false;
    for (let i = 0; i < target.effects.length; i++) {
      if (target.effects[i].addBounds) {
        if (!advanced) {
          advanced = true;
          localBounds.applyMatrix(target.parentRenderGroup.worldTransform);
        }
        target.effects[i].addBounds(localBounds, true);
      }
    }
    if (advanced) {
      localBounds.applyMatrix(target.parentRenderGroup.worldTransform.copyTo(tempMatrix).invert());
      bounds.addBounds(localBounds, target.relativeGroupTransform);
    }
    bounds.addBounds(localBounds);
    boundsPool.return(localBounds);
  } else if (target.renderGroup) {
    bounds.addBounds(localBounds, target.relativeGroupTransform);
    boundsPool.return(localBounds);
  }
}

export { _getGlobalBoundsRecursive, getFastGlobalBounds };
//# sourceMappingURL=getFastGlobalBounds.mjs.map
