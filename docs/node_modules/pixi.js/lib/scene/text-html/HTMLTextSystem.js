'use strict';

var Extensions = require('../../extensions/Extensions.js');
var TexturePool = require('../../rendering/renderers/shared/texture/TexturePool.js');
var types = require('../../rendering/renderers/types.js');
var isSafari = require('../../utils/browser/isSafari.js');
var warn = require('../../utils/logging/warn.js');
var PoolGroup = require('../../utils/pool/PoolGroup.js');
var getPo2TextureFromSource = require('../text/utils/getPo2TextureFromSource.js');
var HTMLTextRenderData = require('./HTMLTextRenderData.js');
var HtmlTextStyle = require('./HtmlTextStyle.js');
var extractFontFamilies = require('./utils/extractFontFamilies.js');
var getFontCss = require('./utils/getFontCss.js');
var getSVGUrl = require('./utils/getSVGUrl.js');
var getTemporaryCanvasFromImage = require('./utils/getTemporaryCanvasFromImage.js');
var loadSVGImage = require('./utils/loadSVGImage.js');
var measureHtmlText = require('./utils/measureHtmlText.js');

"use strict";
class HTMLTextSystem {
  constructor(renderer) {
    this._activeTextures = {};
    this._renderer = renderer;
    this._createCanvas = renderer.type === types.RendererType.WEBGPU;
  }
  getTexture(options) {
    return this._buildTexturePromise(
      options.text,
      options.resolution,
      options.style
    );
  }
  getManagedTexture(text, resolution, style, textKey) {
    if (this._activeTextures[textKey]) {
      this._increaseReferenceCount(textKey);
      return this._activeTextures[textKey].promise;
    }
    const promise = this._buildTexturePromise(text, resolution, style).then((texture) => {
      this._activeTextures[textKey].texture = texture;
      return texture;
    });
    this._activeTextures[textKey] = {
      texture: null,
      promise,
      usageCount: 1
    };
    return promise;
  }
  async _buildTexturePromise(text, resolution, style) {
    const htmlTextData = PoolGroup.BigPool.get(HTMLTextRenderData.HTMLTextRenderData);
    const fontFamilies = extractFontFamilies.extractFontFamilies(text, style);
    const fontCSS = await getFontCss.getFontCss(
      fontFamilies,
      style,
      HtmlTextStyle.HTMLTextStyle.defaultTextStyle
    );
    const measured = measureHtmlText.measureHtmlText(text, style, fontCSS, htmlTextData);
    const width = Math.ceil(Math.ceil(Math.max(1, measured.width) + style.padding * 2) * resolution);
    const height = Math.ceil(Math.ceil(Math.max(1, measured.height) + style.padding * 2) * resolution);
    const image = htmlTextData.image;
    const uvSafeOffset = 2;
    image.width = (width | 0) + uvSafeOffset;
    image.height = (height | 0) + uvSafeOffset;
    const svgURL = getSVGUrl.getSVGUrl(text, style, resolution, fontCSS, htmlTextData);
    await loadSVGImage.loadSVGImage(image, svgURL, isSafari.isSafari() && fontFamilies.length > 0);
    let resource = image;
    if (this._createCanvas) {
      resource = getTemporaryCanvasFromImage.getTemporaryCanvasFromImage(image, resolution);
    }
    const texture = getPo2TextureFromSource.getPo2TextureFromSource(
      resource,
      image.width - uvSafeOffset,
      image.height - uvSafeOffset,
      resolution
    );
    if (this._createCanvas) {
      this._renderer.texture.initSource(texture.source);
    }
    PoolGroup.BigPool.return(htmlTextData);
    return texture;
  }
  _increaseReferenceCount(textKey) {
    this._activeTextures[textKey].usageCount++;
  }
  decreaseReferenceCount(textKey) {
    const activeTexture = this._activeTextures[textKey];
    if (!activeTexture)
      return;
    activeTexture.usageCount--;
    if (activeTexture.usageCount === 0) {
      if (activeTexture.texture) {
        this._cleanUp(activeTexture);
      } else {
        activeTexture.promise.then((texture) => {
          activeTexture.texture = texture;
          this._cleanUp(activeTexture);
        }).catch(() => {
          warn.warn("HTMLTextSystem: Failed to clean texture");
        });
      }
      this._activeTextures[textKey] = null;
    }
  }
  _cleanUp(activeTexture) {
    TexturePool.TexturePool.returnTexture(activeTexture.texture);
    activeTexture.texture.source.resource = null;
    activeTexture.texture.source.uploadMethodId = "unknown";
  }
  getReferenceCount(textKey) {
    return this._activeTextures[textKey].usageCount;
  }
  destroy() {
    this._activeTextures = null;
  }
}
/** @ignore */
HTMLTextSystem.extension = {
  type: [
    Extensions.ExtensionType.WebGLSystem,
    Extensions.ExtensionType.WebGPUSystem,
    Extensions.ExtensionType.CanvasSystem
  ],
  name: "htmlText"
};
HTMLTextSystem.defaultFontOptions = {
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: "normal"
};

exports.HTMLTextSystem = HTMLTextSystem;
//# sourceMappingURL=HTMLTextSystem.js.map
