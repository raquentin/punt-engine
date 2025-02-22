export interface StencilState {
    stencilWriteMask?: number;
    stencilReadMask?: number;
    stencilFront?: {
        compare: 'always' | 'equal';
        passOp: 'increment-clamp' | 'decrement-clamp' | 'keep';
    };
    stencilBack?: {
        compare: 'always' | 'equal';
        passOp: 'increment-clamp' | 'decrement-clamp' | 'keep';
    };
}
export declare const GpuStencilModesToPixi: StencilState[];
