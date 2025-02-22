import { ExtensionType } from '../../../extensions/Extensions';
import { Shader } from '../../../rendering/renderers/shared/shader/Shader';
import type { Graphics } from '../shared/Graphics';
import type { GraphicsAdaptor, GraphicsPipe } from '../shared/GraphicsPipe';
/**
 * A GraphicsAdaptor that uses WebGL to render graphics.
 * @memberof rendering
 * @ignore
 */
export declare class GlGraphicsAdaptor implements GraphicsAdaptor {
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipesAdaptor];
        readonly name: "graphics";
    };
    shader: Shader;
    init(): void;
    execute(graphicsPipe: GraphicsPipe, renderable: Graphics): void;
    destroy(): void;
}
