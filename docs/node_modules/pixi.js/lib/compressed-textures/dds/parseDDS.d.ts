import type { TEXTURE_FORMATS } from '../../rendering/renderers/shared/texture/const';
import type { TextureSourceOptions } from '../../rendering/renderers/shared/texture/sources/TextureSource';
export declare function parseDDS(arrayBuffer: ArrayBuffer, supportedFormats: TEXTURE_FORMATS[]): TextureSourceOptions<Uint8Array[]>;
