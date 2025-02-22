'use strict';

var Color = require('../../color/Color.js');
var Rectangle = require('../../maths/shapes/Rectangle.js');
var CanvasPool = require('../../rendering/renderers/shared/texture/CanvasPool.js');
var ImageSource = require('../../rendering/renderers/shared/texture/sources/ImageSource.js');
var Texture = require('../../rendering/renderers/shared/texture/Texture.js');
var deprecation = require('../../utils/logging/deprecation.js');
var CanvasTextMetrics = require('../text/canvas/CanvasTextMetrics.js');
var fontStringFromTextStyle = require('../text/canvas/utils/fontStringFromTextStyle.js');
var getCanvasFillStyle = require('../text/canvas/utils/getCanvasFillStyle.js');
var TextStyle = require('../text/TextStyle.js');
var AbstractBitmapFont = require('./AbstractBitmapFont.js');
var resolveCharacters = require('./utils/resolveCharacters.js');

"use strict";
const _DynamicBitmapFont = class _DynamicBitmapFont extends AbstractBitmapFont.AbstractBitmapFont {
  /**
   * @param options - The options for the dynamic bitmap font.
   */
  constructor(options) {
    super();
    /**
     * this is a resolution modifier for the font size..
     * texture resolution will also be used to scale texture according to its font size also
     */
    this.resolution = 1;
    /** The pages of the font. */
    this.pages = [];
    this._padding = 0;
    this._measureCache = /* @__PURE__ */ Object.create(null);
    this._currentChars = [];
    this._currentX = 0;
    this._currentY = 0;
    this._currentPageIndex = -1;
    this._skipKerning = false;
    const dynamicOptions = { ..._DynamicBitmapFont.defaultOptions, ...options };
    this._textureSize = dynamicOptions.textureSize;
    this._mipmap = dynamicOptions.mipmap;
    const style = dynamicOptions.style.clone();
    if (dynamicOptions.overrideFill) {
      style._fill.color = 16777215;
      style._fill.alpha = 1;
      style._fill.texture = Texture.Texture.WHITE;
      style._fill.fill = null;
    }
    this.applyFillAsTint = dynamicOptions.overrideFill;
    const requestedFontSize = style.fontSize;
    style.fontSize = this.baseMeasurementFontSize;
    const font = fontStringFromTextStyle.fontStringFromTextStyle(style);
    if (dynamicOptions.overrideSize) {
      if (style._stroke) {
        style._stroke.width *= this.baseRenderedFontSize / requestedFontSize;
      }
    } else {
      style.fontSize = this.baseRenderedFontSize = requestedFontSize;
    }
    this._style = style;
    this._skipKerning = dynamicOptions.skipKerning ?? false;
    this.resolution = dynamicOptions.resolution ?? 1;
    this._padding = dynamicOptions.padding ?? 4;
    this.fontMetrics = CanvasTextMetrics.CanvasTextMetrics.measureFont(font);
    this.lineHeight = style.lineHeight || this.fontMetrics.fontSize || style.fontSize;
  }
  ensureCharacters(chars) {
    const charList = resolveCharacters.resolveCharacters(chars).filter((char) => !this._currentChars.includes(char)).filter((char, index, self) => self.indexOf(char) === index);
    if (!charList.length)
      return;
    this._currentChars = [...this._currentChars, ...charList];
    let pageData;
    if (this._currentPageIndex === -1) {
      pageData = this._nextPage();
    } else {
      pageData = this.pages[this._currentPageIndex];
    }
    let { canvas, context } = pageData.canvasAndContext;
    let textureSource = pageData.texture.source;
    const style = this._style;
    let currentX = this._currentX;
    let currentY = this._currentY;
    const fontScale = this.baseRenderedFontSize / this.baseMeasurementFontSize;
    const padding = this._padding * fontScale;
    const widthScale = style.fontStyle === "italic" ? 2 : 1;
    let maxCharHeight = 0;
    let skipTexture = false;
    for (let i = 0; i < charList.length; i++) {
      const char = charList[i];
      const metrics = CanvasTextMetrics.CanvasTextMetrics.measureText(char, style, canvas, false);
      metrics.lineHeight = metrics.height;
      const width = widthScale * metrics.width * fontScale;
      const height = metrics.height * fontScale;
      const paddedWidth = width + padding * 2;
      const paddedHeight = height + padding * 2;
      skipTexture = false;
      if (char !== "\n" && char !== "\r" && char !== "	" && char !== " ") {
        skipTexture = true;
        maxCharHeight = Math.ceil(Math.max(paddedHeight, maxCharHeight));
      }
      if (currentX + paddedWidth > this._textureSize) {
        currentY += maxCharHeight;
        maxCharHeight = paddedHeight;
        currentX = 0;
        if (currentY + maxCharHeight > this._textureSize) {
          textureSource.update();
          const pageData2 = this._nextPage();
          canvas = pageData2.canvasAndContext.canvas;
          context = pageData2.canvasAndContext.context;
          textureSource = pageData2.texture.source;
          currentY = 0;
        }
      }
      const xAdvance = width / fontScale - (style.dropShadow?.distance ?? 0) - (style._stroke?.width ?? 0);
      this.chars[char] = {
        id: char.codePointAt(0),
        xOffset: -this._padding,
        yOffset: -this._padding,
        xAdvance,
        kerning: {}
      };
      if (skipTexture) {
        this._drawGlyph(
          context,
          metrics,
          currentX + padding,
          currentY + padding,
          fontScale,
          style
        );
        const px = textureSource.width * fontScale;
        const py = textureSource.height * fontScale;
        const frame = new Rectangle.Rectangle(
          currentX / px * textureSource.width,
          currentY / py * textureSource.height,
          paddedWidth / px * textureSource.width,
          paddedHeight / py * textureSource.height
        );
        this.chars[char].texture = new Texture.Texture({
          source: textureSource,
          frame
        });
        currentX += Math.ceil(paddedWidth);
      }
    }
    textureSource.update();
    this._currentX = currentX;
    this._currentY = currentY;
    this._skipKerning && this._applyKerning(charList, context);
  }
  /**
   * @deprecated since 8.0.0
   * The map of base page textures (i.e., sheets of glyphs).
   */
  get pageTextures() {
    deprecation.deprecation(deprecation.v8_0_0, "BitmapFont.pageTextures is deprecated, please use BitmapFont.pages instead.");
    return this.pages;
  }
  _applyKerning(newChars, context) {
    const measureCache = this._measureCache;
    for (let i = 0; i < newChars.length; i++) {
      const first = newChars[i];
      for (let j = 0; j < this._currentChars.length; j++) {
        const second = this._currentChars[j];
        let c1 = measureCache[first];
        if (!c1)
          c1 = measureCache[first] = context.measureText(first).width;
        let c2 = measureCache[second];
        if (!c2)
          c2 = measureCache[second] = context.measureText(second).width;
        let total = context.measureText(first + second).width;
        let amount = total - (c1 + c2);
        if (amount) {
          this.chars[first].kerning[second] = amount;
        }
        total = context.measureText(first + second).width;
        amount = total - (c1 + c2);
        if (amount) {
          this.chars[second].kerning[first] = amount;
        }
      }
    }
  }
  _nextPage() {
    this._currentPageIndex++;
    const textureResolution = this.resolution;
    const canvasAndContext = CanvasPool.CanvasPool.getOptimalCanvasAndContext(
      this._textureSize,
      this._textureSize,
      textureResolution
    );
    this._setupContext(canvasAndContext.context, this._style, textureResolution);
    const resolution = textureResolution * (this.baseRenderedFontSize / this.baseMeasurementFontSize);
    const texture = new Texture.Texture({
      source: new ImageSource.ImageSource({
        resource: canvasAndContext.canvas,
        resolution,
        alphaMode: "premultiply-alpha-on-upload",
        autoGenerateMipmaps: this._mipmap
      })
    });
    const pageData = {
      canvasAndContext,
      texture
    };
    this.pages[this._currentPageIndex] = pageData;
    return pageData;
  }
  // canvas style!
  _setupContext(context, style, resolution) {
    style.fontSize = this.baseRenderedFontSize;
    context.scale(resolution, resolution);
    context.font = fontStringFromTextStyle.fontStringFromTextStyle(style);
    style.fontSize = this.baseMeasurementFontSize;
    context.textBaseline = style.textBaseline;
    const stroke = style._stroke;
    const strokeThickness = stroke?.width ?? 0;
    if (stroke) {
      context.lineWidth = strokeThickness;
      context.lineJoin = stroke.join;
      context.miterLimit = stroke.miterLimit;
      context.strokeStyle = getCanvasFillStyle.getCanvasFillStyle(stroke, context);
    }
    if (style._fill) {
      context.fillStyle = getCanvasFillStyle.getCanvasFillStyle(style._fill, context);
    }
    if (style.dropShadow) {
      const shadowOptions = style.dropShadow;
      const rgb = Color.Color.shared.setValue(shadowOptions.color).toArray();
      const dropShadowBlur = shadowOptions.blur * resolution;
      const dropShadowDistance = shadowOptions.distance * resolution;
      context.shadowColor = `rgba(${rgb[0] * 255},${rgb[1] * 255},${rgb[2] * 255},${shadowOptions.alpha})`;
      context.shadowBlur = dropShadowBlur;
      context.shadowOffsetX = Math.cos(shadowOptions.angle) * dropShadowDistance;
      context.shadowOffsetY = Math.sin(shadowOptions.angle) * dropShadowDistance;
    } else {
      context.shadowColor = "black";
      context.shadowBlur = 0;
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 0;
    }
  }
  _drawGlyph(context, metrics, x, y, fontScale, style) {
    const char = metrics.text;
    const fontProperties = metrics.fontProperties;
    const stroke = style._stroke;
    const strokeThickness = (stroke?.width ?? 0) * fontScale;
    const tx = x + strokeThickness / 2;
    const ty = y - strokeThickness / 2;
    const descent = fontProperties.descent * fontScale;
    const lineHeight = metrics.lineHeight * fontScale;
    if (style.stroke && strokeThickness) {
      context.strokeText(char, tx, ty + lineHeight - descent);
    }
    if (style._fill) {
      context.fillText(char, tx, ty + lineHeight - descent);
    }
  }
  destroy() {
    super.destroy();
    for (let i = 0; i < this.pages.length; i++) {
      const { canvasAndContext, texture } = this.pages[i];
      canvasAndContext.canvas.width = canvasAndContext.canvas.width;
      CanvasPool.CanvasPool.returnCanvasAndContext(canvasAndContext);
      texture.destroy(true);
    }
    this.pages = null;
  }
};
_DynamicBitmapFont.defaultOptions = {
  textureSize: 512,
  style: new TextStyle.TextStyle(),
  mipmap: true
};
let DynamicBitmapFont = _DynamicBitmapFont;

exports.DynamicBitmapFont = DynamicBitmapFont;
//# sourceMappingURL=DynamicBitmapFont.js.map
