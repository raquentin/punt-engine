import type { Container } from '../../scene/container/Container';
import type { RenderGroup } from '../../scene/container/RenderGroup';
export declare function logScene(container: Container, depth?: number, data?: {
    color?: string;
}): void;
export declare function logRenderGroupScene(renderGroup: RenderGroup, depth?: number, data?: {
    index: number;
    color?: string;
}): void;
