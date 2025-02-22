import type { ExtensionMetadata } from '../extensions/Extensions';
import type { Renderer } from '../rendering/renderers/types';
type ResizeableRenderer = Pick<Renderer, 'resize'>;
/**
 * Application options for the {@link app.ResizePlugin}.
 * @memberof app
 * @property {Window|HTMLElement} [resizeTo=window] - Element to automatically resize the renderer to.
 */
export interface ResizePluginOptions {
    /**
     * Element to automatically resize the renderer to.
     * @memberof app.ApplicationOptions
     */
    resizeTo?: Window | HTMLElement;
}
/**
 * Middleware for Application's resize functionality.
 *
 * Adds the following methods to {@link app.Application}:
 * * {@link app.Application#resizeTo}
 * * {@link app.Application#resize}
 * * {@link app.Application#queueResize}
 * * {@link app.Application#cancelResize}
 * @example
 * import { extensions, ResizePlugin } from 'pixi.js';
 *
 * extensions.add(ResizePlugin);
 * @memberof app
 */
export declare class ResizePlugin {
    /** @ignore */
    static extension: ExtensionMetadata;
    static resizeTo: Window | HTMLElement;
    static resize: () => void;
    static renderer: ResizeableRenderer;
    static queueResize: () => void;
    static render: () => void;
    private static _resizeId;
    private static _resizeTo;
    private static _cancelResize;
    /**
     * Initialize the plugin with scope of application instance
     * @static
     * @private
     * @param {object} [options] - See application options
     */
    static init(options: ResizePluginOptions): void;
    /**
     * Clean up the ticker, scoped to application
     * @static
     * @private
     */
    static destroy(): void;
}
export {};
