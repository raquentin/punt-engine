import type { BitmapFontData } from '../AbstractBitmapFont';
export declare const bitmapFontXMLStringParser: {
    test(data: string | XMLDocument | BitmapFontData): boolean;
    parse(data: string): BitmapFontData;
};
