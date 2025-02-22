import { ExtensionType } from '../../extensions/Extensions';
export declare const validFormats: string[];
export declare const resolveCompressedTextureUrl: {
    extension: ExtensionType.ResolveParser;
    test: (value: string) => boolean;
    parse: (value: string) => {
        resolution: number;
        format: string;
        src: string;
    };
};
