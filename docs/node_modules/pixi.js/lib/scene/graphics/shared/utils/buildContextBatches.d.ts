import type { ShapeBuildCommand } from '../buildCommands/ShapeBuildCommand';
import type { GraphicsContext } from '../GraphicsContext';
import type { GpuGraphicsContext } from '../GraphicsContextSystem';
export declare const shapeBuilders: Record<string, ShapeBuildCommand>;
export declare function buildContextBatches(context: GraphicsContext, gpuContext: GpuGraphicsContext): void;
