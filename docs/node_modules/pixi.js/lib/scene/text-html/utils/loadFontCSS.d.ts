export interface FontCSSStyleOptions {
    fontFamily: string | string[];
    fontWeight: string;
    fontStyle: string;
}
/**
 * This will take a font url and a style and return a css string that can be injected into a style tag
 * This will contain inlined base64 font and the font family information
 * @param style - the style to generate the css for
 * @param url - The url to load the font from
 * @returns - The css string
 */
export declare function loadFontCSS(style: FontCSSStyleOptions, url: string): Promise<string>;
