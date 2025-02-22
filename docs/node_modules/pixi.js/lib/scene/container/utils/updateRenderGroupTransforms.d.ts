import { Container } from '../Container';
import type { RenderGroup } from '../RenderGroup';
export declare function updateRenderGroupTransforms(renderGroup: RenderGroup, updateChildRenderGroups?: boolean): void;
export declare function updateRenderGroupTransform(renderGroup: RenderGroup): void;
export declare function updateTransformAndChildren(container: Container, updateTick: number, updateFlags: number): void;
