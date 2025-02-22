import { Cache } from '../../assets/cache/Cache.mjs';
import { deprecation, v8_0_0 } from '../../utils/logging/deprecation.mjs';
import { warn } from '../../utils/logging/warn.mjs';
import { TextStyle } from '../text/TextStyle.mjs';
import { DynamicBitmapFont } from './DynamicBitmapFont.mjs';
import { getBitmapTextLayout } from './utils/getBitmapTextLayout.mjs';
import { resolveCharacters } from './utils/resolveCharacters.mjs';

"use strict";
let fontCount = 0;
class BitmapFontManagerClass {
  constructor() {
    /**
     * This character set includes all the letters in the alphabet (both lower- and upper- case).
     * @type {string[][]}
     * @example
     * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.ALPHA })
     */
    this.ALPHA = [["a", "z"], ["A", "Z"], " "];
    /**
     * This character set includes all decimal digits (from 0 to 9).
     * @type {string[][]}
     * @example
     * BitmapFont.from('ExampleFont', style, { chars: BitmapFont.NUMERIC })
     */
    this.NUMERIC = [["0", "9"]];
    /**
     * This character set is the union of `BitmapFont.ALPHA` and `BitmapFont.NUMERIC`.
     * @type {string[][]}
     */
    this.ALPHANUMERIC = [["a", "z"], ["A", "Z"], ["0", "9"], " "];
    /**
     * This character set consists of all the ASCII table.
     * @member {string[][]}
     * @see http://www.asciitable.com/
     */
    this.ASCII = [[" ", "~"]];
    /** Default options for installing a new BitmapFont. */
    this.defaultOptions = {
      chars: this.ALPHANUMERIC,
      resolution: 1,
      padding: 4,
      skipKerning: false
    };
  }
  /**
   * Get a font for the specified text and style.
   * @param text - The text to get the font for
   * @param style - The style to use
   */
  getFont(text, style) {
    let fontFamilyKey = `${style.fontFamily}-bitmap`;
    let overrideFill = true;
    if (style._fill.fill && !style._stroke) {
      fontFamilyKey += style._fill.fill.styleKey;
      overrideFill = false;
    } else if (style._stroke || style.dropShadow) {
      let key = style.styleKey;
      key = key.substring(0, key.lastIndexOf("-"));
      fontFamilyKey = `${key}-bitmap`;
      overrideFill = false;
    }
    if (!Cache.has(fontFamilyKey)) {
      const fnt = new DynamicBitmapFont({
        style,
        overrideFill,
        overrideSize: true,
        ...this.defaultOptions
      });
      fontCount++;
      if (fontCount > 50) {
        warn("BitmapText", `You have dynamically created ${fontCount} bitmap fonts, this can be inefficient. Try pre installing your font styles using \`BitmapFont.install({name:"style1", style})\``);
      }
      fnt.once("destroy", () => {
        fontCount--;
        Cache.remove(fontFamilyKey);
      });
      Cache.set(
        fontFamilyKey,
        fnt
      );
    }
    const dynamicFont = Cache.get(fontFamilyKey);
    dynamicFont.ensureCharacters?.(text);
    return dynamicFont;
  }
  /**
   * Get the layout of a text for the specified style.
   * @param text - The text to get the layout for
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  getLayout(text, style, trimEnd = true) {
    const bitmapFont = this.getFont(text, style);
    return getBitmapTextLayout([...text], style, bitmapFont, trimEnd);
  }
  /**
   * Measure the text using the specified style.
   * @param text - The text to measure
   * @param style - The style to use
   * @param trimEnd - Whether to ignore whitespaces at the end of each line
   */
  measureText(text, style, trimEnd = true) {
    return this.getLayout(text, style, trimEnd);
  }
  // eslint-disable-next-line max-len
  install(...args) {
    let options = args[0];
    if (typeof options === "string") {
      options = {
        name: options,
        style: args[1],
        chars: args[2]?.chars,
        resolution: args[2]?.resolution,
        padding: args[2]?.padding,
        skipKerning: args[2]?.skipKerning
      };
      deprecation(v8_0_0, "BitmapFontManager.install(name, style, options) is deprecated, use BitmapFontManager.install({name, style, ...options})");
    }
    const name = options?.name;
    if (!name) {
      throw new Error("[BitmapFontManager] Property `name` is required.");
    }
    options = { ...this.defaultOptions, ...options };
    const textStyle = options.style;
    const style = textStyle instanceof TextStyle ? textStyle : new TextStyle(textStyle);
    const overrideFill = style._fill.fill !== null && style._fill.fill !== void 0;
    const font = new DynamicBitmapFont({
      style,
      overrideFill,
      skipKerning: options.skipKerning,
      padding: options.padding,
      resolution: options.resolution,
      overrideSize: false
    });
    const flatChars = resolveCharacters(options.chars);
    font.ensureCharacters(flatChars.join(""));
    Cache.set(`${name}-bitmap`, font);
    font.once("destroy", () => Cache.remove(`${name}-bitmap`));
    return font;
  }
  /**
   * Uninstalls a bitmap font from the cache.
   * @param {string} name - The name of the bitmap font to uninstall.
   */
  uninstall(name) {
    const cacheKey = `${name}-bitmap`;
    const font = Cache.get(cacheKey);
    if (font) {
      Cache.remove(cacheKey);
      font.destroy();
    }
  }
}
const BitmapFontManager = new BitmapFontManagerClass();

export { BitmapFontManager };
//# sourceMappingURL=BitmapFontManager.mjs.map
