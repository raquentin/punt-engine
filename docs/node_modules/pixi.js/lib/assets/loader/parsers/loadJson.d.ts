import { ExtensionType } from '../../../extensions/Extensions';
import { LoaderParserPriority } from './LoaderParser';
/**
 * A simple loader plugin for loading json data
 * @memberof assets
 */
export declare const loadJson: {
    extension: {
        type: ExtensionType.LoadParser;
        priority: LoaderParserPriority;
    };
    name: string;
    test(url: string): boolean;
    load<T>(url: string): Promise<T>;
};
