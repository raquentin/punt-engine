import { ExtensionType } from '../../extensions/Extensions.mjs';
import { TexturePool } from '../../rendering/renderers/shared/texture/TexturePool.mjs';
import { RendererType } from '../../rendering/renderers/types.mjs';
import { isSafari } from '../../utils/browser/isSafari.mjs';
import { warn } from '../../utils/logging/warn.mjs';
import { BigPool } from '../../utils/pool/PoolGroup.mjs';
import { getPo2TextureFromSource } from '../text/utils/getPo2TextureFromSource.mjs';
import { HTMLTextRenderData } from './HTMLTextRenderData.mjs';
import { HTMLTextStyle } from './HtmlTextStyle.mjs';
import { extractFontFamilies } from './utils/extractFontFamilies.mjs';
import { getFontCss } from './utils/getFontCss.mjs';
import { getSVGUrl } from './utils/getSVGUrl.mjs';
import { getTemporaryCanvasFromImage } from './utils/getTemporaryCanvasFromImage.mjs';
import { loadSVGImage } from './utils/loadSVGImage.mjs';
import { measureHtmlText } from './utils/measureHtmlText.mjs';

"use strict";
class HTMLTextSystem {
  constructor(renderer) {
    this._activeTextures = {};
    this._renderer = renderer;
    this._createCanvas = renderer.type === RendererType.WEBGPU;
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
    const htmlTextData = BigPool.get(HTMLTextRenderData);
    const fontFamilies = extractFontFamilies(text, style);
    const fontCSS = await getFontCss(
      fontFamilies,
      style,
      HTMLTextStyle.defaultTextStyle
    );
    const measured = measureHtmlText(text, style, fontCSS, htmlTextData);
    const width = Math.ceil(Math.ceil(Math.max(1, measured.width) + style.padding * 2) * resolution);
    const height = Math.ceil(Math.ceil(Math.max(1, measured.height) + style.padding * 2) * resolution);
    const image = htmlTextData.image;
    const uvSafeOffset = 2;
    image.width = (width | 0) + uvSafeOffset;
    image.height = (height | 0) + uvSafeOffset;
    const svgURL = getSVGUrl(text, style, resolution, fontCSS, htmlTextData);
    await loadSVGImage(image, svgURL, isSafari() && fontFamilies.length > 0);
    let resource = image;
    if (this._createCanvas) {
      resource = getTemporaryCanvasFromImage(image, resolution);
    }
    const texture = getPo2TextureFromSource(
      resource,
      image.width - uvSafeOffset,
      image.height - uvSafeOffset,
      resolution
    );
    if (this._createCanvas) {
      this._renderer.texture.initSource(texture.source);
    }
    BigPool.return(htmlTextData);
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
          warn("HTMLTextSystem: Failed to clean texture");
        });
      }
      this._activeTextures[textKey] = null;
    }
  }
  _cleanUp(activeTexture) {
    TexturePool.returnTexture(activeTexture.texture);
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
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "htmlText"
};
HTMLTextSystem.defaultFontOptions = {
  fontFamily: "Arial",
  fontStyle: "normal",
  fontWeight: "normal"
};

export { HTMLTextSystem };
//# sourceMappingURL=HTMLTextSystem.mjs.map
