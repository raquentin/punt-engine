import type { VertexFormat } from '../const';
export declare function getAttributeInfoFromFormat(format: VertexFormat): {
    size: number;
    stride: number;
    normalised: boolean;
};
