import { Ticker } from '../ticker/Ticker';
import type { ExtensionMetadata } from '../extensions/Extensions';
/**
 * Application options for the {@link app.TickerPlugin}.
 * @memberof app
 * @property {boolean} [autoStart=true] - Automatically starts the rendering after the construction.
 * **Note**: Setting this parameter to `false` does NOT stop the shared ticker even if you set
 * `options.sharedTicker` to `true` in case that it is already started. Stop it by your own.
 * @property {boolean} [sharedTicker=false] - Set`true` to use `Ticker.shared`, `false` to create new ticker.
 * If set to `false`, you cannot register a handler to occur before anything that runs on the shared ticker.
 * The system ticker will always run before both the shared ticker and the app ticker.
 */
export interface TickerPluginOptions {
    /**
     * Automatically starts the rendering after the construction.
     *  **Note**: Setting this parameter to `false` does NOT stop the shared ticker even if you set
     *  `options.sharedTicker` to `true` in case that it is already started. Stop it by your own.
     * @memberof app.ApplicationOptions
     * @default true
     */
    autoStart?: boolean;
    /**
     * Set`true` to use `Ticker.shared`, `false` to create new ticker.
     *  If set to `false`, you cannot register a handler to occur before anything that runs on the shared ticker.
     *  The system ticker will always run before both the shared ticker and the app ticker.
     * @memberof app.ApplicationOptions
     * @default false
     */
    sharedTicker?: boolean;
}
/**
 * Middleware for Application's {@link ticker.Ticker} functionality.
 *
 * Adds the following methods to {@link app.Application}:
 * * {@link app.Application#start}
 * * {@link app.Application#stop}
 * * {@link app.Application#ticker}
 * @example
 * import { extensions, TickerPlugin } from 'pixi.js';
 *
 * extensions.add(TickerPlugin);
 * @memberof app
 */
export declare class TickerPlugin {
    /** @ignore */
    static extension: ExtensionMetadata;
    static start: () => void;
    static stop: () => void;
    private static _ticker;
    static ticker: Ticker;
    /**
     * Initialize the plugin with scope of application instance
     * @static
     * @private
     * @param {object} [options] - See application options
     */
    static init(options?: PixiMixins.ApplicationOptions): void;
    /**
     * Clean up the ticker, scoped to application.
     * @static
     * @private
     */
    static destroy(): void;
}
