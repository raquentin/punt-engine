import { LoaderParserPriority } from '../../../assets/loader/parsers/LoaderParser';
import { ExtensionType } from '../../../extensions/Extensions';
import { BitmapFont } from '../BitmapFont';
import type { Loader } from '../../../assets/loader/Loader';
import type { ResolvedAsset } from '../../../assets/types';
/** simple loader plugin for loading in bitmap fonts! */
export declare const bitmapFontCachePlugin: {
    extension: {
        type: ExtensionType.CacheParser;
        name: string;
    };
    test: (asset: BitmapFont) => boolean;
    getCacheableAssets(keys: string[], asset: BitmapFont): Record<string, BitmapFont>;
};
export declare const loadBitmapFont: {
    extension: {
        type: ExtensionType.LoadParser;
        priority: LoaderParserPriority;
    };
    name: string;
    test(url: string): boolean;
    testParse(data: string): Promise<boolean>;
    parse<T>(asset: string, data: ResolvedAsset, loader: Loader): Promise<BitmapFont>;
    load<T_1>(url: string, _options: ResolvedAsset): Promise<string>;
    unload(bitmapFont: BitmapFont, _resolvedAsset: ResolvedAsset<any>, loader: Loader): Promise<void>;
};
