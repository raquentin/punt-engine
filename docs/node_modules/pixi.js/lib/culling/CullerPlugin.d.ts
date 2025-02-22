import type { ExtensionMetadata } from '../extensions/Extensions';
import type { Renderer } from '../rendering/renderers/types';
import type { Container } from '../scene/container/Container';
/**
 * An {@link app.Application} plugin that will automatically cull your stage using the renderers screen size.
 * @example
 * import { extensions, CullerPlugin } from 'pixi.js';
 *
 * extensions.add(CullerPlugin);
 * @memberof app
 * @see {@link scene.Culler}
 */
export declare class CullerPlugin {
    /** @ignore */
    static extension: ExtensionMetadata;
    static renderer: Renderer;
    static stage: Container;
    static render: () => void;
    private static _renderRef;
    static init(): void;
    static destroy(): void;
}
