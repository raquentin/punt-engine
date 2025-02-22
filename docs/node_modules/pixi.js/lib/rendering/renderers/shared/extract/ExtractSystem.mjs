import { ExtensionType } from '../../../../extensions/Extensions.mjs';
import { Container } from '../../../../scene/container/Container.mjs';
import { Texture } from '../texture/Texture.mjs';

"use strict";
const imageTypes = {
  png: "image/png",
  jpg: "image/jpeg",
  webp: "image/webp"
};
const _ExtractSystem = class _ExtractSystem {
  /** @param renderer - The renderer this System works for. */
  constructor(renderer) {
    this._renderer = renderer;
  }
  _normalizeOptions(options, defaults = {}) {
    if (options instanceof Container || options instanceof Texture) {
      return {
        target: options,
        ...defaults
      };
    }
    return {
      ...defaults,
      ...options
    };
  }
  /**
   * Will return a HTML Image of the target
   * @param options - The options for creating the image, or the target to extract
   * @returns - HTML Image of the target
   */
  async image(options) {
    const image = new Image();
    image.src = await this.base64(options);
    return image;
  }
  /**
   * Will return a base64 encoded string of this target. It works by calling
   * `Extract.canvas` and then running toDataURL on that.
   * @param options - The options for creating the image, or the target to extract
   */
  async base64(options) {
    options = this._normalizeOptions(
      options,
      _ExtractSystem.defaultImageOptions
    );
    const { format, quality } = options;
    const canvas = this.canvas(options);
    if (canvas.toBlob !== void 0) {
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (!blob) {
            reject(new Error("ICanvas.toBlob failed!"));
            return;
          }
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        }, imageTypes[format], quality);
      });
    }
    if (canvas.toDataURL !== void 0) {
      return canvas.toDataURL(imageTypes[format], quality);
    }
    if (canvas.convertToBlob !== void 0) {
      const blob = await canvas.convertToBlob({ type: imageTypes[format], quality });
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    }
    throw new Error("Extract.base64() requires ICanvas.toDataURL, ICanvas.toBlob, or ICanvas.convertToBlob to be implemented");
  }
  /**
   * Creates a Canvas element, renders this target to it and then returns it.
   * @param options - The options for creating the canvas, or the target to extract
   * @returns - A Canvas element with the texture rendered on.
   */
  canvas(options) {
    options = this._normalizeOptions(options);
    const target = options.target;
    const renderer = this._renderer;
    if (target instanceof Texture) {
      return renderer.texture.generateCanvas(target);
    }
    const texture = renderer.textureGenerator.generateTexture(options);
    const canvas = renderer.texture.generateCanvas(texture);
    texture.destroy();
    return canvas;
  }
  /**
   * Will return a one-dimensional array containing the pixel data of the entire texture in RGBA
   * order, with integer values between 0 and 255 (included).
   * @param options - The options for extracting the image, or the target to extract
   * @returns - One-dimensional array containing the pixel data of the entire texture
   */
  pixels(options) {
    options = this._normalizeOptions(options);
    const target = options.target;
    const renderer = this._renderer;
    const texture = target instanceof Texture ? target : renderer.textureGenerator.generateTexture(options);
    const pixelInfo = renderer.texture.getPixels(texture);
    if (target instanceof Container) {
      texture.destroy();
    }
    return pixelInfo;
  }
  /**
   * Will return a texture of the target
   * @param options - The options for creating the texture, or the target to extract
   * @returns - A texture of the target
   */
  texture(options) {
    options = this._normalizeOptions(options);
    if (options.target instanceof Texture)
      return options.target;
    return this._renderer.textureGenerator.generateTexture(options);
  }
  /**
   * Will extract a HTMLImage of the target and download it
   * @param options - The options for downloading and extracting the image, or the target to extract
   */
  download(options) {
    options = this._normalizeOptions(options);
    const canvas = this.canvas(options);
    const link = document.createElement("a");
    link.download = options.filename ?? "image.png";
    link.href = canvas.toDataURL("image/png");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  /**
   * Logs the target to the console as an image. This is a useful way to debug what's happening in the renderer.
   * @param options - The options for logging the image, or the target to log
   */
  log(options) {
    const width = options.width ?? 200;
    options = this._normalizeOptions(options);
    const canvas = this.canvas(options);
    const base64 = canvas.toDataURL();
    console.log(`[Pixi Texture] ${canvas.width}px ${canvas.height}px`);
    const style = [
      "font-size: 1px;",
      `padding: ${width}px ${300}px;`,
      `background: url(${base64}) no-repeat;`,
      "background-size: contain;"
    ].join(" ");
    console.log("%c ", style);
  }
  destroy() {
    this._renderer = null;
  }
};
/** @ignore */
_ExtractSystem.extension = {
  type: [
    ExtensionType.WebGLSystem,
    ExtensionType.WebGPUSystem
  ],
  name: "extract"
};
/** Default options for creating an image. */
_ExtractSystem.defaultImageOptions = {
  /** The format of the image. */
  format: "png",
  /** The quality of the image. */
  quality: 1
};
let ExtractSystem = _ExtractSystem;

export { ExtractSystem };
//# sourceMappingURL=ExtractSystem.mjs.map
