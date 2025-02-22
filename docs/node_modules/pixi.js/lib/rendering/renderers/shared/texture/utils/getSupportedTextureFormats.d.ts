import type { TEXTURE_FORMATS } from '../const';
export declare const nonCompressedFormats: TEXTURE_FORMATS[];
export declare function getSupportedTextureFormats(): Promise<TEXTURE_FORMATS[]>;
