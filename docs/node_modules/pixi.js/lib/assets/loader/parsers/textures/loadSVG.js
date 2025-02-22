'use strict';

var adapter = require('../../../../environment/adapter.js');
var Extensions = require('../../../../extensions/Extensions.js');
var ImageSource = require('../../../../rendering/renderers/shared/texture/sources/ImageSource.js');
var GraphicsContext = require('../../../../scene/graphics/shared/GraphicsContext.js');
var getResolutionOfUrl = require('../../../../utils/network/getResolutionOfUrl.js');
var checkDataUrl = require('../../../utils/checkDataUrl.js');
var checkExtension = require('../../../utils/checkExtension.js');
var LoaderParser = require('../LoaderParser.js');
var createTexture = require('./utils/createTexture.js');

"use strict";
const validSVGExtension = ".svg";
const validSVGMIME = "image/svg+xml";
const loadSvg = {
  extension: {
    type: Extensions.ExtensionType.LoadParser,
    priority: LoaderParser.LoaderParserPriority.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: false
  },
  test(url) {
    return checkDataUrl.checkDataUrl(url, validSVGMIME) || checkExtension.checkExtension(url, validSVGExtension);
  },
  async load(url, asset, loader) {
    if (asset.data.parseAsGraphicsContext ?? this.config.parseAsGraphicsContext) {
      return loadAsGraphics(url);
    }
    return loadAsTexture(url, asset, loader, this.config.crossOrigin);
  },
  unload(asset) {
    asset.destroy(true);
  }
};
async function loadAsTexture(url, asset, loader, crossOrigin) {
  const response = await adapter.DOMAdapter.get().fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = blobUrl;
  image.crossOrigin = crossOrigin;
  await image.decode();
  URL.revokeObjectURL(blobUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const resolution = asset.data?.resolution || getResolutionOfUrl.getResolutionOfUrl(url);
  const width = asset.data?.width ?? image.width;
  const height = asset.data?.height ?? image.height;
  canvas.width = width * resolution;
  canvas.height = height * resolution;
  context.drawImage(image, 0, 0, width * resolution, height * resolution);
  const { parseAsGraphicsContext: _p, ...rest } = asset.data;
  const base = new ImageSource.ImageSource({
    resource: canvas,
    alphaMode: "premultiply-alpha-on-upload",
    resolution,
    ...rest
  });
  return createTexture.createTexture(base, loader, url);
}
async function loadAsGraphics(url) {
  const response = await adapter.DOMAdapter.get().fetch(url);
  const svgSource = await response.text();
  const context = new GraphicsContext.GraphicsContext();
  context.svg(svgSource);
  return context;
}

exports.loadSvg = loadSvg;
//# sourceMappingURL=loadSVG.js.map
