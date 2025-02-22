import { Color } from '../../../color/Color.mjs';
import { ExtensionType } from '../../../extensions/Extensions.mjs';
import { nextPow2 } from '../../../maths/misc/pow2.mjs';
import { CanvasPool } from '../../../rendering/renderers/shared/texture/CanvasPool.mjs';
import { TexturePool } from '../../../rendering/renderers/shared/texture/TexturePool.mjs';
import { getCanvasBoundingBox } from '../../../utils/canvas/getCanvasBoundingBox.mjs';
import { deprecation } from '../../../utils/logging/deprecation.mjs';
import { TextStyle } from '../TextStyle.mjs';
import { getPo2TextureFromSource } from '../utils/getPo2TextureFromSource.mjs';
import { CanvasTextMetrics } from './CanvasTextMetrics.mjs';
import { fontStringFromTextStyle } from './utils/fontStringFromTextStyle.mjs';
import { getCanvasFillStyle } from './utils/getCanvasFillStyle.mjs';

"use strict";
class CanvasTextSystem {
  constructor(_renderer) {
    this._activeTextures = {};
    this._renderer = _renderer;
  }
  getTextureSize(text, resolution, style) {
    const measured = CanvasTextMetrics.measureText(text || " ", style);
    let width = Math.ceil(Math.ceil(Math.max(1, measured.width) + style.padding * 2) * resolution);
    let height = Math.ceil(Math.ceil(Math.max(1, measured.height) + style.padding * 2) * resolution);
    width = Math.ceil(width - 1e-6);
    height = Math.ceil(height - 1e-6);
    width = nextPow2(width);
    height = nextPow2(height);
    return { width, height };
  }
  getTexture(options, resolution, style, _textKey) {
    if (typeof options === "string") {
      deprecation("8.0.0", "CanvasTextSystem.getTexture: Use object TextOptions instead of separate arguments");
      options = {
        text: options,
        style,
        resolution
      };
    }
    if (!(options.style instanceof TextStyle)) {
      options.style = new TextStyle(options.style);
    }
    const { texture, canvasAndContext } = this.createTextureAndCanvas(
      options
    );
    this._renderer.texture.initSource(texture._source);
    CanvasPool.returnCanvasAndContext(canvasAndContext);
    return texture;
  }
  createTextureAndCanvas(options) {
    const { text, style } = options;
    const resolution = options.resolution ?? this._renderer.resolution;
    const measured = CanvasTextMetrics.measureText(text || " ", style);
    const width = Math.ceil(Math.ceil(Math.max(1, measured.width) + style.padding * 2) * resolution);
    const height = Math.ceil(Math.ceil(Math.max(1, measured.height) + style.padding * 2) * resolution);
    const canvasAndContext = CanvasPool.getOptimalCanvasAndContext(width, height);
    const { canvas } = canvasAndContext;
    this.renderTextToCanvas(text, style, resolution, canvasAndContext);
    const texture = getPo2TextureFromSource(canvas, width, height, resolution);
    if (style.trim) {
      const trimmed = getCanvasBoundingBox(canvas, resolution);
      texture.frame.copyFrom(trimmed);
      texture.updateUvs();
    }
    return { texture, canvasAndContext };
  }
  getManagedTexture(text) {
    text._resolution = text._autoResolution ? this._renderer.resolution : text.resolution;
    const textKey = text._getKey();
    if (this._activeTextures[textKey]) {
      this._increaseReferenceCount(textKey);
      return this._activeTextures[textKey].texture;
    }
    const { texture, canvasAndContext } = this.createTextureAndCanvas(text);
    this._activeTextures[textKey] = {
      canvasAndContext,
      texture,
      usageCount: 1
    };
    return texture;
  }
  _increaseReferenceCount(textKey) {
    this._activeTextures[textKey].usageCount++;
  }
  decreaseReferenceCount(textKey) {
    const activeTexture = this._activeTextures[textKey];
    activeTexture.usageCount--;
    if (activeTexture.usageCount === 0) {
      CanvasPool.returnCanvasAndContext(activeTexture.canvasAndContext);
      TexturePool.returnTexture(activeTexture.texture);
      const source = activeTexture.texture.source;
      source.resource = null;
      source.uploadMethodId = "unknown";
      source.alphaMode = "no-premultiply-alpha";
      this._activeTextures[textKey] = null;
    }
  }
  getReferenceCount(textKey) {
    return this._activeTextures[textKey].usageCount;
  }
  /**
   * Renders text to its canvas, and updates its texture.
   *
   * By default this is used internally to ensure the texture is correct before rendering,
   * but it can be used called externally, for example from this class to 'pre-generate' the texture from a piece of text,
   * and then shared across multiple Sprites.
   * @param text
   * @param style
   * @param resolution
   * @param canvasAndContext
   */
  renderTextToCanvas(text, style, resolution, canvasAndContext) {
    const { canvas, context } = canvasAndContext;
    const font = fontStringFromTextStyle(style);
    const measured = CanvasTextMetrics.measureText(text || " ", style);
    const lines = measured.lines;
    const lineHeight = measured.lineHeight;
    const lineWidths = measured.lineWidths;
    const maxLineWidth = measured.maxLineWidth;
    const fontProperties = measured.fontProperties;
    const height = canvas.height;
    context.resetTransform();
    context.scale(resolution, resolution);
    const padding = style.padding * 2;
    context.clearRect(0, 0, measured.width + 4 + padding, measured.height + 4 + padding);
    if (style._stroke?.width) {
      const strokeStyle = style._stroke;
      context.lineWidth = strokeStyle.width;
      context.miterLimit = strokeStyle.miterLimit;
      context.lineJoin = strokeStyle.join;
      context.lineCap = strokeStyle.cap;
    }
    context.font = font;
    let linePositionX;
    let linePositionY;
    const passesCount = style.dropShadow ? 2 : 1;
    for (let i = 0; i < passesCount; ++i) {
      const isShadowPass = style.dropShadow && i === 0;
      const dsOffsetText = isShadowPass ? Math.ceil(Math.max(1, height) + style.padding * 2) : 0;
      const dsOffsetShadow = dsOffsetText * resolution;
      if (isShadowPass) {
        context.fillStyle = "black";
        context.strokeStyle = "black";
        const shadowOptions = style.dropShadow;
        const dropShadowColor = shadowOptions.color;
        const dropShadowAlpha = shadowOptions.alpha;
        context.shadowColor = Color.shared.setValue(dropShadowColor).setAlpha(dropShadowAlpha).toRgbaString();
        const dropShadowBlur = shadowOptions.blur * resolution;
        const dropShadowDistance = shadowOptions.distance * resolution;
        context.shadowBlur = dropShadowBlur;
        context.shadowOffsetX = Math.cos(shadowOptions.angle) * dropShadowDistance;
        context.shadowOffsetY = Math.sin(shadowOptions.angle) * dropShadowDistance + dsOffsetShadow;
      } else {
        context.globalAlpha = style._fill?.alpha ?? 1;
        context.fillStyle = style._fill ? getCanvasFillStyle(style._fill, context) : null;
        if (style._stroke?.width) {
          context.strokeStyle = getCanvasFillStyle(style._stroke, context);
        }
        context.shadowColor = "black";
      }
      let linePositionYShift = (lineHeight - fontProperties.fontSize) / 2;
      if (lineHeight - fontProperties.fontSize < 0) {
        linePositionYShift = 0;
      }
      const strokeWidth = style._stroke?.width ?? 0;
      for (let i2 = 0; i2 < lines.length; i2++) {
        linePositionX = strokeWidth / 2;
        linePositionY = strokeWidth / 2 + i2 * lineHeight + fontProperties.ascent + linePositionYShift;
        if (style.align === "right") {
          linePositionX += maxLineWidth - lineWidths[i2];
        } else if (style.align === "center") {
          linePositionX += (maxLineWidth - lineWidths[i2]) / 2;
        }
        if (style._stroke?.width) {
          this._drawLetterSpacing(
            lines[i2],
            style,
            canvasAndContext,
            linePositionX + style.padding,
            linePositionY + style.padding - dsOffsetText,
            true
          );
        }
        if (style._fill !== void 0) {
          this._drawLetterSpacing(
            lines[i2],
            style,
            canvasAndContext,
            linePositionX + style.padding,
            linePositionY + style.padding - dsOffsetText
          );
        }
      }
    }
  }
  /**
   * Render the text with letter-spacing.
   * @param text - The text to draw
   * @param style
   * @param canvasAndContext
   * @param x - Horizontal position to draw the text
   * @param y - Vertical position to draw the text
   * @param isStroke - Is this drawing for the outside stroke of the
   *  text? If not, it's for the inside fill
   */
  _drawLetterSpacing(text, style, canvasAndContext, x, y, isStroke = false) {
    const { context } = canvasAndContext;
    const letterSpacing = style.letterSpacing;
    let useExperimentalLetterSpacing = false;
    if (CanvasTextMetrics.experimentalLetterSpacingSupported) {
      if (CanvasTextMetrics.experimentalLetterSpacing) {
        context.letterSpacing = `${letterSpacing}px`;
        context.textLetterSpacing = `${letterSpacing}px`;
        useExperimentalLetterSpacing = true;
      } else {
        context.letterSpacing = "0px";
        context.textLetterSpacing = "0px";
      }
    }
    if (letterSpacing === 0 || useExperimentalLetterSpacing) {
      if (isStroke) {
        context.strokeText(text, x, y);
      } else {
        context.fillText(text, x, y);
      }
      return;
    }
    let currentPosition = x;
    const stringArray = CanvasTextMetrics.graphemeSegmenter(text);
    let previousWidth = context.measureText(text).width;
    let currentWidth = 0;
    for (let i = 0; i < stringArray.length; ++i) {
      const currentChar = stringArray[i];
      if (isStroke) {
        context.strokeText(currentChar, currentPosition, y);
      } else {
        context.fillText(currentChar, currentPosition, y);
      }
      let textStr = "";
      for (let j = i + 1; j < stringArray.length; ++j) {
        textStr += stringArray[j];
      }
      currentWidth = context.measureText(textStr).width;
      currentPosition += previousWidth - currentWidth + letterSpacing;
      previousWidth = currentWidth;
    }
  }
  destroy() {
    this._activeTextures = null;
  }
}
/** @ignore */
CanvasTextSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem,
    ExtensionType.CanvasSystem
  ],
  name: "canvasText"
};

export { CanvasTextSystem };
//# sourceMappingURL=CanvasTextSystem.mjs.map
