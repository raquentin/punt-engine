import { GraphicsContext } from '../../../../scene/graphics/shared/GraphicsContext';
import { type LoaderParser } from '../LoaderParser';
import type { TextureSourceOptions } from '../../../../rendering/renderers/shared/texture/sources/TextureSource';
import type { Texture } from '../../../../rendering/renderers/shared/texture/Texture';
/**
 * Configuration for the [loadSVG]{@link assets.loadSVG} plugin.
 * @see assets.loadSVG
 * @memberof assets
 */
export interface LoadSVGConfig {
    /**
     * The crossOrigin value to use for loading the SVG as an image.
     * @default 'anonymous'
     */
    crossOrigin: HTMLImageElement['crossOrigin'];
    /**
     * When set to `true`, loading and decoding images will happen with `new Image()`,
     * @default false
     */
    parseAsGraphicsContext: boolean;
}
/**
 * A simple loader plugin for loading json data
 * @memberof assets
 */
export declare const loadSvg: LoaderParser<Texture | GraphicsContext, TextureSourceOptions & LoadSVGConfig, LoadSVGConfig>;
