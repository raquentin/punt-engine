import { ObservablePoint } from '../../maths/point/ObservablePoint';
import { ViewContainer } from '../view/View';
import type { Size } from '../../maths/misc/Size';
import type { PointData } from '../../maths/point/PointData';
import type { View } from '../../rendering/renderers/shared/view/View';
import type { Bounds } from '../container/bounds/Bounds';
import type { ContainerOptions } from '../container/Container';
import type { Optional } from '../container/container-mixins/measureMixin';
import type { DestroyOptions } from '../container/destroyTypes';
import type { HTMLTextStyle, HTMLTextStyleOptions } from '../text-html/HtmlTextStyle';
import type { TextStyle, TextStyleOptions } from './TextStyle';
/**
 * A string or number that can be used as text.
 * @memberof text
 */
export type TextString = string | number | {
    toString: () => string;
};
/**
 * A union of all text styles, including HTML, Bitmap and Canvas text styles.
 * @memberof text
 * @see text.TextStyle
 * @see text.HTMLTextStyle
 */
export type AnyTextStyle = TextStyle | HTMLTextStyle;
/**
 * A union of all text style options, including HTML, Bitmap and Canvas text style options.
 * @memberof text
 * @see text.TextStyleOptions
 * @see text.HTMLTextStyleOptions
 */
export type AnyTextStyleOptions = TextStyleOptions | HTMLTextStyleOptions;
/**
 * Options for the {@link scene.Text} class.
 * @example
 * const text = new Text({
 *    text: 'Hello Pixi!',
 *    style: {
 *       fontFamily: 'Arial',
 *       fontSize: 24,
 *    fill: 0xff1010,
 *    align: 'center',
 *  }
 * });
 * @memberof text
 */
export interface TextOptions<TEXT_STYLE extends TextStyle = TextStyle, TEXT_STYLE_OPTIONS extends TextStyleOptions = TextStyleOptions> extends ContainerOptions {
    /** The anchor point of the text. */
    anchor?: PointData | number;
    /** The copy for the text object. To split a line you can use '\n'. */
    text?: TextString;
    /** The resolution of the text. */
    resolution?: number;
    /**
     * The text style
     * @type {
     * text.TextStyle |
     * Partial<text.TextStyle> |
     * text.TextStyleOptions |
     * text.HTMLTextStyle |
     * Partial<text.HTMLTextStyle> |
     * text.HTMLTextStyleOptions
     * }
     */
    style?: TEXT_STYLE | TEXT_STYLE_OPTIONS;
    /** Whether or not to round the x/y position. */
    roundPixels?: boolean;
}
/**
 * An abstract Text class, used by all text type in Pixi. This includes Canvas, HTML, and Bitmap Text.
 * @see scene.Text
 * @see scene.BitmapText
 * @see scene.HTMLText
 * @memberof scene
 */
export declare abstract class AbstractText<TEXT_STYLE extends TextStyle = TextStyle, TEXT_STYLE_OPTIONS extends TextStyleOptions = TextStyleOptions> extends ViewContainer implements View {
    batched: boolean;
    _anchor: ObservablePoint;
    _resolution: number;
    _autoResolution: boolean;
    _style: TEXT_STYLE;
    _didTextUpdate: boolean;
    protected _text: string;
    private readonly _styleClass;
    constructor(options: TextOptions<TEXT_STYLE, TEXT_STYLE_OPTIONS>, styleClass: new (options: TEXT_STYLE_OPTIONS) => TEXT_STYLE);
    /**
     * The anchor sets the origin point of the text.
     * The default is `(0,0)`, this means the text's origin is the top left.
     *
     * Setting the anchor to `(0.5,0.5)` means the text's origin is centered.
     *
     * Setting the anchor to `(1,1)` would mean the text's origin point will be the bottom right corner.
     *
     * If you pass only single parameter, it will set both x and y to the same value as shown in the example below.
     * @example
     * import { Text } from 'pixi.js';
     *
     * const text = new Text('hello world');
     * text.anchor.set(0.5); // This will set the origin to center. (0.5) is same as (0.5, 0.5).
     */
    get anchor(): ObservablePoint;
    set anchor(value: PointData | number);
    /** Set the copy for the text object. To split a line you can use '\n'. */
    set text(value: TextString);
    get text(): string;
    /**
     * The resolution / device pixel ratio of the canvas.
     * @default 1
     */
    set resolution(value: number);
    get resolution(): number;
    get style(): TEXT_STYLE;
    /**
     * Set the style of the text.
     *
     * Set up an event listener to listen for changes on the style object and mark the text as dirty.
     *
     * If setting the `style` can also be partial {@link AnyTextStyleOptions}.
     * @type {
     * text.TextStyle |
     * Partial<text.TextStyle> |
     * text.TextStyleOptions |
     * text.HTMLTextStyle |
     * Partial<text.HTMLTextStyle> |
     * text.HTMLTextStyleOptions
     * }
     */
    set style(style: TEXT_STYLE | Partial<TEXT_STYLE> | TEXT_STYLE_OPTIONS);
    /**
     * The local bounds of the Text.
     * @type {rendering.Bounds}
     */
    get bounds(): Bounds;
    /** The width of the sprite, setting this will actually modify the scale to achieve the value set. */
    get width(): number;
    set width(value: number);
    /** The height of the sprite, setting this will actually modify the scale to achieve the value set. */
    get height(): number;
    set height(value: number);
    /**
     * Retrieves the size of the Text as a [Size]{@link Size} object.
     * This is faster than get the width and height separately.
     * @param out - Optional object to store the size in.
     * @returns - The size of the Text.
     */
    getSize(out?: Size): Size;
    /**
     * Sets the size of the Text to the specified width and height.
     * This is faster than setting the width and height separately.
     * @param value - This can be either a number or a [Size]{@link Size} object.
     * @param height - The height to set. Defaults to the value of `width` if not provided.
     */
    setSize(value: number | Optional<Size, 'height'>, height?: number): void;
    /**
     * Adds the bounds of this text to the bounds object.
     * @param bounds - The output bounds object.
     */
    addBounds(bounds: Bounds): void;
    /**
     * Checks if the text contains the given point.
     * @param point - The point to check
     */
    containsPoint(point: PointData): boolean;
    onViewUpdate(): void;
    _getKey(): string;
    protected abstract _updateBounds(): void;
    /**
     * Destroys this text renderable and optionally its style texture.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the texture of the text style
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the text style
     * @param {boolean} [options.style=false] - Should it destroy the style of the text
     */
    destroy(options?: DestroyOptions): void;
}
export declare function ensureOptions<TEXT_STYLE extends TextStyle, TEXT_STYLE_OPTIONS extends TextStyleOptions>(args: any[], name: string): TextOptions<TEXT_STYLE, TEXT_STYLE_OPTIONS>;
