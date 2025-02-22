import { Matrix } from '../../maths/matrix/Matrix.mjs';
import { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet.mjs';

"use strict";
class RenderGroup {
  constructor() {
    this.renderPipeId = "renderGroup";
    this.root = null;
    this.canBundle = false;
    this.renderGroupParent = null;
    this.renderGroupChildren = [];
    this.worldTransform = new Matrix();
    this.worldColorAlpha = 4294967295;
    this.worldColor = 16777215;
    this.worldAlpha = 1;
    // these updates are transform changes..
    this.childrenToUpdate = /* @__PURE__ */ Object.create(null);
    this.updateTick = 0;
    // these update are renderable changes..
    this.childrenRenderablesToUpdate = { list: [], index: 0 };
    // other
    this.structureDidChange = true;
    this.instructionSet = new InstructionSet();
    this._onRenderContainers = [];
  }
  init(root) {
    this.root = root;
    if (root._onRender)
      this.addOnRender(root);
    root.didChange = true;
    const children = root.children;
    for (let i = 0; i < children.length; i++) {
      this.addChild(children[i]);
    }
  }
  reset() {
    this.renderGroupChildren.length = 0;
    for (const i in this.childrenToUpdate) {
      const childrenAtDepth = this.childrenToUpdate[i];
      childrenAtDepth.list.fill(null);
      childrenAtDepth.index = 0;
    }
    this.childrenRenderablesToUpdate.index = 0;
    this.childrenRenderablesToUpdate.list.fill(null);
    this.root = null;
    this.updateTick = 0;
    this.structureDidChange = true;
    this._onRenderContainers.length = 0;
    this.renderGroupParent = null;
  }
  get localTransform() {
    return this.root.localTransform;
  }
  addRenderGroupChild(renderGroupChild) {
    if (renderGroupChild.renderGroupParent) {
      renderGroupChild.renderGroupParent._removeRenderGroupChild(renderGroupChild);
    }
    renderGroupChild.renderGroupParent = this;
    this.renderGroupChildren.push(renderGroupChild);
  }
  _removeRenderGroupChild(renderGroupChild) {
    const index = this.renderGroupChildren.indexOf(renderGroupChild);
    if (index > -1) {
      this.renderGroupChildren.splice(index, 1);
    }
    renderGroupChild.renderGroupParent = null;
  }
  addChild(child) {
    this.structureDidChange = true;
    child.parentRenderGroup = this;
    child.updateTick = -1;
    if (child.parent === this.root) {
      child.relativeRenderGroupDepth = 1;
    } else {
      child.relativeRenderGroupDepth = child.parent.relativeRenderGroupDepth + 1;
    }
    child.didChange = true;
    this.onChildUpdate(child);
    if (child.renderGroup) {
      this.addRenderGroupChild(child.renderGroup);
      return;
    }
    if (child._onRender)
      this.addOnRender(child);
    const children = child.children;
    for (let i = 0; i < children.length; i++) {
      this.addChild(children[i]);
    }
  }
  removeChild(child) {
    this.structureDidChange = true;
    if (child._onRender) {
      if (!child.renderGroup) {
        this.removeOnRender(child);
      }
    }
    child.parentRenderGroup = null;
    if (child.renderGroup) {
      this._removeRenderGroupChild(child.renderGroup);
      return;
    }
    const children = child.children;
    for (let i = 0; i < children.length; i++) {
      this.removeChild(children[i]);
    }
  }
  removeChildren(children) {
    for (let i = 0; i < children.length; i++) {
      this.removeChild(children[i]);
    }
  }
  onChildUpdate(child) {
    let childrenToUpdate = this.childrenToUpdate[child.relativeRenderGroupDepth];
    if (!childrenToUpdate) {
      childrenToUpdate = this.childrenToUpdate[child.relativeRenderGroupDepth] = {
        index: 0,
        list: []
      };
    }
    childrenToUpdate.list[childrenToUpdate.index++] = child;
  }
  // SHOULD THIS BE HERE?
  updateRenderable(container) {
    if (container.globalDisplayStatus < 7)
      return;
    container.didViewUpdate = false;
    this.instructionSet.renderPipes[container.renderPipeId].updateRenderable(container);
  }
  onChildViewUpdate(child) {
    this.childrenRenderablesToUpdate.list[this.childrenRenderablesToUpdate.index++] = child;
  }
  get isRenderable() {
    return this.root.localDisplayStatus === 7 && this.worldAlpha > 0;
  }
  /**
   * adding a container to the onRender list will make sure the user function
   * passed in to the user defined 'onRender` callBack
   * @param container - the container to add to the onRender list
   */
  addOnRender(container) {
    this._onRenderContainers.push(container);
  }
  removeOnRender(container) {
    this._onRenderContainers.splice(this._onRenderContainers.indexOf(container), 1);
  }
  runOnRender() {
    for (let i = 0; i < this._onRenderContainers.length; i++) {
      this._onRenderContainers[i]._onRender();
    }
  }
  destroy() {
    this.renderGroupParent = null;
    this.root = null;
    this.childrenRenderablesToUpdate = null;
    this.childrenToUpdate = null;
    this.renderGroupChildren = null;
    this._onRenderContainers = null;
    this.instructionSet = null;
  }
  getChildren(out = []) {
    const children = this.root.children;
    for (let i = 0; i < children.length; i++) {
      this._getChildren(children[i], out);
    }
    return out;
  }
  _getChildren(container, out = []) {
    out.push(container);
    if (container.renderGroup)
      return out;
    const children = container.children;
    for (let i = 0; i < children.length; i++) {
      this._getChildren(children[i], out);
    }
    return out;
  }
}

export { RenderGroup };
//# sourceMappingURL=RenderGroup.mjs.map
