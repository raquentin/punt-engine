import type { InstructionSet } from '../../../rendering/renderers/shared/instructions/InstructionSet';
import type { Renderer, RenderPipes } from '../../../rendering/renderers/types';
import type { Container } from '../Container';
import type { RenderGroup } from '../RenderGroup';
/**
 * @param renderGroup
 * @param renderPipes
 * @deprecated since 8.3.0
 */
export declare function buildInstructions(renderGroup: RenderGroup, renderPipes: RenderPipes): void;
export declare function buildInstructions(renderGroup: RenderGroup, renderer: Renderer): void;
/**
 * @param container
 * @param instructionSet
 * @param renderer
 * @deprecated since 8.3.0
 */
export declare function collectAllRenderables(container: Container, instructionSet: InstructionSet, renderer: RenderPipes): void;
export declare function collectAllRenderables(container: Container, instructionSet: InstructionSet, renderer: Renderer): void;
