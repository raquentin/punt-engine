import { Container } from '../scene/container/Container';
import type { Rectangle } from '../maths/shapes/Rectangle';
import type { AutoDetectOptions } from '../rendering/renderers/autoDetectRenderer';
import type { RendererDestroyOptions } from '../rendering/renderers/shared/system/AbstractRenderer';
import type { Renderer } from '../rendering/renderers/types';
import type { DestroyOptions } from '../scene/container/destroyTypes';
/**
 * The app module provides a set of classes to use as a starting point when building applications.
 *
 * <aside>This module has a mixin for <code>TickerPlugin</code> and <code>ResizePlugin</code>.
 * These will need to be imported if you are managing your own renderer.</aside>
 *
 * ```js
 * import { Application } from 'pixi.js';
 *
 * const app = new Application();
 *
 * await app.init();
 *
 * // don't forget to add the canvas to the DOM
 * document.body.appendChild(app.canvas);
 * ```
 * @namespace app
 */
/**
 * Any plugin that's usable for Application should contain these methods.
 * @example
 * import { ApplicationPlugin } from 'pixi.js';
 *
 * const plugin: ApplicationPlugin = {
 *    init: (options: Partial<ApplicationOptions>) =>
 *    {
 *       // handle init here, use app options if needed
 *    },
 *    destroy: () =>
 *    {
 *       // handle destruction code here
 *    }
 * }
 * @memberof app
 * @see {@link app.ApplicationOptions}
 * @ignore
 */
export interface ApplicationPlugin {
    /**
     * Called when Application is constructed, scoped to Application instance.
     * Passes in `options` as the only argument, which are Application `init()` options.
     * @param {object} options - Application options.
     */
    init(options: Partial<ApplicationOptions>): void;
    /** Called when destroying Application, scoped to Application instance. */
    destroy(): void;
}
/**
 * Application options supplied to the {@link app.Application#init} method.
 * @memberof app
 * @example
 * import { Application } from 'pixi.js';
 *
 * const app = new Application();
 *
 * await app.init({
 *    autoStart: false,
 *    resizeTo: window,
 *    sharedTicker: true,
 * });
 */
export interface ApplicationOptions extends AutoDetectOptions, PixiMixins.ApplicationOptions {
}
export interface Application extends PixiMixins.Application {
}
/**
 * Convenience class to create a new PixiJS application.
 *
 * This class automatically creates the renderer, ticker and root container.
 * @example
 * import { Application, Sprite } from 'pixi.js';
 *
 * // Create the application
 * const app = new Application();
 *
 * await app.init({ width: 800, height: 600 });
 *
 * // Add the view to the DOM
 * document.body.appendChild(app.canvas);
 *
 * // ex, add display objects
 * app.stage.addChild(Sprite.from('something.png'));
 * @memberof app
 */
export declare class Application<R extends Renderer = Renderer> {
    /**
     * Collection of installed plugins.
     * @alias _plugins
     */
    static _plugins: ApplicationPlugin[];
    /** The root display container that's rendered. */
    stage: Container;
    /**
     * WebGL renderer if available, otherwise CanvasRenderer.
     * @member {rendering.Renderer}
     */
    renderer: R;
    /** Create new Application instance */
    constructor();
    /** @deprecated since 8.0.0 */
    constructor(options?: Partial<ApplicationOptions>);
    /**
     * @param options - The optional application and renderer parameters.
     */
    init(options?: Partial<ApplicationOptions>): Promise<void>;
    /** Render the current stage. */
    render(): void;
    /**
     * Reference to the renderer's canvas element.
     * @readonly
     * @member {HTMLCanvasElement}
     */
    get canvas(): R['canvas'];
    /**
     * Reference to the renderer's canvas element.
     * @member {HTMLCanvasElement}
     * @deprecated since 8.0.0
     */
    get view(): R['canvas'];
    /**
     * Reference to the renderer's screen rectangle. Its safe to use as `filterArea` or `hitArea` for the whole screen.
     * @readonly
     */
    get screen(): Rectangle;
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
    destroy(rendererDestroyOptions?: RendererDestroyOptions, options?: DestroyOptions): void;
}
