import { LoaderParserPriority } from '../../assets/loader/parsers/LoaderParser.mjs';
import { createTexture } from '../../assets/loader/parsers/textures/utils/createTexture.mjs';
import { checkExtension } from '../../assets/utils/checkExtension.mjs';
import { ExtensionType } from '../../extensions/Extensions.mjs';
import { CompressedSource } from '../../rendering/renderers/shared/texture/sources/CompressedSource.mjs';
import { getSupportedTextureFormats } from '../../rendering/renderers/shared/texture/utils/getSupportedTextureFormats.mjs';
import { parseKTX } from './parseKTX.mjs';

"use strict";
const loadKTX = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.High,
    name: "loadKTX"
  },
  name: "loadKTX",
  test(url) {
    return checkExtension(url, ".ktx");
  },
  async load(url, _asset, loader) {
    const supportedTextures = await getSupportedTextureFormats();
    const ktxResponse = await fetch(url);
    const ktxArrayBuffer = await ktxResponse.arrayBuffer();
    const textureOptions = parseKTX(ktxArrayBuffer, supportedTextures);
    const compressedTextureSource = new CompressedSource(textureOptions);
    return createTexture(compressedTextureSource, loader, url);
  },
  unload(texture) {
    if (Array.isArray(texture)) {
      texture.forEach((t) => t.destroy(true));
    } else {
      texture.destroy(true);
    }
  }
};

export { loadKTX };
//# sourceMappingURL=loadKTX.mjs.map
