import type { BitmapFontData } from '../AbstractBitmapFont';
export declare const bitmapFontXMLParser: {
    test(data: string | XMLDocument | BitmapFontData): boolean;
    parse(xml: Document): BitmapFontData;
};
