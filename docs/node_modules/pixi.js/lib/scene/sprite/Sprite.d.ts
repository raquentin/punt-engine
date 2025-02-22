import { ObservablePoint } from '../../maths/point/ObservablePoint';
import { Texture } from '../../rendering/renderers/shared/texture/Texture';
import { ViewContainer } from '../view/View';
import type { Size } from '../../maths/misc/Size';
import type { PointData } from '../../maths/point/PointData';
import type { TextureSourceLike } from '../../rendering/renderers/shared/texture/Texture';
import type { Bounds, BoundsData } from '../container/bounds/Bounds';
import type { ContainerOptions } from '../container/Container';
import type { Optional } from '../container/container-mixins/measureMixin';
import type { DestroyOptions } from '../container/destroyTypes';
/**
 * Options for the {@link scene.Sprite} constructor.
 * @memberof scene
 */
export interface SpriteOptions extends ContainerOptions {
    /** The texture to use for the sprite. */
    texture?: Texture;
    /** The anchor point of the sprite. */
    anchor?: PointData | number;
    /** Whether or not to round the x/y position. */
    roundPixels?: boolean;
}
/**
 * The Sprite object is one of the most important objects in PixiJS. It is a
 * drawing item that can be added to a scene and rendered to the screen.
 *
 * A sprite can be created directly from an image like this:
 *
 * ```js
 * import { Sprite } from 'pixi.js';
 *
 * const sprite = Sprite.from('assets/image.png');
 * ```
 *
 * The more efficient way to create sprites is using a {@link assets.Spritesheet},
 * as swapping base textures when rendering to the screen is inefficient.
 *
 * ```js
 * import { Assets, Sprite } from 'pixi.js';
 *
 * const sheet = await Assets.load('assets/spritesheet.json');
 * const sprite = new Sprite(sheet.textures['image.png']);
 * ```
 * @memberof scene
 * @extends scene.Container
 */
export declare class Sprite extends ViewContainer {
    /**
     * Helper function that creates a new sprite based on the source you provide.
     * The source can be - frame id, image, video, canvas element, video element, texture
     * @param source - Source to create texture from
     * @param [skipCache] - Whether to skip the cache or not
     * @returns The newly created sprite
     */
    static from(source: Texture | TextureSourceLike, skipCache?: boolean): Sprite;
    readonly renderPipeId: string;
    batched: boolean;
    readonly _anchor: ObservablePoint;
    _texture: Texture;
    _didSpriteUpdate: boolean;
    private readonly _sourceBounds;
    private _sourceBoundsDirty;
    private _width;
    private _height;
    /**
     * @param options - The options for creating the sprite.
     */
    constructor(options?: SpriteOptions | Texture);
    set texture(value: Texture);
    /** The texture that the sprite is using. */
    get texture(): Texture;
    /**
     * The local bounds of the sprite.
     * @type {rendering.Bounds}
     */
    get bounds(): Bounds;
    /**
     * The bounds of the sprite, taking the texture's trim into account.
     * @type {rendering.Bounds}
     */
    get sourceBounds(): BoundsData;
    /**
     * Checks if the object contains the given point.
     * @param point - The point to check
     */
    containsPoint(point: PointData): boolean;
    /**
     * Adds the bounds of this object to the bounds object.
     * @param bounds - The output bounds object.
     */
    addBounds(bounds: Bounds): void;
    onViewUpdate(): void;
    protected _updateBounds(): void;
    private _updateSourceBounds;
    /**
     * Destroys this sprite renderable and optionally its texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the current texture of the renderable as well
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the renderable as well
     */
    destroy(options?: DestroyOptions): void;
    /**
     * The anchor sets the origin point of the sprite. The default value is taken from the {@link Texture}
     * and passed to the constructor.
     *
     * The default is `(0,0)`, this means the sprite's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the sprite's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the sprite's origin point will be the bottom right corner.
     *
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     * @example
     * import { Sprite } from 'pixi.js';
     *
     * const sprite = new Sprite({texture: Texture.WHITE});
     * sprite.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
     */
    get anchor(): ObservablePoint;
    set anchor(value: PointData | number);
    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    get width(): number;
    set width(value: number);
    /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
    get height(): number;
    set height(value: number);
    /**
     * Retrieves the size of the Sprite as a [Size]{@link Size} object.
     * This is faster than get the width and height separately.
     * @param out - Optional object to store the size in.
     * @returns - The size of the Sprite.
     */
    getSize(out?: Size): Size;
    /**
     * Sets the size of the Sprite to the specified width and height.
     * This is faster than setting the width and height separately.
     * @param value - This can be either a number or a [Size]{@link Size} object.
     * @param height - The height to set. Defaults to the value of `width` if not provided.
     */
    setSize(value: number | Optional<Size, 'height'>, height?: number): void;
}
