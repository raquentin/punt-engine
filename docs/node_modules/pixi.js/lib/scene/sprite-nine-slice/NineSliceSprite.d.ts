import { Texture } from '../../rendering/renderers/shared/texture/Texture';
import { ViewContainer } from '../view/View';
import type { Size } from '../../maths/misc/Size';
import type { View } from '../../rendering/renderers/shared/view/View';
import type { Bounds, BoundsData } from '../container/bounds/Bounds';
import type { ContainerOptions } from '../container/Container';
import type { Optional } from '../container/container-mixins/measureMixin';
import type { DestroyOptions } from '../container/destroyTypes';
/**
 * Constructor options used for `NineSliceSprite` instances.
 * ```js
 * const nineSliceSprite = new NineSliceSprite({
 *    texture: Texture.from('button.png'),
 *    leftWidth: 20,
 *    topHeight: 20,
 *    rightWidth: 20,
 *    bottomHeight: 20,
 * });
 * ```
 * @see {@link scene.NineSliceSprite}
 * @memberof scene
 */
export interface NineSliceSpriteOptions extends ContainerOptions {
    /** The texture to use on the NineSliceSprite. */
    texture: Texture;
    /** Width of the left vertical bar (A) */
    leftWidth?: number;
    /** Height of the top horizontal bar (C) */
    topHeight?: number;
    /** Width of the right vertical bar (B) */
    rightWidth?: number;
    /** Height of the bottom horizontal bar (D) */
    bottomHeight?: number;
    /** Width of the NineSliceSprite, setting this will actually modify the vertices and not the UV's of this plane. */
    width?: number;
    /** Height of the NineSliceSprite, setting this will actually modify the vertices and not UV's of this plane. */
    height?: number;
    /** Whether or not to round the x/y position. */
    roundPixels?: boolean;
}
/**
 * The NineSliceSprite allows you to stretch a texture using 9-slice scaling. The corners will remain unscaled (useful
 * for buttons with rounded corners for example) and the other areas will be scaled horizontally and or vertically
 *
 * <pre>
 *      A                          B
 *    +---+----------------------+---+
 *  C | 1 |          2           | 3 |
 *    +---+----------------------+---+
 *    |   |                      |   |
 *    | 4 |          5           | 6 |
 *    |   |                      |   |
 *    +---+----------------------+---+
 *  D | 7 |          8           | 9 |
 *    +---+----------------------+---+
 *  When changing this objects width and/or height:
 *     areas 1 3 7 and 9 will remain unscaled.
 *     areas 2 and 8 will be stretched horizontally
 *     areas 4 and 6 will be stretched vertically
 *     area 5 will be stretched both horizontally and vertically
 * </pre>
 * @example
 * import { NineSliceSprite, Texture } from 'pixi.js';
 *
 * const plane9 = new NineSliceSprite(Texture.from('BoxWithRoundedCorners.png'), 15, 15, 15, 15);
 * @memberof scene
 */
export declare class NineSliceSprite extends ViewContainer implements View {
    /** The default options, used to override the initial values of any options passed in the constructor. */
    static defaultOptions: NineSliceSpriteOptions;
    readonly renderPipeId: string;
    _texture: Texture;
    batched: boolean;
    private _leftWidth;
    private _topHeight;
    private _rightWidth;
    private _bottomHeight;
    private _width;
    private _height;
    _didSpriteUpdate: boolean;
    /**
     * @param {scene.NineSliceSpriteOptions|Texture} options - Options to use
     * @param options.texture - The texture to use on the NineSliceSprite.
     * @param options.leftWidth - Width of the left vertical bar (A)
     * @param options.topHeight - Height of the top horizontal bar (C)
     * @param options.rightWidth - Width of the right vertical bar (B)
     * @param options.bottomHeight - Height of the bottom horizontal bar (D)
     * @param options.width - Width of the NineSliceSprite,
     * setting this will actually modify the vertices and not the UV's of this plane.
     * @param options.height - Height of the NineSliceSprite,
     * setting this will actually modify the vertices and not UV's of this plane.
     */
    constructor(options: NineSliceSpriteOptions | Texture);
    /** The local bounds of the view. */
    get bounds(): BoundsData;
    /** The width of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
    get width(): number;
    set width(value: number);
    /** The height of the NineSliceSprite, setting this will actually modify the vertices and UV's of this plane. */
    get height(): number;
    set height(value: number);
    /**
     * Sets the size of the NiceSliceSprite to the specified width and height.
     * setting this will actually modify the vertices and UV's of this plane
     * This is faster than setting the width and height separately.
     * @param value - This can be either a number or a [Size]{@link Size} object.
     * @param height - The height to set. Defaults to the value of `width` if not provided.
     */
    setSize(value: number | Optional<Size, 'height'>, height?: number): void;
    /**
     * Retrieves the size of the NineSliceSprite as a [Size]{@link Size} object.
     * This is faster than get the width and height separately.
     * @param out - Optional object to store the size in.
     * @returns - The size of the NineSliceSprite.
     */
    getSize(out?: Size): Size;
    /** The width of the left column (a) of the NineSliceSprite. */
    get leftWidth(): number;
    set leftWidth(value: number);
    /** The width of the right column (b) of the NineSliceSprite. */
    get topHeight(): number;
    set topHeight(value: number);
    /** The width of the right column (b) of the NineSliceSprite. */
    get rightWidth(): number;
    set rightWidth(value: number);
    /** The width of the right column (b) of the NineSliceSprite. */
    get bottomHeight(): number;
    set bottomHeight(value: number);
    /** The texture that the NineSliceSprite is using. */
    get texture(): Texture;
    set texture(value: Texture);
    /** The original width of the texture */
    get originalWidth(): number;
    /** The original height of the texture */
    get originalHeight(): number;
    protected onViewUpdate(): void;
    /**
     * Adds the bounds of this object to the bounds object.
     * @param bounds - The output bounds object.
     */
    addBounds(bounds: Bounds): void;
    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    destroy(options?: DestroyOptions): void;
}
/**
 * Please use the `NineSliceSprite` class instead.
 * @deprecated since 8.0.0
 * @memberof scene
 */
export declare class NineSlicePlane extends NineSliceSprite {
    constructor(options: NineSliceSpriteOptions | Texture);
    /** @deprecated since 8.0.0 */
    constructor(texture: Texture, leftWidth: number, topHeight: number, rightWidth: number, bottomHeight: number);
}
