import { TextStyle } from '../text/TextStyle';
import type { FillInput, StrokeInput } from '../graphics/shared/FillTypes';
import type { TextStyleOptions } from '../text/TextStyle';
/**
 * Options for HTML text style, extends {@link TextStyle}.
 * @memberof text
 * @extends text.TextStyleOptions
 * @property {string[]} [cssOverrides] - CSS style(s) to add.
 * @property {Record<string, text.HTMLTextStyleOptions>} [tagStyles] - Tag styles.
 */
export interface HTMLTextStyleOptions extends Omit<TextStyleOptions, 'leading' | 'textBaseline' | 'trim'> {
    cssOverrides?: string[];
    tagStyles?: Record<string, HTMLTextStyleOptions>;
}
/**
 * A TextStyle object rendered by the HTMLTextSystem.
 * @memberof text
 */
export declare class HTMLTextStyle extends TextStyle {
    private _cssOverrides;
    private _cssStyle;
    /**
     * List of styles per tag.
     * @example
     * new HTMLText({
     *   text:'<red>Red</red>,<blue>Blue</blue>,<green>Green</green>',
     *   style:{
     *       fontFamily: 'DM Sans',
     *       fill: 'white',
     *       fontSize:100,
     *       tagStyles:{
     *           red:{
     *               fill:'red',
     *           },
     *           blue:{
     *               fill:'blue',
     *           },
     *           green:{
     *               fill:'green',
     *           }
     *       }
     *   }
     * );
     */
    tagStyles: Record<string, HTMLTextStyleOptions>;
    constructor(options?: HTMLTextStyleOptions);
    /** List of style overrides that will be applied to the HTML text. */
    set cssOverrides(value: string | string[]);
    get cssOverrides(): string[];
    protected _generateKey(): string;
    update(): void;
    /**
     * Creates a new HTMLTextStyle object with the same values as this one.
     * @returns New cloned HTMLTextStyle object
     */
    clone(): HTMLTextStyle;
    get cssStyle(): string;
    /**
     * Add a style override, this can be any CSS property
     * it will override any built-in style. This is the
     * property and the value as a string (e.g., `color: red`).
     * This will override any other internal style.
     * @param {string} value - CSS style(s) to add.
     * @example
     * style.addOverride('background-color: red');
     */
    addOverride(...value: string[]): void;
    /**
     * Remove any overrides that match the value.
     * @param {string} value - CSS style to remove.
     * @example
     * style.removeOverride('background-color: red');
     */
    removeOverride(...value: string[]): void;
    set fill(value: FillInput);
    set stroke(value: StrokeInput);
}
