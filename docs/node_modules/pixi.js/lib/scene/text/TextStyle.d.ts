import EventEmitter from 'eventemitter3';
import { type ColorSource } from '../../color/Color';
import type { TextureDestroyOptions, TypeOrBool } from '../container/destroyTypes';
import type { ConvertedFillStyle, ConvertedStrokeStyle, FillInput, StrokeInput } from '../graphics/shared/FillTypes';
export type TextStyleAlign = 'left' | 'center' | 'right' | 'justify';
export type TextStyleFill = string | string[] | number | number[] | CanvasGradient | CanvasPattern;
export type TextStyleFontStyle = 'normal' | 'italic' | 'oblique';
export type TextStyleFontVariant = 'normal' | 'small-caps';
export type TextStyleFontWeight = 'normal' | 'bold' | 'bolder' | 'lighter' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
export type TextStyleLineJoin = 'miter' | 'round' | 'bevel';
export type TextStyleTextBaseline = 'alphabetic' | 'top' | 'hanging' | 'middle' | 'ideographic' | 'bottom';
export type TextStyleWhiteSpace = 'normal' | 'pre' | 'pre-line';
/**
 * A collection of text related classes.
 * @namespace text
 */
/**
 * A drop shadow effect.
 * @memberof text
 */
export type TextDropShadow = {
    /** Set alpha for the drop shadow  */
    alpha: number;
    /** Set a angle of the drop shadow */
    angle: number;
    /** Set a shadow blur radius */
    blur: number;
    /** A fill style to be used on the  e.g., 'red', '#00FF00' */
    color: ColorSource;
    /** Set a distance of the drop shadow */
    distance: number;
};
/**
 * Constructor options used for `TextStyle` instances.
 * ```js
 * const textStyle = new TextStyle({
 *    fontSize: 12,
 *    fill: 'black',
 * });
 * ```
 * @see {@link text.TextStyle}
 * @memberof text
 */
export interface TextStyleOptions {
    /**
     * Alignment for multiline text, does not affect single line text
     * @type {'left'|'center'|'right'|'justify'}
     */
    align?: TextStyleAlign;
    /** Indicates if lines can be wrapped within words, it needs `wordWrap` to be set to `true` */
    breakWords?: boolean;
    /** Set a drop shadow for the text */
    dropShadow?: boolean | Partial<TextDropShadow>;
    /**
     * A canvas fillstyle that will be used on the text e.g., 'red', '#00FF00'.
     * Can be an array to create a gradient, e.g., `['#000000','#FFFFFF']`
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillStyle|MDN}
     * @type {string|string[]|number|number[]|CanvasGradient|CanvasPattern}
     */
    fill?: FillInput;
    /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
    fontFamily?: string | string[];
    /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
    fontSize?: number | string;
    /**
     * The font style.
     * @type {'normal'|'italic'|'oblique'}
     */
    fontStyle?: TextStyleFontStyle;
    /**
     * The font variant.
     * @type {'normal'|'small-caps'}
     */
    fontVariant?: TextStyleFontVariant;
    /**
     * The font weight.
     * @type {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
     */
    fontWeight?: TextStyleFontWeight;
    /** The height of the line, a number that represents the vertical space that a letter uses. */
    leading?: number;
    /** The amount of spacing between letters, default is 0 */
    letterSpacing?: number;
    /** The line height, a number that represents the vertical space that a letter uses */
    lineHeight?: number;
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from
     * happening by adding padding to all sides of the text.
     */
    padding?: number;
    /** A canvas fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00' */
    stroke?: StrokeInput;
    /**
     * The baseline of the text that is rendered.
     * @type {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
     */
    textBaseline?: TextStyleTextBaseline;
    trim?: boolean;
    /**
     * Determines whether newlines & spaces are collapsed or preserved "normal"
     * (collapse, collapse), "pre" (preserve, preserve) | "pre-line" (preserve,
     * collapse). It needs wordWrap to be set to true.
     * @type {'normal'|'pre'|'pre-line'}
     */
    whiteSpace?: TextStyleWhiteSpace;
    /** Indicates if word wrap should be used */
    wordWrap?: boolean;
    /** The width at which text will wrap, it needs wordWrap to be set to true */
    wordWrapWidth?: number;
}
/**
 * A TextStyle Object contains information to decorate a Text objects.
 *
 * An instance can be shared between multiple Text objects; then changing the style will update all text objects using it.
 * @memberof text
 * @example
 * import { TextStyle } from 'pixi.js';
 * const style = new TextStyle({
 *   fontFamily: ['Helvetica', 'Arial', 'sans-serif'],
 *   fontSize: 36,
 * });
 */
export declare class TextStyle extends EventEmitter<{
    update: TextDropShadow;
}> {
    /** The default drop shadow settings */
    static defaultDropShadow: TextDropShadow;
    /** The default text style settings */
    static defaultTextStyle: TextStyleOptions;
    _fill: ConvertedFillStyle;
    private _originalFill;
    _stroke: ConvertedStrokeStyle;
    private _originalStroke;
    private _dropShadow;
    private _fontFamily;
    private _fontSize;
    private _fontStyle;
    private _fontVariant;
    private _fontWeight;
    private _breakWords;
    private _align;
    private _leading;
    private _letterSpacing;
    private _lineHeight;
    private _textBaseline;
    private _whiteSpace;
    private _wordWrap;
    private _wordWrapWidth;
    private _padding;
    protected _styleKey: string;
    private _trim;
    constructor(style?: Partial<TextStyleOptions>);
    /**
     * Alignment for multiline text, does not affect single line text.
     * @member {'left'|'center'|'right'|'justify'}
     */
    get align(): TextStyleAlign;
    set align(value: TextStyleAlign);
    /** Indicates if lines can be wrapped within words, it needs wordWrap to be set to true. */
    get breakWords(): boolean;
    set breakWords(value: boolean);
    /** Set a drop shadow for the text. */
    get dropShadow(): TextDropShadow;
    set dropShadow(value: boolean | TextDropShadow);
    /** The font family, can be a single font name, or a list of names where the first is the preferred font. */
    get fontFamily(): string | string[];
    set fontFamily(value: string | string[]);
    /** The font size (as a number it converts to px, but as a string, equivalents are '26px','20pt','160%' or '1.6em') */
    get fontSize(): number;
    set fontSize(value: string | number);
    /**
     * The font style.
     * @member {'normal'|'italic'|'oblique'}
     */
    get fontStyle(): TextStyleFontStyle;
    set fontStyle(value: TextStyleFontStyle);
    /**
     * The font variant.
     * @member {'normal'|'small-caps'}
     */
    get fontVariant(): TextStyleFontVariant;
    set fontVariant(value: TextStyleFontVariant);
    /**
     * The font weight.
     * @member {'normal'|'bold'|'bolder'|'lighter'|'100'|'200'|'300'|'400'|'500'|'600'|'700'|'800'|'900'}
     */
    get fontWeight(): TextStyleFontWeight;
    set fontWeight(value: TextStyleFontWeight);
    /** The space between lines. */
    get leading(): number;
    set leading(value: number);
    /** The amount of spacing between letters, default is 0. */
    get letterSpacing(): number;
    set letterSpacing(value: number);
    /** The line height, a number that represents the vertical space that a letter uses. */
    get lineHeight(): number;
    set lineHeight(value: number);
    /**
     * Occasionally some fonts are cropped. Adding some padding will prevent this from happening
     * by adding padding to all sides of the text.
     */
    get padding(): number;
    set padding(value: number);
    /** Trim transparent borders. This is an expensive operation so only use this if you have to! */
    get trim(): boolean;
    set trim(value: boolean);
    /**
     * The baseline of the text that is rendered.
     * @member {'alphabetic'|'top'|'hanging'|'middle'|'ideographic'|'bottom'}
     */
    get textBaseline(): TextStyleTextBaseline;
    set textBaseline(value: TextStyleTextBaseline);
    /**
     * How newlines and spaces should be handled.
     * Default is 'pre' (preserve, preserve).
     *
     *  value       | New lines     |   Spaces
     *  ---         | ---           |   ---
     * 'normal'     | Collapse      |   Collapse
     * 'pre'        | Preserve      |   Preserve
     * 'pre-line'   | Preserve      |   Collapse
     * @member {'normal'|'pre'|'pre-line'}
     */
    get whiteSpace(): TextStyleWhiteSpace;
    set whiteSpace(value: TextStyleWhiteSpace);
    /** Indicates if word wrap should be used. */
    get wordWrap(): boolean;
    set wordWrap(value: boolean);
    /** The width at which text will wrap, it needs wordWrap to be set to true. */
    get wordWrapWidth(): number;
    set wordWrapWidth(value: number);
    /** A fillstyle that will be used on the text e.g., 'red', '#00FF00'. */
    get fill(): FillInput;
    set fill(value: FillInput);
    /** A fillstyle that will be used on the text stroke, e.g., 'blue', '#FCFF00'. */
    get stroke(): StrokeInput;
    set stroke(value: StrokeInput);
    protected _generateKey(): string;
    update(): void;
    /** Resets all properties to the default values */
    reset(): void;
    get styleKey(): string;
    /**
     * Creates a new TextStyle object with the same values as this one.
     * @returns New cloned TextStyle object
     */
    clone(): TextStyle;
    /**
     * Destroys this text style.
     * @param options - Options parameter. A boolean will act as if all options
     *  have been set to that value
     * @param {boolean} [options.texture=false] - Should it destroy the texture of the this style
     * @param {boolean} [options.textureSource=false] - Should it destroy the textureSource of the this style
     */
    destroy(options?: TypeOrBool<TextureDestroyOptions>): void;
    private _createProxy;
    private _isFillStyle;
}
