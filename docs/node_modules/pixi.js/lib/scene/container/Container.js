'use strict';

var EventEmitter = require('eventemitter3');
var Color = require('../../color/Color.js');
var cullingMixin = require('../../culling/cullingMixin.js');
var Matrix = require('../../maths/matrix/Matrix.js');
var _const = require('../../maths/misc/const.js');
var ObservablePoint = require('../../maths/point/ObservablePoint.js');
var uid = require('../../utils/data/uid.js');
var deprecation = require('../../utils/logging/deprecation.js');
var PoolGroup = require('../../utils/pool/PoolGroup.js');
var childrenHelperMixin = require('./container-mixins/childrenHelperMixin.js');
var effectsMixin = require('./container-mixins/effectsMixin.js');
var findMixin = require('./container-mixins/findMixin.js');
var measureMixin = require('./container-mixins/measureMixin.js');
var onRenderMixin = require('./container-mixins/onRenderMixin.js');
var sortMixin = require('./container-mixins/sortMixin.js');
var toLocalGlobalMixin = require('./container-mixins/toLocalGlobalMixin.js');
var RenderGroup = require('./RenderGroup.js');
var assignWithIgnore = require('./utils/assignWithIgnore.js');

"use strict";
const defaultSkew = new ObservablePoint.ObservablePoint(null);
const defaultPivot = new ObservablePoint.ObservablePoint(null);
const defaultScale = new ObservablePoint.ObservablePoint(null, 1, 1);
const UPDATE_COLOR = 1;
const UPDATE_BLEND = 2;
const UPDATE_VISIBLE = 4;
const UPDATE_TRANSFORM = 8;
class Container extends EventEmitter {
  constructor(options = {}) {
    super();
    /** unique id for this container */
    this.uid = uid.uid("renderable");
    /** @private */
    this._updateFlags = 15;
    // the render group this container owns
    /** @private */
    this.renderGroup = null;
    // the render group this container belongs to
    /** @private */
    this.parentRenderGroup = null;
    // the index of the container in the render group
    /** @private */
    this.parentRenderGroupIndex = 0;
    // set to true if the container has changed. It is reset once the changes have been applied
    // by the transform system
    // its here to stop ensure that when things change, only one update gets registers with the transform system
    /** @private */
    this.didChange = false;
    // same as above, but for the renderable
    /** @private */
    this.didViewUpdate = false;
    // how deep is the container relative to its render group..
    // unless the element is the root render group - it will be relative to its parent
    /** @private */
    this.relativeRenderGroupDepth = 0;
    /**
     * The array of children of this container.
     * @readonly
     */
    this.children = [];
    /** The display object container that contains this display object. */
    this.parent = null;
    // used internally for changing up the render order.. mainly for masks and filters
    // TODO setting this should cause a rebuild??
    /** @private */
    this.includeInBuild = true;
    /** @private */
    this.measurable = true;
    /** @private */
    this.isSimple = true;
    // / /////////////Transform related props//////////////
    // used by the transform system to check if a container needs to be updated that frame
    // if the tick matches the current transform system tick, it is not updated again
    /**
     * @internal
     * @ignore
     */
    this.updateTick = -1;
    /**
     * Current transform of the object based on local factors: position, scale, other stuff.
     * @readonly
     */
    this.localTransform = new Matrix.Matrix();
    /**
     * The relative group transform is a transform relative to the render group it belongs too. It will include all parent
     * transforms and up to the render group (think of it as kind of like a stage - but the stage can be nested).
     * If this container is is self a render group matrix will be relative to its parent render group
     * @readonly
     */
    this.relativeGroupTransform = new Matrix.Matrix();
    /**
     * The group transform is a transform relative to the render group it belongs too.
     * If this container is render group then this will be an identity matrix. other wise it
     * will be the same as the relativeGroupTransform.
     * Use this value when actually rendering things to the screen
     * @readonly
     */
    this.groupTransform = this.relativeGroupTransform;
    /** If the object has been destroyed via destroy(). If true, it should not be used. */
    this.destroyed = false;
    // transform data..
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * @internal
     * @ignore
     */
    this._position = new ObservablePoint.ObservablePoint(this, 0, 0);
    /**
     * The scale factor of the object.
     * @internal
     * @ignore
     */
    this._scale = defaultScale;
    /**
     * The pivot point of the container that it rotates around.
     * @internal
     * @ignore
     */
    this._pivot = defaultPivot;
    /**
     * The skew amount, on the x and y axis.
     * @internal
     * @ignore
     */
    this._skew = defaultSkew;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    this._cx = 1;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    this._sx = 0;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    this._cy = 0;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    this._sy = 1;
    /**
     * The rotation amount.
     * @internal
     * @ignore
     */
    this._rotation = 0;
    // / COLOR related props //////////////
    // color stored as ABGR
    this.localColor = 16777215;
    this.localAlpha = 1;
    this.groupAlpha = 1;
    // A
    this.groupColor = 16777215;
    // BGR
    this.groupColorAlpha = 4294967295;
    // ABGR
    // / BLEND related props //////////////
    /**
     * @internal
     * @ignore
     */
    this.localBlendMode = "inherit";
    /**
     * @internal
     * @ignore
     */
    this.groupBlendMode = "normal";
    // / VISIBILITY related props //////////////
    // visibility
    // 0b11
    // first bit is visible, second bit is renderable
    /**
     * This property holds three bits: culled, visible, renderable
     * the third bit represents culling (0 = culled, 1 = not culled) 0b100
     * the second bit represents visibility (0 = not visible, 1 = visible) 0b010
     * the first bit represents renderable (0 = not renderable, 1 = renderable) 0b001
     * @internal
     * @ignore
     */
    this.localDisplayStatus = 7;
    // 0b11 | 0b10 | 0b01 | 0b00
    /**
     * @internal
     * @ignore
     */
    this.globalDisplayStatus = 7;
    /**
     * A value that increments each time the containe is modified
     * eg children added, removed etc
     * @ignore
     */
    this._didContainerChangeTick = 0;
    /**
     * A value that increments each time the container view is modified
     * eg texture swap, geometry change etc
     * @ignore
     */
    this._didViewChangeTick = 0;
    /**
     * property that tracks if the container transform has changed
     * @ignore
     */
    this._didLocalTransformChangeId = -1;
    this.effects = [];
    assignWithIgnore.assignWithIgnore(this, options, {
      children: true,
      parent: true,
      effects: true
    });
    options.children?.forEach((child) => this.addChild(child));
    options.parent?.addChild(this);
  }
  /**
   * Mixes all enumerable properties and methods from a source object to Container.
   * @param source - The source of properties and methods to mix in.
   */
  static mixin(source) {
    Object.defineProperties(Container.prototype, Object.getOwnPropertyDescriptors(source));
  }
  /**
   * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
   * @deprecated since 8.2.6
   * @ignore
   */
  set _didChangeId(value) {
    this._didViewChangeTick = value >> 12 & 4095;
    this._didContainerChangeTick = value & 4095;
  }
  get _didChangeId() {
    return this._didContainerChangeTick & 4095 | (this._didViewChangeTick & 4095) << 12;
  }
  /**
   * Adds one or more children to the container.
   *
   * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
   * @param {...Container} children - The Container(s) to add to the container
   * @returns {Container} - The first child that was added.
   */
  addChild(...children) {
    if (!this.allowChildren) {
      deprecation.deprecation(deprecation.v8_0_0, "addChild: Only Containers will be allowed to add children in v8.0.0");
    }
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.addChild(children[i]);
      }
      return children[0];
    }
    const child = children[0];
    if (child.parent === this) {
      this.children.splice(this.children.indexOf(child), 1);
      this.children.push(child);
      if (this.parentRenderGroup) {
        this.parentRenderGroup.structureDidChange = true;
      }
      return child;
    }
    if (child.parent) {
      child.parent.removeChild(child);
    }
    this.children.push(child);
    if (this.sortableChildren)
      this.sortDirty = true;
    child.parent = this;
    child.didChange = true;
    child.didViewUpdate = false;
    child._updateFlags = 15;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.addChild(child);
    }
    this.emit("childAdded", child, this, this.children.length - 1);
    child.emit("added", this);
    this._didViewChangeTick++;
    if (child._zIndex !== 0) {
      child.depthOfChildModified();
    }
    return child;
  }
  /**
   * Removes one or more children from the container.
   * @param {...Container} children - The Container(s) to remove
   * @returns {Container} The first child that was removed.
   */
  removeChild(...children) {
    if (children.length > 1) {
      for (let i = 0; i < children.length; i++) {
        this.removeChild(children[i]);
      }
      return children[0];
    }
    const child = children[0];
    const index = this.children.indexOf(child);
    if (index > -1) {
      this._didViewChangeTick++;
      this.children.splice(index, 1);
      if (this.renderGroup) {
        this.renderGroup.removeChild(child);
      } else if (this.parentRenderGroup) {
        this.parentRenderGroup.removeChild(child);
      }
      child.parent = null;
      this.emit("childRemoved", child, this, index);
      child.emit("removed", this);
    }
    return child;
  }
  /** @ignore */
  _onUpdate(point) {
    if (point) {
      if (point === this._skew) {
        this._updateSkew();
      }
    }
    this._didContainerChangeTick++;
    if (this.didChange)
      return;
    this.didChange = true;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.onChildUpdate(this);
    }
  }
  set isRenderGroup(value) {
    if (!!this.renderGroup === value)
      return;
    if (value) {
      this.enableRenderGroup();
    } else {
      this.disableRenderGroup();
    }
  }
  /**
   * Returns true if this container is a render group.
   * This means that it will be rendered as a separate pass, with its own set of instructions
   */
  get isRenderGroup() {
    return !!this.renderGroup;
  }
  /**
   * Calling this enables a render group for this container.
   * This means it will be rendered as a separate set of instructions.
   * The transform of the container will also be handled on the GPU rather than the CPU.
   */
  enableRenderGroup() {
    if (this.renderGroup)
      return;
    const parentRenderGroup = this.parentRenderGroup;
    parentRenderGroup?.removeChild(this);
    this.renderGroup = PoolGroup.BigPool.get(RenderGroup.RenderGroup, this);
    this.groupTransform = Matrix.Matrix.IDENTITY;
    parentRenderGroup?.addChild(this);
    this._updateIsSimple();
  }
  /** This will disable the render group for this container. */
  disableRenderGroup() {
    if (!this.renderGroup)
      return;
    const parentRenderGroup = this.parentRenderGroup;
    parentRenderGroup?.removeChild(this);
    PoolGroup.BigPool.return(this.renderGroup);
    this.renderGroup = null;
    this.groupTransform = this.relativeGroupTransform;
    parentRenderGroup?.addChild(this);
    this._updateIsSimple();
  }
  /** @ignore */
  _updateIsSimple() {
    this.isSimple = !this.renderGroup && this.effects.length === 0;
  }
  /**
   * Current transform of the object based on world (parent) factors.
   * @readonly
   */
  get worldTransform() {
    this._worldTransform || (this._worldTransform = new Matrix.Matrix());
    if (this.renderGroup) {
      this._worldTransform.copyFrom(this.renderGroup.worldTransform);
    } else if (this.parentRenderGroup) {
      this._worldTransform.appendFrom(this.relativeGroupTransform, this.parentRenderGroup.worldTransform);
    }
    return this._worldTransform;
  }
  // / ////// transform related stuff
  /**
   * The position of the container on the x axis relative to the local coordinates of the parent.
   * An alias to position.x
   */
  get x() {
    return this._position.x;
  }
  set x(value) {
    this._position.x = value;
  }
  /**
   * The position of the container on the y axis relative to the local coordinates of the parent.
   * An alias to position.y
   */
  get y() {
    return this._position.y;
  }
  set y(value) {
    this._position.y = value;
  }
  /**
   * The coordinate of the object relative to the local coordinates of the parent.
   * @since 4.0.0
   */
  get position() {
    return this._position;
  }
  set position(value) {
    this._position.copyFrom(value);
  }
  /**
   * The rotation of the object in radians.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get rotation() {
    return this._rotation;
  }
  set rotation(value) {
    if (this._rotation !== value) {
      this._rotation = value;
      this._onUpdate(this._skew);
    }
  }
  /**
   * The angle of the object in degrees.
   * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
   */
  get angle() {
    return this.rotation * _const.RAD_TO_DEG;
  }
  set angle(value) {
    this.rotation = value * _const.DEG_TO_RAD;
  }
  /**
   * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
   * is the projection of `pivot` in the parent's local space.
   *
   * By default, the pivot is the origin (0, 0).
   * @since 4.0.0
   */
  get pivot() {
    if (this._pivot === defaultPivot) {
      this._pivot = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    return this._pivot;
  }
  set pivot(value) {
    if (this._pivot === defaultPivot) {
      this._pivot = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    typeof value === "number" ? this._pivot.set(value) : this._pivot.copyFrom(value);
  }
  /**
   * The skew factor for the object in radians.
   * @since 4.0.0
   */
  get skew() {
    if (this._skew === defaultSkew) {
      this._skew = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    return this._skew;
  }
  set skew(value) {
    if (this._skew === defaultSkew) {
      this._skew = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    this._skew.copyFrom(value);
  }
  /**
   * The scale factors of this object along the local coordinate axes.
   *
   * The default scale is (1, 1).
   * @since 4.0.0
   */
  get scale() {
    if (this._scale === defaultScale) {
      this._scale = new ObservablePoint.ObservablePoint(this, 1, 1);
    }
    return this._scale;
  }
  set scale(value) {
    if (this._scale === defaultScale) {
      this._scale = new ObservablePoint.ObservablePoint(this, 0, 0);
    }
    typeof value === "number" ? this._scale.set(value) : this._scale.copyFrom(value);
  }
  /**
   * The width of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get width() {
    return Math.abs(this.scale.x * this.getLocalBounds().width);
  }
  set width(value) {
    const localWidth = this.getLocalBounds().width;
    this._setWidth(value, localWidth);
  }
  /**
   * The height of the Container, setting this will actually modify the scale to achieve the value set.
   * @memberof scene.Container#
   */
  get height() {
    return Math.abs(this.scale.y * this.getLocalBounds().height);
  }
  set height(value) {
    const localHeight = this.getLocalBounds().height;
    this._setHeight(value, localHeight);
  }
  /**
   * Retrieves the size of the container as a [Size]{@link Size} object.
   * This is faster than get the width and height separately.
   * @param out - Optional object to store the size in.
   * @returns - The size of the container.
   * @memberof scene.Container#
   */
  getSize(out) {
    if (!out) {
      out = {};
    }
    const bounds = this.getLocalBounds();
    out.width = Math.abs(this.scale.x * bounds.width);
    out.height = Math.abs(this.scale.y * bounds.height);
    return out;
  }
  /**
   * Sets the size of the container to the specified width and height.
   * This is faster than setting the width and height separately.
   * @param value - This can be either a number or a [Size]{@link Size} object.
   * @param height - The height to set. Defaults to the value of `width` if not provided.
   * @memberof scene.Container#
   */
  setSize(value, height) {
    const size = this.getLocalBounds();
    if (typeof value === "object") {
      height = value.height ?? value.width;
      value = value.width;
    } else {
      height ?? (height = value);
    }
    value !== void 0 && this._setWidth(value, size.width);
    height !== void 0 && this._setHeight(height, size.height);
  }
  /** Called when the skew or the rotation changes. */
  _updateSkew() {
    const rotation = this._rotation;
    const skew = this._skew;
    this._cx = Math.cos(rotation + skew._y);
    this._sx = Math.sin(rotation + skew._y);
    this._cy = -Math.sin(rotation - skew._x);
    this._sy = Math.cos(rotation - skew._x);
  }
  /**
   * Updates the transform properties of the container (accepts partial values).
   * @param {object} opts - The options for updating the transform.
   * @param {number} opts.x - The x position of the container.
   * @param {number} opts.y - The y position of the container.
   * @param {number} opts.scaleX - The scale factor on the x-axis.
   * @param {number} opts.scaleY - The scale factor on the y-axis.
   * @param {number} opts.rotation - The rotation of the container, in radians.
   * @param {number} opts.skewX - The skew factor on the x-axis.
   * @param {number} opts.skewY - The skew factor on the y-axis.
   * @param {number} opts.pivotX - The x coordinate of the pivot point.
   * @param {number} opts.pivotY - The y coordinate of the pivot point.
   */
  updateTransform(opts) {
    this.position.set(
      typeof opts.x === "number" ? opts.x : this.position.x,
      typeof opts.y === "number" ? opts.y : this.position.y
    );
    this.scale.set(
      typeof opts.scaleX === "number" ? opts.scaleX || 1 : this.scale.x,
      typeof opts.scaleY === "number" ? opts.scaleY || 1 : this.scale.y
    );
    this.rotation = typeof opts.rotation === "number" ? opts.rotation : this.rotation;
    this.skew.set(
      typeof opts.skewX === "number" ? opts.skewX : this.skew.x,
      typeof opts.skewY === "number" ? opts.skewY : this.skew.y
    );
    this.pivot.set(
      typeof opts.pivotX === "number" ? opts.pivotX : this.pivot.x,
      typeof opts.pivotY === "number" ? opts.pivotY : this.pivot.y
    );
    return this;
  }
  /**
   * Updates the local transform using the given matrix.
   * @param matrix - The matrix to use for updating the transform.
   */
  setFromMatrix(matrix) {
    matrix.decompose(this);
  }
  /** Updates the local transform. */
  updateLocalTransform() {
    const localTransformChangeId = this._didContainerChangeTick;
    if (this._didLocalTransformChangeId === localTransformChangeId)
      return;
    this._didLocalTransformChangeId = localTransformChangeId;
    const lt = this.localTransform;
    const scale = this._scale;
    const pivot = this._pivot;
    const position = this._position;
    const sx = scale._x;
    const sy = scale._y;
    const px = pivot._x;
    const py = pivot._y;
    lt.a = this._cx * sx;
    lt.b = this._sx * sx;
    lt.c = this._cy * sy;
    lt.d = this._sy * sy;
    lt.tx = position._x - (px * lt.a + py * lt.c);
    lt.ty = position._y - (px * lt.b + py * lt.d);
  }
  // / ///// color related stuff
  set alpha(value) {
    if (value === this.localAlpha)
      return;
    this.localAlpha = value;
    this._updateFlags |= UPDATE_COLOR;
    this._onUpdate();
  }
  /** The opacity of the object. */
  get alpha() {
    return this.localAlpha;
  }
  set tint(value) {
    const tempColor = Color.Color.shared.setValue(value ?? 16777215);
    const bgr = tempColor.toBgrNumber();
    if (bgr === this.localColor)
      return;
    this.localColor = bgr;
    this._updateFlags |= UPDATE_COLOR;
    this._onUpdate();
  }
  /**
   * The tint applied to the sprite. This is a hex value.
   *
   * A value of 0xFFFFFF will remove any tint effect.
   * @default 0xFFFFFF
   */
  get tint() {
    const bgr = this.localColor;
    return ((bgr & 255) << 16) + (bgr & 65280) + (bgr >> 16 & 255);
  }
  // / //////////////// blend related stuff
  set blendMode(value) {
    if (this.localBlendMode === value)
      return;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateFlags |= UPDATE_BLEND;
    this.localBlendMode = value;
    this._onUpdate();
  }
  /**
   * The blend mode to be applied to the sprite. Apply a value of `'normal'` to reset the blend mode.
   * @default 'normal'
   */
  get blendMode() {
    return this.localBlendMode;
  }
  // / ///////// VISIBILITY / RENDERABLE /////////////////
  /** The visibility of the object. If false the object will not be drawn, and the transform will not be updated. */
  get visible() {
    return !!(this.localDisplayStatus & 2);
  }
  set visible(value) {
    const valueNumber = value ? 2 : 0;
    if ((this.localDisplayStatus & 2) === valueNumber)
      return;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateFlags |= UPDATE_VISIBLE;
    this.localDisplayStatus ^= 2;
    this._onUpdate();
  }
  /** @ignore */
  get culled() {
    return !(this.localDisplayStatus & 4);
  }
  /** @ignore */
  set culled(value) {
    const valueNumber = value ? 0 : 4;
    if ((this.localDisplayStatus & 4) === valueNumber)
      return;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateFlags |= UPDATE_VISIBLE;
    this.localDisplayStatus ^= 4;
    this._onUpdate();
  }
  /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
  get renderable() {
    return !!(this.localDisplayStatus & 1);
  }
  set renderable(value) {
    const valueNumber = value ? 1 : 0;
    if ((this.localDisplayStatus & 1) === valueNumber)
      return;
    this._updateFlags |= UPDATE_VISIBLE;
    this.localDisplayStatus ^= 1;
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._onUpdate();
  }
  /** Whether or not the object should be rendered. */
  get isRenderable() {
    return this.localDisplayStatus === 7 && this.groupAlpha > 0;
  }
  /**
   * Removes all internal references and listeners as well as removes children from the display list.
   * Do not use a Container after calling `destroy`.
   * @param options - Options parameter. A boolean will act as if all options
   *  have been set to that value
   * @param {boolean} [options.children=false] - if set to true, all the children will have their destroy
   *  method called as well. 'options' will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites. If options.children
   * is set to true it should destroy the texture of the child sprite
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true it should destroy the texture source of the child sprite
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true it should destroy the context of the child graphics
   */
  destroy(options = false) {
    if (this.destroyed)
      return;
    this.destroyed = true;
    const oldChildren = this.removeChildren(0, this.children.length);
    this.removeFromParent();
    this.parent = null;
    this._maskEffect = null;
    this._filterEffect = null;
    this.effects = null;
    this._position = null;
    this._scale = null;
    this._pivot = null;
    this._skew = null;
    this.emit("destroyed", this);
    this.removeAllListeners();
    const destroyChildren = typeof options === "boolean" ? options : options?.children;
    if (destroyChildren) {
      for (let i = 0; i < oldChildren.length; ++i) {
        oldChildren[i].destroy(options);
      }
    }
    this.renderGroup?.destroy();
    this.renderGroup = null;
  }
}
Container.mixin(childrenHelperMixin.childrenHelperMixin);
Container.mixin(toLocalGlobalMixin.toLocalGlobalMixin);
Container.mixin(onRenderMixin.onRenderMixin);
Container.mixin(measureMixin.measureMixin);
Container.mixin(effectsMixin.effectsMixin);
Container.mixin(findMixin.findMixin);
Container.mixin(sortMixin.sortMixin);
Container.mixin(cullingMixin.cullingMixin);

exports.Container = Container;
exports.UPDATE_BLEND = UPDATE_BLEND;
exports.UPDATE_COLOR = UPDATE_COLOR;
exports.UPDATE_TRANSFORM = UPDATE_TRANSFORM;
exports.UPDATE_VISIBLE = UPDATE_VISIBLE;
//# sourceMappingURL=Container.js.map
