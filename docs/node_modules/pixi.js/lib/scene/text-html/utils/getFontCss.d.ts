import type { FontCSSStyleOptions } from './loadFontCSS';
export declare const FontStylePromiseCache: Map<string, Promise<string>>;
/**
 * takes the font families and returns a css string that can be injected into a style tag
 * It will contain the font families and the font urls encoded as base64
 * @param fontFamilies - The font families to load
 * @param style - The FontCSSStyleOptions to load the font with (used for the first font family)
 * @param defaultOptions - The default options to load the font with (used for the rest of the font families)
 * @param defaultOptions.fontWeight - The default font weight
 * @param defaultOptions.fontStyle - The default font style
 * @returns - The css string
 */
export declare function getFontCss(fontFamilies: string[], style: FontCSSStyleOptions, defaultOptions: {
    fontWeight: string;
    fontStyle: string;
}): Promise<string>;
