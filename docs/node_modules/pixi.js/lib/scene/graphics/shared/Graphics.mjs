import { deprecation, v8_0_0 } from '../../../utils/logging/deprecation.mjs';
import { ViewContainer } from '../../view/View.mjs';
import { GraphicsContext } from './GraphicsContext.mjs';

"use strict";
class Graphics extends ViewContainer {
  /**
   * @param options - Options for the Graphics.
   */
  constructor(options) {
    if (options instanceof GraphicsContext) {
      options = { context: options };
    }
    const { context, roundPixels, ...rest } = options || {};
    super({
      label: "Graphics",
      ...rest
    });
    this.renderPipeId = "graphics";
    if (!context) {
      this._context = this._ownedContext = new GraphicsContext();
    } else {
      this._context = context;
    }
    this._context.on("update", this.onViewUpdate, this);
    this.allowChildren = false;
    this.roundPixels = roundPixels ?? false;
  }
  set context(context) {
    if (context === this._context)
      return;
    this._context.off("update", this.onViewUpdate, this);
    this._context = context;
    this._context.on("update", this.onViewUpdate, this);
    this.onViewUpdate();
  }
  get context() {
    return this._context;
  }
  /**
   * The local bounds of the graphic.
   * @type {rendering.Bounds}
   */
  get bounds() {
    return this._context.bounds;
  }
  /**
   * Adds the bounds of this object to the bounds object.
   * @param bounds - The output bounds object.
   */
  addBounds(bounds) {
    bounds.addBounds(this._context.bounds);
  }
  /**
   * Checks if the object contains the given point.
   * @param point - The point to check
   */
  containsPoint(point) {
    return this._context.containsPoint(point);
  }
  onViewUpdate() {
    this._didViewChangeTick++;
    this._didGraphicsUpdate = true;
    if (this.didViewUpdate)
      return;
    this.didViewUpdate = true;
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.onChildViewUpdate(this);
    }
  }
  /**
   * Destroys this graphics renderable and optionally its context.
   * @param options - Options parameter. A boolean will act as if all options
   *
   * If the context was created by this graphics and `destroy(false)` or `destroy()` is called
   * then the context will still be destroyed.
   *
   * If you want to explicitly not destroy this context that this graphics created,
   * then you should pass destroy({ context: false })
   *
   * If the context was passed in as an argument to the constructor then it will not be destroyed
   * @param {boolean} [options.texture=false] - Should destroy the texture of the graphics context
   * @param {boolean} [options.textureSource=false] - Should destroy the texture source of the graphics context
   * @param {boolean} [options.context=false] - Should destroy the context
   */
  destroy(options) {
    if (this._ownedContext && !options) {
      this._ownedContext.destroy(options);
    } else if (options === true || options?.context === true) {
      this._context.destroy(options);
    }
    this._ownedContext = null;
    this._context = null;
    super.destroy(options);
  }
  _callContextMethod(method, args) {
    this.context[method](...args);
    return this;
  }
  // --------------------------------------- GraphicsContext methods ---------------------------------------
  /**
   * Sets the current fill style of the graphics context. The fill style can be a color, gradient,
   * pattern, or a more complex style defined by a FillStyle object.
   * @param {FillInput} args - The fill style to apply. This can be a simple color, a gradient or
   * pattern object, or a FillStyle or ConvertedFillStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setFillStyle(...args) {
    return this._callContextMethod("setFillStyle", args);
  }
  /**
   * Sets the current stroke style of the graphics context. Similar to fill styles, stroke styles can
   * encompass colors, gradients, patterns, or more detailed configurations via a StrokeStyle object.
   * @param {StrokeInput} args - The stroke style to apply. Can be defined as a color, a gradient or pattern,
   * or a StrokeStyle or ConvertedStrokeStyle object.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  setStrokeStyle(...args) {
    return this._callContextMethod("setStrokeStyle", args);
  }
  fill(...args) {
    return this._callContextMethod("fill", args);
  }
  /**
   * Strokes the current path with the current stroke style. This method can take an optional
   * FillStyle parameter to define the stroke's appearance, including its color, width, and other properties.
   * @param {FillStyle} args - (Optional) The stroke style to apply. Can be defined as a simple color or a more
   * complex style object. If omitted, uses the current stroke style.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  stroke(...args) {
    return this._callContextMethod("stroke", args);
  }
  texture(...args) {
    return this._callContextMethod("texture", args);
  }
  /**
   * Resets the current path. Any previous path and its commands are discarded and a new path is
   * started. This is typically called before beginning a new shape or series of drawing commands.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  beginPath() {
    return this._callContextMethod("beginPath", []);
  }
  /**
   * Applies a cutout to the last drawn shape. This is used to create holes or complex shapes by
   * subtracting a path from the previously drawn path. If a hole is not completely in a shape, it will
   * fail to cut correctly!
   */
  cut() {
    return this._callContextMethod("cut", []);
  }
  arc(...args) {
    return this._callContextMethod("arc", args);
  }
  arcTo(...args) {
    return this._callContextMethod("arcTo", args);
  }
  arcToSvg(...args) {
    return this._callContextMethod("arcToSvg", args);
  }
  bezierCurveTo(...args) {
    return this._callContextMethod("bezierCurveTo", args);
  }
  /**
   * Closes the current path by drawing a straight line back to the start.
   * If the shape is already closed or there are no points in the path, this method does nothing.
   * @returns The instance of the current object for chaining.
   */
  closePath() {
    return this._callContextMethod("closePath", []);
  }
  ellipse(...args) {
    return this._callContextMethod("ellipse", args);
  }
  circle(...args) {
    return this._callContextMethod("circle", args);
  }
  path(...args) {
    return this._callContextMethod("path", args);
  }
  lineTo(...args) {
    return this._callContextMethod("lineTo", args);
  }
  moveTo(...args) {
    return this._callContextMethod("moveTo", args);
  }
  quadraticCurveTo(...args) {
    return this._callContextMethod("quadraticCurveTo", args);
  }
  rect(...args) {
    return this._callContextMethod("rect", args);
  }
  roundRect(...args) {
    return this._callContextMethod("roundRect", args);
  }
  poly(...args) {
    return this._callContextMethod("poly", args);
  }
  regularPoly(...args) {
    return this._callContextMethod("regularPoly", args);
  }
  roundPoly(...args) {
    return this._callContextMethod("roundPoly", args);
  }
  roundShape(...args) {
    return this._callContextMethod("roundShape", args);
  }
  filletRect(...args) {
    return this._callContextMethod("filletRect", args);
  }
  chamferRect(...args) {
    return this._callContextMethod("chamferRect", args);
  }
  star(...args) {
    return this._callContextMethod("star", args);
  }
  svg(...args) {
    return this._callContextMethod("svg", args);
  }
  restore(...args) {
    return this._callContextMethod("restore", args);
  }
  /** Saves the current graphics state, including transformations, fill styles, and stroke styles, onto a stack. */
  save() {
    return this._callContextMethod("save", []);
  }
  /**
   * Returns the current transformation matrix of the graphics context.
   * @returns The current transformation matrix.
   */
  getTransform() {
    return this.context.getTransform();
  }
  /**
   * Resets the current transformation matrix to the identity matrix, effectively removing
   * any transformations (rotation, scaling, translation) previously applied.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  resetTransform() {
    return this._callContextMethod("resetTransform", []);
  }
  rotateTransform(...args) {
    return this._callContextMethod("rotate", args);
  }
  scaleTransform(...args) {
    return this._callContextMethod("scale", args);
  }
  setTransform(...args) {
    return this._callContextMethod("setTransform", args);
  }
  transform(...args) {
    return this._callContextMethod("transform", args);
  }
  translateTransform(...args) {
    return this._callContextMethod("translate", args);
  }
  /**
   * Clears all drawing commands from the graphics context, effectively resetting it. This includes clearing the path,
   * and optionally resetting transformations to the identity matrix.
   * @returns The instance of the current GraphicsContext for method chaining.
   */
  clear() {
    return this._callContextMethod("clear", []);
  }
  /**
   * The fill style to use.
   * @type {ConvertedFillStyle}
   */
  get fillStyle() {
    return this._context.fillStyle;
  }
  set fillStyle(value) {
    this._context.fillStyle = value;
  }
  /**
   * The stroke style to use.
   * @type {ConvertedStrokeStyle}
   */
  get strokeStyle() {
    return this._context.strokeStyle;
  }
  set strokeStyle(value) {
    this._context.strokeStyle = value;
  }
  /**
   * Creates a new Graphics object.
   * Note that only the context of the object is cloned, not its transform (position,scale,etc)
   * @param deep - Whether to create a deep clone of the graphics object. If false, the context
   * will be shared between the two objects (default false). If true, the context will be
   * cloned (recommended if you need to modify the context in any way).
   * @returns - A clone of the graphics object
   */
  clone(deep = false) {
    if (deep) {
      return new Graphics(this._context.clone());
    }
    this._ownedContext = null;
    const clone = new Graphics(this._context);
    return clone;
  }
  // -------- v7 deprecations ---------
  /**
   * @param width
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#setStrokeStyle} instead
   */
  lineStyle(width, color, alpha) {
    deprecation(v8_0_0, "Graphics#lineStyle is no longer needed. Use Graphics#setStrokeStyle to set the stroke style.");
    const strokeStyle = {};
    width && (strokeStyle.width = width);
    color && (strokeStyle.color = color);
    alpha && (strokeStyle.alpha = alpha);
    this.context.strokeStyle = strokeStyle;
    return this;
  }
  /**
   * @param color
   * @param alpha
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  beginFill(color, alpha) {
    deprecation(v8_0_0, "Graphics#beginFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    const fillStyle = {};
    color && (fillStyle.color = color);
    alpha && (fillStyle.alpha = alpha);
    this.context.fillStyle = fillStyle;
    return this;
  }
  /**
   * @deprecated since 8.0.0 Use {@link Graphics#fill} instead
   */
  endFill() {
    deprecation(v8_0_0, "Graphics#endFill is no longer needed. Use Graphics#fill to fill the shape with the desired style.");
    this.context.fill();
    const strokeStyle = this.context.strokeStyle;
    if (strokeStyle.width !== GraphicsContext.defaultStrokeStyle.width || strokeStyle.color !== GraphicsContext.defaultStrokeStyle.color || strokeStyle.alpha !== GraphicsContext.defaultStrokeStyle.alpha) {
      this.context.stroke();
    }
    return this;
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#circle} instead
   */
  drawCircle(...args) {
    deprecation(v8_0_0, "Graphics#drawCircle has been renamed to Graphics#circle");
    return this._callContextMethod("circle", args);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#ellipse} instead
   */
  drawEllipse(...args) {
    deprecation(v8_0_0, "Graphics#drawEllipse has been renamed to Graphics#ellipse");
    return this._callContextMethod("ellipse", args);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#poly} instead
   */
  drawPolygon(...args) {
    deprecation(v8_0_0, "Graphics#drawPolygon has been renamed to Graphics#poly");
    return this._callContextMethod("poly", args);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#rect} instead
   */
  drawRect(...args) {
    deprecation(v8_0_0, "Graphics#drawRect has been renamed to Graphics#rect");
    return this._callContextMethod("rect", args);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#roundRect} instead
   */
  drawRoundedRect(...args) {
    deprecation(v8_0_0, "Graphics#drawRoundedRect has been renamed to Graphics#roundRect");
    return this._callContextMethod("roundRect", args);
  }
  /**
   * @param {...any} args
   * @deprecated since 8.0.0 Use {@link Graphics#star} instead
   */
  drawStar(...args) {
    deprecation(v8_0_0, "Graphics#drawStar has been renamed to Graphics#star");
    return this._callContextMethod("star", args);
  }
}

export { Graphics };
//# sourceMappingURL=Graphics.mjs.map
