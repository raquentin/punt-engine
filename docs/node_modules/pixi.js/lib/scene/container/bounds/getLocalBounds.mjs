import { Matrix } from '../../../maths/matrix/Matrix.mjs';
import { warn } from '../../../utils/logging/warn.mjs';
import { matrixPool, boundsPool } from './utils/matrixAndBoundsPool.mjs';

"use strict";
function getLocalBounds(target, bounds, relativeMatrix) {
  bounds.clear();
  relativeMatrix || (relativeMatrix = Matrix.IDENTITY);
  _getLocalBounds(target, bounds, relativeMatrix, target, true);
  if (!bounds.isValid) {
    bounds.set(0, 0, 0, 0);
  }
  return bounds;
}
function _getLocalBounds(target, bounds, parentTransform, rootContainer, isRoot) {
  let relativeTransform;
  if (!isRoot) {
    if (!target.visible || !target.measurable)
      return;
    target.updateLocalTransform();
    const localTransform = target.localTransform;
    relativeTransform = matrixPool.get();
    relativeTransform.appendFrom(localTransform, parentTransform);
  } else {
    relativeTransform = matrixPool.get();
    relativeTransform = parentTransform.copyTo(relativeTransform);
  }
  const parentBounds = bounds;
  const preserveBounds = !!target.effects.length;
  if (preserveBounds) {
    bounds = boundsPool.get().clear();
  }
  if (target.boundsArea) {
    bounds.addRect(target.boundsArea, relativeTransform);
  } else {
    if (target.renderPipeId) {
      bounds.matrix = relativeTransform;
      target.addBounds(bounds);
    }
    const children = target.children;
    for (let i = 0; i < children.length; i++) {
      _getLocalBounds(children[i], bounds, relativeTransform, rootContainer, false);
    }
  }
  if (preserveBounds) {
    for (let i = 0; i < target.effects.length; i++) {
      target.effects[i].addLocalBounds?.(bounds, rootContainer);
    }
    parentBounds.addBounds(bounds, Matrix.IDENTITY);
    boundsPool.return(bounds);
  }
  matrixPool.return(relativeTransform);
}
function getParent(target, root, matrix) {
  const parent = target.parent;
  if (!parent) {
    warn("Item is not inside the root container");
    return;
  }
  if (parent !== root) {
    getParent(parent, root, matrix);
    parent.updateLocalTransform();
    matrix.append(parent.localTransform);
  }
}

export { getLocalBounds, getParent };
//# sourceMappingURL=getLocalBounds.mjs.map
