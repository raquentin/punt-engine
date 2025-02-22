'use strict';

var LoaderParser = require('../../assets/loader/parsers/LoaderParser.js');
var createTexture = require('../../assets/loader/parsers/textures/utils/createTexture.js');
var checkExtension = require('../../assets/utils/checkExtension.js');
var Extensions = require('../../extensions/Extensions.js');
var CompressedSource = require('../../rendering/renderers/shared/texture/sources/CompressedSource.js');
var getSupportedTextureFormats = require('../../rendering/renderers/shared/texture/utils/getSupportedTextureFormats.js');
var parseDDS = require('./parseDDS.js');

"use strict";
const loadDDS = {
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.High,
    name: "loadDDS"
  },
  name: "loadDDS",
  test(url) {
    return checkExtension.checkExtension(url, [".dds"]);
  },
  async load(url, _asset, loader) {
    const supportedTextures = await getSupportedTextureFormats.getSupportedTextureFormats();
    const ddsResponse = await fetch(url);
    const ddsArrayBuffer = await ddsResponse.arrayBuffer();
    const textureOptions = parseDDS.parseDDS(ddsArrayBuffer, supportedTextures);
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

exports.loadDDS = loadDDS;
//# sourceMappingURL=loadDDS.js.map
