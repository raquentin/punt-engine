import { ExtensionType } from '../../extensions/Extensions';
import { type Renderer } from '../../rendering/renderers/types';
import { HTMLTextStyle } from './HtmlTextStyle';
import type { System } from '../../rendering/renderers/shared/system/System';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
import type { HTMLTextOptions } from './HTMLText';
import type { FontCSSStyleOptions } from './utils/loadFontCSS';
/**
 * System plugin to the renderer to manage HTMLText
 * @memberof rendering
 */
export declare class HTMLTextSystem implements System {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem, ExtensionType.CanvasSystem];
        readonly name: "htmlText";
    };
    static defaultFontOptions: FontCSSStyleOptions;
    private _activeTextures;
    /**
     * WebGPU has a cors issue when uploading an image that is an SVGImage
     * To get around this we need to create a canvas draw the image to it and upload that instead.
     * Bit of a shame.. but no other work around just yet!
     */
    private readonly _createCanvas;
    private readonly _renderer;
    constructor(renderer: Renderer);
    getTexture(options: HTMLTextOptions): Promise<Texture>;
    getManagedTexture(text: string, resolution: number, style: HTMLTextStyle, textKey: string): Promise<Texture>;
    private _buildTexturePromise;
    private _increaseReferenceCount;
    decreaseReferenceCount(textKey: string): void;
    private _cleanUp;
    getReferenceCount(textKey: string): number;
    destroy(): void;
}
