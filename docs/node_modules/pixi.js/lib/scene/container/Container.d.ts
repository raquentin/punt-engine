import EventEmitter from 'eventemitter3';
import { type ColorSource } from '../../color/Color';
import { Matrix } from '../../maths/matrix/Matrix';
import { ObservablePoint } from '../../maths/point/ObservablePoint';
import { RenderGroup } from './RenderGroup';
import type { Size } from '../../maths/misc/Size';
import type { PointData } from '../../maths/point/PointData';
import type { Rectangle } from '../../maths/shapes/Rectangle';
import type { BLEND_MODES } from '../../rendering/renderers/shared/state/const';
import type { Dict } from '../../utils/types';
import type { Optional } from './container-mixins/measureMixin';
import type { DestroyOptions } from './destroyTypes';
export type ContainerChild = Container;
export interface ContainerEvents<C extends ContainerChild> extends PixiMixins.ContainerEvents {
    added: [container: Container];
    childAdded: [child: C, container: Container, index: number];
    removed: [container: Container];
    childRemoved: [child: C, container: Container, index: number];
    destroyed: [container: Container];
}
type AnyEvent = {
    [K: ({} & string) | ({} & symbol)]: any;
};
export declare const UPDATE_COLOR = 1;
export declare const UPDATE_BLEND = 2;
export declare const UPDATE_VISIBLE = 4;
export declare const UPDATE_TRANSFORM = 8;
export interface UpdateTransformOptions {
    x: number;
    y: number;
    scaleX: number;
    scaleY: number;
    rotation: number;
    skewX: number;
    skewY: number;
    pivotX: number;
    pivotY: number;
}
/**
 * Constructor options used for `Container` instances.
 * ```js
 * const container = new Container({
 *    position: new Point(100, 200),
 *    scale: new Point(2, 2),
 *    rotation: Math.PI / 2,
 * });
 * ```
 * @memberof scene
 * @see scene.Container
 */
export interface ContainerOptions<C extends ContainerChild = ContainerChild> extends PixiMixins.ContainerOptions {
    /** @see scene.Container#isRenderGroup */
    isRenderGroup?: boolean;
    /** @see scene.Container#blendMode */
    blendMode?: BLEND_MODES;
    /** @see scene.Container#tint */
    tint?: ColorSource;
    /** @see scene.Container#alpha */
    alpha?: number;
    /** @see scene.Container#angle */
    angle?: number;
    /** @see scene.Container#children */
    children?: C[];
    /** @see scene.Container#parent */
    parent?: Container;
    /** @see scene.Container#renderable */
    renderable?: boolean;
    /** @see scene.Container#rotation */
    rotation?: number;
    /** @see scene.Container#scale */
    scale?: PointData | number;
    /** @see scene.Container#pivot */
    pivot?: PointData | number;
    /** @see scene.Container#position */
    position?: PointData;
    /** @see scene.Container#skew */
    skew?: PointData;
    /** @see scene.Container#visible */
    visible?: boolean;
    /** @see scene.Container#x */
    x?: number;
    /** @see scene.Container#y */
    y?: number;
    /** @see scene.Container#boundArea */
    boundsArea?: Rectangle;
}
export interface Container<C extends ContainerChild> extends PixiMixins.Container<C>, EventEmitter<ContainerEvents<C> & AnyEvent> {
}
/**
 * Container is a general-purpose display object that holds children. It also adds built-in support for advanced
 * rendering features like masking and filtering.
 *
 * It is the base class of all display objects that act as a container for other objects, including Graphics
 * and Sprite.
 *
 * <details id="transforms">
 *
 * <summary>Transforms</summary>
 *
 * The [transform]{@link scene.Container#transform} of a display object describes the projection from its
 * local coordinate space to its parent's local coordinate space. The following properties are derived
 * from the transform:
 *
 * <table>
 *   <thead>
 *     <tr>
 *       <th>Property</th>
 *       <th>Description</th>
 *     </tr>
 *   </thead>
 *   <tbody>
 *     <tr>
 *       <td>[pivot]{@link scene.Container#pivot}</td>
 *       <td>
 *         Invariant under rotation, scaling, and skewing. The projection of into the parent's space of the pivot
 *         is equal to position, regardless of the other three transformations. In other words, It is the center of
 *         rotation, scaling, and skewing.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>[position]{@link scene.Container#position}</td>
 *       <td>
 *         Translation. This is the position of the [pivot]{@link scene.Container#pivot} in the parent's local
 *         space. The default value of the pivot is the origin (0,0). If the top-left corner of your display object
 *         is (0,0) in its local space, then the position will be its top-left corner in the parent's local space.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>[scale]{@link scene.Container#scale}</td>
 *       <td>
 *         Scaling. This will stretch (or compress) the display object's projection. The scale factors are along the
 *         local coordinate axes. In other words, the display object is scaled before rotated or skewed. The center
 *         of scaling is the [pivot]{@link scene.Container#pivot}.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>[rotation]{@link scene.Container#rotation}</td>
 *       <td>
 *          Rotation. This will rotate the display object's projection by this angle (in radians).
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>[skew]{@link scene.Container#skew}</td>
 *       <td>
 *         <p>Skewing. This can be used to deform a rectangular display object into a parallelogram.</p>
 *         <p>
 *         In PixiJS, skew has a slightly different behaviour than the conventional meaning. It can be
 *         thought of the net rotation applied to the coordinate axes (separately). For example, if "skew.x" is
 *         ⍺ and "skew.y" is β, then the line x = 0 will be rotated by ⍺ (y = -x*cot⍺) and the line y = 0 will be
 *         rotated by β (y = x*tanβ). A line y = x*tanϴ (i.e. a line at angle ϴ to the x-axis in local-space) will
 *         be rotated by an angle between ⍺ and β.
 *         </p>
 *         <p>
 *         It can be observed that if skew is applied equally to both axes, then it will be equivalent to applying
 *         a rotation. Indeed, if "skew.x" = -ϴ and "skew.y" = ϴ, it will produce an equivalent of "rotation" = ϴ.
 *         </p>
 *         <p>
 *         Another quite interesting observation is that "skew.x", "skew.y", rotation are commutative operations. Indeed,
 *         because rotation is essentially a careful combination of the two.
 *         </p>
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>[angle]{@link scene.Container#angle}</td>
 *       <td>Rotation. This is an alias for [rotation]{@link scene.Container#rotation}, but in degrees.</td>
 *     </tr>
 *     <tr>
 *       <td>[x]{@link scene.Container#x}</td>
 *       <td>Translation. This is an alias for position.x!</td>
 *     </tr>
 *     <tr>
 *       <td>[y]{@link scene.Container#y}</td>
 *       <td>Translation. This is an alias for position.y!</td>
 *     </tr>
 *     <tr>
 *       <td>[width]{@link scene.Container#width}</td>
 *       <td>
 *         Implemented in [Container]{@link scene.Container}. Scaling. The width property calculates scale.x by dividing
 *         the "requested" width by the local bounding box width. It is indirectly an abstraction over scale.x, and there
 *         is no concept of user-defined width.
 *       </td>
 *     </tr>
 *     <tr>
 *       <td>[height]{@link scene.Container#height}</td>
 *       <td>
 *         Implemented in [Container]{@link scene.Container}. Scaling. The height property calculates scale.y by dividing
 *         the "requested" height by the local bounding box height. It is indirectly an abstraction over scale.y, and there
 *         is no concept of user-defined height.
 *       </td>
 *     </tr>
 *   </tbody>
 * </table>
 * </details>
 *
 * <details id="alpha">
 * <summary>Alpha</summary>
 *
 * This alpha sets a display object's **relative opacity** w.r.t its parent. For example, if the alpha of a display
 * object is 0.5 and its parent's alpha is 0.5, then it will be rendered with 25% opacity (assuming alpha is not
 * applied on any ancestor further up the chain).
 * </details>
 *
 * <details id="visible">
 * <summary>Renderable vs Visible</summary>
 *
 * The `renderable` and `visible` properties can be used to prevent a display object from being rendered to the
 * screen. However, there is a subtle difference between the two. When using `renderable`, the transforms  of the display
 * object (and its children subtree) will continue to be calculated. When using `visible`, the transforms will not
 * be calculated.
 * ```ts
 * import { BlurFilter, Container, Graphics, Sprite } from 'pixi.js';
 *
 * const container = new Container();
 * const sprite = Sprite.from('https://s3-us-west-2.amazonaws.com/s.cdpn.io/693612/IaUrttj.png');
 *
 * sprite.width = 512;
 * sprite.height = 512;
 *
 * // Adds a sprite as a child to this container. As a result, the sprite will be rendered whenever the container
 * // is rendered.
 * container.addChild(sprite);
 *
 * // Blurs whatever is rendered by the container
 * container.filters = [new BlurFilter()];
 *
 * // Only the contents within a circle at the center should be rendered onto the screen.
 * container.mask = new Graphics()
 *     .beginFill(0xffffff)
 *     .drawCircle(sprite.width / 2, sprite.height / 2, Math.min(sprite.width, sprite.height) / 2)
 *     .endFill();
 * ```
 *
 * </details>
 *
 * <details id="renderGroup">
 * <summary>RenderGroup</summary>
 *
 * In PixiJS v8, containers can be set to operate in 'render group mode',
 * transforming them into entities akin to a stage in traditional rendering paradigms.
 * A render group is a root renderable entity, similar to a container,
 * but it's rendered in a separate pass with its own unique set of rendering instructions.
 * This approach enhances rendering efficiency and organization, particularly in complex scenes.
 *
 * You can enable render group mode on any container using container.enableRenderGroup()
 * or by initializing a new container with the render group property set to true (new Container({isRenderGroup: true})).
 *  The method you choose depends on your specific use case and setup requirements.
 *
 * An important aspect of PixiJS’s rendering process is the automatic treatment of rendered scenes as render groups.
 * This conversion streamlines the rendering process, but understanding when and how this happens is crucial
 * to fully leverage its benefits.
 *
 * One of the key advantages of using render groups is the performance efficiency in moving them. Since transformations
 *  are applied at the GPU level, moving a render group, even one with complex and numerous children,
 * doesn't require recalculating the rendering instructions or performing transformations on each child.
 * This makes operations like panning a large game world incredibly efficient.
 *
 * However, it's crucial to note that render groups do not batch together.
 * This means that turning every container into a render group could actually slow things down,
 * as each render group is processed separately. It's best to use render groups judiciously, at a broader level,
 * rather than on a per-child basis.
 * This approach ensures you get the performance benefits without overburdening the rendering process.
 *
 * RenderGroups maintain their own set of rendering instructions,
 * ensuring that changes or updates within a render group don't affect the rendering
 * instructions of its parent or other render groups.
 *  This isolation ensures more stable and predictable rendering behavior.
 *
 * Additionally, renderGroups can be nested, allowing for powerful options in organizing different aspects of your scene.
 * This feature is particularly beneficial for separating complex game graphics from UI elements,
 * enabling intricate and efficient scene management in complex applications.
 *
 * This means that Containers have 3 levels of matrix to be mindful of:
 *
 * 1. localTransform, this is the transform of the container based on its own properties
 * 2. groupTransform, this it the transform of the container relative to the renderGroup it belongs too
 * 3. worldTransform, this is the transform of the container relative to the Scene being rendered
 * </details>
 * @memberof scene
 */
export declare class Container<C extends ContainerChild = ContainerChild> extends EventEmitter<ContainerEvents<C> & AnyEvent> {
    /**
     * Mixes all enumerable properties and methods from a source object to Container.
     * @param source - The source of properties and methods to mix in.
     */
    static mixin(source: Dict<any>): void;
    /** unique id for this container */
    readonly uid: number;
    /** @private */
    _updateFlags: number;
    /** @private */
    renderGroup: RenderGroup;
    /** @private */
    parentRenderGroup: RenderGroup;
    /** @private */
    parentRenderGroupIndex: number;
    /** @private */
    didChange: boolean;
    /** @private */
    didViewUpdate: boolean;
    /** @private */
    relativeRenderGroupDepth: number;
    /**
     * The array of children of this container.
     * @readonly
     */
    children: C[];
    /** The display object container that contains this display object. */
    parent: Container;
    /** @private */
    includeInBuild: boolean;
    /** @private */
    measurable: boolean;
    /** @private */
    isSimple: boolean;
    /**
     * @internal
     * @ignore
     */
    updateTick: number;
    /**
     * Current transform of the object based on local factors: position, scale, other stuff.
     * @readonly
     */
    localTransform: Matrix;
    /**
     * The relative group transform is a transform relative to the render group it belongs too. It will include all parent
     * transforms and up to the render group (think of it as kind of like a stage - but the stage can be nested).
     * If this container is is self a render group matrix will be relative to its parent render group
     * @readonly
     */
    relativeGroupTransform: Matrix;
    /**
     * The group transform is a transform relative to the render group it belongs too.
     * If this container is render group then this will be an identity matrix. other wise it
     * will be the same as the relativeGroupTransform.
     * Use this value when actually rendering things to the screen
     * @readonly
     */
    groupTransform: Matrix;
    private _worldTransform;
    /** If the object has been destroyed via destroy(). If true, it should not be used. */
    destroyed: boolean;
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * @internal
     * @ignore
     */
    _position: ObservablePoint;
    /**
     * The scale factor of the object.
     * @internal
     * @ignore
     */
    _scale: ObservablePoint;
    /**
     * The pivot point of the container that it rotates around.
     * @internal
     * @ignore
     */
    _pivot: ObservablePoint;
    /**
     * The skew amount, on the x and y axis.
     * @internal
     * @ignore
     */
    _skew: ObservablePoint;
    /**
     * The X-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    _cx: number;
    /**
     * The Y-coordinate value of the normalized local X axis,
     * the first column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    _sx: number;
    /**
     * The X-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    _cy: number;
    /**
     * The Y-coordinate value of the normalized local Y axis,
     * the second column of the local transformation matrix without a scale.
     * @internal
     * @ignore
     */
    _sy: number;
    /**
     * The rotation amount.
     * @internal
     * @ignore
     */
    private _rotation;
    localColor: number;
    localAlpha: number;
    groupAlpha: number;
    groupColor: number;
    groupColorAlpha: number;
    /**
     * @internal
     * @ignore
     */
    localBlendMode: BLEND_MODES;
    /**
     * @internal
     * @ignore
     */
    groupBlendMode: BLEND_MODES;
    /**
     * This property holds three bits: culled, visible, renderable
     * the third bit represents culling (0 = culled, 1 = not culled) 0b100
     * the second bit represents visibility (0 = not visible, 1 = visible) 0b010
     * the first bit represents renderable (0 = not renderable, 1 = renderable) 0b001
     * @internal
     * @ignore
     */
    localDisplayStatus: number;
    /**
     * @internal
     * @ignore
     */
    globalDisplayStatus: number;
    readonly renderPipeId: string;
    /**
     * An optional bounds area for this container. Setting this rectangle will stop the renderer
     * from recursively measuring the bounds of each children and instead use this single boundArea.
     * This is great for optimisation! If for example you have a 1000 spinning particles and you know they all sit
     * within a specific bounds, then setting it will mean the renderer will not need to measure the
     * 1000 children to find the bounds. Instead it will just use the bounds you set.
     */
    boundsArea: Rectangle;
    /**
     * A value that increments each time the containe is modified
     * eg children added, removed etc
     * @ignore
     */
    _didContainerChangeTick: number;
    /**
     * A value that increments each time the container view is modified
     * eg texture swap, geometry change etc
     * @ignore
     */
    _didViewChangeTick: number;
    /**
     * We now use the _didContainerChangeTick and _didViewChangeTick to track changes
     * @deprecated since 8.2.6
     * @ignore
     */
    set _didChangeId(value: number);
    get _didChangeId(): number;
    /**
     * property that tracks if the container transform has changed
     * @ignore
     */
    private _didLocalTransformChangeId;
    constructor(options?: ContainerOptions<C>);
    /**
     * Adds one or more children to the container.
     *
     * Multiple items can be added like so: `myContainer.addChild(thingOne, thingTwo, thingThree)`
     * @param {...Container} children - The Container(s) to add to the container
     * @returns {Container} - The first child that was added.
     */
    addChild<U extends C[]>(...children: U): U[0];
    /**
     * Removes one or more children from the container.
     * @param {...Container} children - The Container(s) to remove
     * @returns {Container} The first child that was removed.
     */
    removeChild<U extends C[]>(...children: U): U[0];
    /** @ignore */
    _onUpdate(point?: ObservablePoint): void;
    set isRenderGroup(value: boolean);
    /**
     * Returns true if this container is a render group.
     * This means that it will be rendered as a separate pass, with its own set of instructions
     */
    get isRenderGroup(): boolean;
    /**
     * Calling this enables a render group for this container.
     * This means it will be rendered as a separate set of instructions.
     * The transform of the container will also be handled on the GPU rather than the CPU.
     */
    enableRenderGroup(): void;
    /** This will disable the render group for this container. */
    disableRenderGroup(): void;
    /** @ignore */
    _updateIsSimple(): void;
    /**
     * Current transform of the object based on world (parent) factors.
     * @readonly
     */
    get worldTransform(): Matrix;
    /**
     * The position of the container on the x axis relative to the local coordinates of the parent.
     * An alias to position.x
     */
    get x(): number;
    set x(value: number);
    /**
     * The position of the container on the y axis relative to the local coordinates of the parent.
     * An alias to position.y
     */
    get y(): number;
    set y(value: number);
    /**
     * The coordinate of the object relative to the local coordinates of the parent.
     * @since 4.0.0
     */
    get position(): ObservablePoint;
    set position(value: PointData);
    /**
     * The rotation of the object in radians.
     * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
     */
    get rotation(): number;
    set rotation(value: number);
    /**
     * The angle of the object in degrees.
     * 'rotation' and 'angle' have the same effect on a display object; rotation is in radians, angle is in degrees.
     */
    get angle(): number;
    set angle(value: number);
    /**
     * The center of rotation, scaling, and skewing for this display object in its local space. The `position`
     * is the projection of `pivot` in the parent's local space.
     *
     * By default, the pivot is the origin (0, 0).
     * @since 4.0.0
     */
    get pivot(): ObservablePoint;
    set pivot(value: PointData | number);
    /**
     * The skew factor for the object in radians.
     * @since 4.0.0
     */
    get skew(): ObservablePoint;
    set skew(value: PointData);
    /**
     * The scale factors of this object along the local coordinate axes.
     *
     * The default scale is (1, 1).
     * @since 4.0.0
     */
    get scale(): ObservablePoint;
    set scale(value: PointData | number);
    /**
     * The width of the Container, setting this will actually modify the scale to achieve the value set.
     * @memberof scene.Container#
     */
    get width(): number;
    set width(value: number);
    /**
     * The height of the Container, setting this will actually modify the scale to achieve the value set.
     * @memberof scene.Container#
     */
    get height(): number;
    set height(value: number);
    /**
     * Retrieves the size of the container as a [Size]{@link Size} object.
     * This is faster than get the width and height separately.
     * @param out - Optional object to store the size in.
     * @returns - The size of the container.
     * @memberof scene.Container#
     */
    getSize(out?: Size): Size;
    /**
     * Sets the size of the container to the specified width and height.
     * This is faster than setting the width and height separately.
     * @param value - This can be either a number or a [Size]{@link Size} object.
     * @param height - The height to set. Defaults to the value of `width` if not provided.
     * @memberof scene.Container#
     */
    setSize(value: number | Optional<Size, 'height'>, height?: number): void;
    /** Called when the skew or the rotation changes. */
    private _updateSkew;
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
    updateTransform(opts: Partial<UpdateTransformOptions>): this;
    /**
     * Updates the local transform using the given matrix.
     * @param matrix - The matrix to use for updating the transform.
     */
    setFromMatrix(matrix: Matrix): void;
    /** Updates the local transform. */
    updateLocalTransform(): void;
    set alpha(value: number);
    /** The opacity of the object. */
    get alpha(): number;
    set tint(value: ColorSource);
    /**
     * The tint applied to the sprite. This is a hex value.
     *
     * A value of 0xFFFFFF will remove any tint effect.
     * @default 0xFFFFFF
     */
    get tint(): number;
    set blendMode(value: BLEND_MODES);
    /**
     * The blend mode to be applied to the sprite. Apply a value of `'normal'` to reset the blend mode.
     * @default 'normal'
     */
    get blendMode(): BLEND_MODES;
    /** The visibility of the object. If false the object will not be drawn, and the transform will not be updated. */
    get visible(): boolean;
    set visible(value: boolean);
    /** @ignore */
    get culled(): boolean;
    /** @ignore */
    set culled(value: boolean);
    /** Can this object be rendered, if false the object will not be drawn but the transform will still be updated. */
    get renderable(): boolean;
    set renderable(value: boolean);
    /** Whether or not the object should be rendered. */
    get isRenderable(): boolean;
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
    destroy(options?: DestroyOptions): void;
}
export {};
