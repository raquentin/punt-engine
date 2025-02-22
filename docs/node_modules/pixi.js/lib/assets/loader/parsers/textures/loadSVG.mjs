import { DOMAdapter } from '../../../../environment/adapter.mjs';
import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { ImageSource } from '../../../../rendering/renderers/shared/texture/sources/ImageSource.mjs';
import { GraphicsContext } from '../../../../scene/graphics/shared/GraphicsContext.mjs';
import { getResolutionOfUrl } from '../../../../utils/network/getResolutionOfUrl.mjs';
import { checkDataUrl } from '../../../utils/checkDataUrl.mjs';
import { checkExtension } from '../../../utils/checkExtension.mjs';
import { LoaderParserPriority } from '../LoaderParser.mjs';
import { createTexture } from './utils/createTexture.mjs';

"use strict";
const validSVGExtension = ".svg";
const validSVGMIME = "image/svg+xml";
const loadSvg = {
  extension: {
    type: ExtensionType.LoadParser,
    priority: LoaderParserPriority.Low,
    name: "loadSVG"
  },
  name: "loadSVG",
  config: {
    crossOrigin: "anonymous",
    parseAsGraphicsContext: false
  },
  test(url) {
    return checkDataUrl(url, validSVGMIME) || checkExtension(url, validSVGExtension);
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
  const response = await DOMAdapter.get().fetch(url);
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const image = new Image();
  image.src = blobUrl;
  image.crossOrigin = crossOrigin;
  await image.decode();
  URL.revokeObjectURL(blobUrl);
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const resolution = asset.data?.resolution || getResolutionOfUrl(url);
  const width = asset.data?.width ?? image.width;
  const height = asset.data?.height ?? image.height;
  canvas.width = width * resolution;
  canvas.height = height * resolution;
  context.drawImage(image, 0, 0, width * resolution, height * resolution);
  const { parseAsGraphicsContext: _p, ...rest } = asset.data;
  const base = new ImageSource({
    resource: canvas,
    alphaMode: "premultiply-alpha-on-upload",
    resolution,
    ...rest
  });
  return createTexture(base, loader, url);
}
async function loadAsGraphics(url) {
  const response = await DOMAdapter.get().fetch(url);
  const svgSource = await response.text();
  const context = new GraphicsContext();
  context.svg(svgSource);
  return context;
}

export { loadSvg };
//# sourceMappingURL=loadSVG.mjs.map
