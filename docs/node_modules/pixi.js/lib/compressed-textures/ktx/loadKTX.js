'use strict';

var LoaderParser = require('../../assets/loader/parsers/LoaderParser.js');
var createTexture = require('../../assets/loader/parsers/textures/utils/createTexture.js');
var checkExtension = require('../../assets/utils/checkExtension.js');
var Extensions = require('../../extensions/Extensions.js');
var CompressedSource = require('../../rendering/renderers/shared/texture/sources/CompressedSource.js');
var getSupportedTextureFormats = require('../../rendering/renderers/shared/texture/utils/getSupportedTextureFormats.js');
var parseKTX = require('./parseKTX.js');

"use strict";
const loadKTX = {
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High,
    name: "loadKTX"
  },
  name: "loadKTX",
  test(url) {
    return checkExtension.checkExtension(url, ".ktx");
  },
  async load(url, _asset, loader) {
    const supportedTextures = await getSupportedTextureFormats.getSupportedTextureFormats();
    const ktxResponse = await fetch(url);
    const ktxArrayBuffer = await ktxResponse.arrayBuffer();
    const textureOptions = parseKTX.parseKTX(ktxArrayBuffer, supportedTextures);
    const compressedTextureSource = new CompressedSource.CompressedSource(textureOptions);
    return createTexture.createTexture(compressedTextureSource, loader, url);
  },
  unload(texture) {
    if (Array.isArray(texture)) {
      texture.forEach((t) => t.destroy(true));
    } else {
      texture.destroy(true);
    }
  }
};

exports.loadKTX = loadKTX;
//# sourceMappingURL=loadKTX.js.map
