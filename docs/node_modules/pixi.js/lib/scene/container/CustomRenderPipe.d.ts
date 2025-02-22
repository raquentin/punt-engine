import { ExtensionType } from '../../extensions/Extensions';
import type { InstructionSet } from '../../rendering/renderers/shared/instructions/InstructionSet';
import type { InstructionPipe } from '../../rendering/renderers/shared/instructions/RenderPipe';
import type { Renderer } from '../../rendering/renderers/types';
import type { RenderContainer } from './RenderContainer';
/**
 * The CustomRenderPipe is a render pipe that allows for custom rendering logic for your renderable objects.
 * @example
 * import { RenderContainer } from 'pixi.js';
 *
 * const renderContainer = new RenderContainer(
 * (renderer) =>  {
 *     renderer.clear({
 *       clearColor: 'green', // clear the screen to green when rendering this item
 *     });
 * })
 * @memberof rendering
 */
export declare class CustomRenderPipe implements InstructionPipe<RenderContainer> {
    static extension: {
        readonly type: readonly [ExtensionType.WebGLPipes, ExtensionType.WebGPUPipes, ExtensionType.CanvasPipes];
        readonly name: "customRender";
    };
    private _renderer;
    constructor(renderer: Renderer);
    addRenderable(container: RenderContainer, instructionSet: InstructionSet): void;
    execute(container: RenderContainer): void;
    destroy(): void;
}
