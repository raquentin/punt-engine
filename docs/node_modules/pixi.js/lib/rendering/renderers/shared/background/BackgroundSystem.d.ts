import { Color } from '../../../../color/Color';
import { ExtensionType } from '../../../../extensions/Extensions';
import type { ColorSource, RgbaArray } from '../../../../color/Color';
import type { System } from '../system/System';
/**
 * Options for the background system.
 * @property {ColorSource} [backgroundColor='black']
 * The background color used to clear the canvas. See {@link ColorSource} for accepted color values.
 * @property {ColorSource} [background] - Alias for backgroundColor
 * @property {number} [backgroundAlpha=1] -
 * Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
 * @property {boolean} [clearBeforeRender=true] - Whether to clear the canvas before new render passes.
 * @memberof rendering
 */
export interface BackgroundSystemOptions {
    /**
     * The background color used to clear the canvas. See {@link ColorSource} for accepted color values.
     * @memberof rendering.SharedRendererOptions
     * @default 'black'
     */
    backgroundColor: ColorSource;
    /**
     * Alias for backgroundColor
     * @memberof rendering.SharedRendererOptions
     */
    background?: ColorSource;
    /**
     * Transparency of the background color, value from `0` (fully transparent) to `1` (fully opaque).
     * @memberof rendering.SharedRendererOptions
     * @default 1
     */
    backgroundAlpha: number;
    /**
     * Whether to clear the canvas before new render passes.
     * @memberof rendering.SharedRendererOptions
     * @default true
     */
    clearBeforeRender: boolean;
}
/**
 * The background system manages the background color and alpha of the main view.
 * @memberof rendering
 */
export declare class BackgroundSystem implements System<BackgroundSystemOptions> {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "background";
        readonly priority: 0;
    };
    /** default options used by the system */
    static defaultOptions: BackgroundSystemOptions;
    /**
     * This sets if the CanvasRenderer will clear the canvas or not before the new render pass.
     * If the scene is NOT transparent PixiJS will use a canvas sized fillRect operation every
     * frame to set the canvas background color. If the scene is transparent PixiJS will use clearRect
     * to clear the canvas every frame. Disable this by setting this to false. For example, if
     * your game has a canvas filling background image you often don't need this set.
     */
    clearBeforeRender: boolean;
    private readonly _backgroundColor;
    constructor();
    /**
     * initiates the background system
     * @param options - the options for the background colors
     */
    init(options: BackgroundSystemOptions): void;
    /** The background color to fill if not transparent */
    get color(): Color;
    set color(value: ColorSource);
    /** The background color alpha. Setting this to 0 will make the canvas transparent. */
    get alpha(): number;
    set alpha(value: number);
    /** The background color as an [R, G, B, A] array. */
    get colorRgba(): RgbaArray;
    /**
     * destroys the background system
     * @internal
     * @ignore
     */
    destroy(): void;
}
