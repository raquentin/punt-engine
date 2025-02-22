import { extensions, ExtensionType } from '../extensions/Extensions.mjs';
import { autoDetectRenderer } from '../rendering/renderers/autoDetectRenderer.mjs';
import { Container } from '../scene/container/Container.mjs';
import { ApplicationInitHook } from '../utils/global/globalHooks.mjs';
import { deprecation, v8_0_0 } from '../utils/logging/deprecation.mjs';

"use strict";
const _Application = class _Application {
  /** @ignore */
  constructor(...args) {
    /** The root display container that's rendered. */
    this.stage = new Container();
    if (args[0] !== void 0) {
      deprecation(v8_0_0, "Application constructor options are deprecated, please use Application.init() instead.");
    }
  }
  /**
   * @param options - The optional application and renderer parameters.
   */
  async init(options) {
    options = { ...options };
    this.renderer = await autoDetectRenderer(options);
    _Application._plugins.forEach((plugin) => {
      plugin.init.call(this, options);
    });
  }
  /** Render the current stage. */
  render() {
    this.renderer.render({ container: this.stage });
  }
  /**
   * Reference to the renderer's canvas element.
   * @readonly
   * @member {HTMLCanvasElement}
   */
  get canvas() {
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's canvas element.
   * @member {HTMLCanvasElement}
   * @deprecated since 8.0.0
   */
  get view() {
    deprecation(v8_0_0, "Application.view is deprecated, please use Application.canvas instead.");
    return this.renderer.canvas;
  }
  /**
   * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
   * @readonly
   */
  get screen() {
    return this.renderer.screen;
  }
  /**
   * Destroys the application and all of its resources.
   * @param {object|boolean}[rendererDestroyOptions=false] - The options for destroying the renderer.
   * @param {boolean}[rendererDestroyOptions.removeView=false] - Removes the Canvas element from the DOM.
   * @param {object|boolean} [options=false] - The options for destroying the stage.
   * @param {boolean} [options.children=false] - If set to true, all the children will have their destroy method
   * called as well. `options` will be passed on to those calls.
   * @param {boolean} [options.texture=false] - Only used for children with textures e.g. Sprites.
   * If options.children is set to true,
   * it should destroy the texture of the child sprite.
   * @param {boolean} [options.textureSource=false] - Only used for children with textures e.g. Sprites.
   *  If options.children is set to true,
   * it should destroy the texture source of the child sprite.
   * @param {boolean} [options.context=false] - Only used for children with graphicsContexts e.g. Graphics.
   * If options.children is set to true,
   * it should destroy the context of the child graphics.
   */
  destroy(rendererDestroyOptions = false, options = false) {
    const plugins = _Application._plugins.slice(0);
    plugins.reverse();
    plugins.forEach((plugin) => {
      plugin.destroy.call(this);
    });
    this.stage.destroy(options);
    this.stage = null;
    this.renderer.destroy(rendererDestroyOptions);
    this.renderer = null;
  }
};
/**
 * Collection of installed plugins.
 * @alias _plugins
 */
_Application._plugins = [];
let Application = _Application;
extensions.handleByList(ExtensionType.Application, Application._plugins);
extensions.add(ApplicationInitHook);

export { Application };
//# sourceMappingURL=Application.mjs.map
