import type { TEXTURE_FORMATS } from '../../../rendering/renderers/shared/texture/const';
import type { TextureSourceOptions } from '../../../rendering/renderers/shared/texture/sources/TextureSource';
export declare function loadBasisOnWorker(url: string, supportedTextures: TEXTURE_FORMATS[]): Promise<TextureSourceOptions>;
