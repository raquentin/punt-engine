import { LoaderParserPriority } from '../../assets/loader/parsers/LoaderParser';
import { ExtensionType } from '../../extensions/Extensions';
import type { Loader } from '../../assets/loader/Loader';
import type { ResolvedAsset } from '../../assets/types';
import type { Texture } from '../../rendering/renderers/shared/texture/Texture';
/** Loads KTX textures! */
export declare const loadBasis: {
    extension: {
        type: ExtensionType.LoadParser;
        priority: LoaderParserPriority;
        name: string;
    };
    name: string;
    test(url: string): boolean;
    load<T>(url: string, _asset: ResolvedAsset, loader: Loader): Promise<Texture | Texture[]>;
    unload(texture: Texture | Texture[]): void;
};
