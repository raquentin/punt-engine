/**
 * `extensions` is a global object that holds all the extensions registered with PixiJS.
 * PixiJS uses a this extensions architecture a lot to make the library more modular and
 * flexible.
 *
 * For example, if you want to add load a new type of asset, you can register a new
 * {@link assets.LoaderParser} with the `extensions` object.
 *
 * ```js
 * import { extensions, ExtensionType } from 'pixi.js';
 *
 * // create a custom asset loader
 * const customAssetLoader = {
 *    extension: {
 *        type: ExtensionType.LoadParser,
 *        name: 'custom-asset-loader',
 *    },
 *    test(url) {
 *       // check if this new loader should be used...
 *    },
 *    load(url) {
 *        // load the asset...
 *    },
 * };
 *
 * // add the custom asset loader to pixi
 * extensions.add(customAssetLoader);
 * ```
 *
 * This would add the `customAssetLoader` to the list of available loaders that PixiJS can use.
 *
 * There are many different types of extensions, which are listed in {@link extensions.ExtensionType}.
 * @namespace extensions
 */
/**
 * Collection of valid extension types.
 * @memberof extensions
 */
declare enum ExtensionType {
    /** extensions that are registered as Application plugins */
    Application = "application",
    /** extensions that are registered as WebGL render pipes */
    WebGLPipes = "webgl-pipes",
    /** extensions that are registered as WebGL render pipes adaptors */
    WebGLPipesAdaptor = "webgl-pipes-adaptor",
    /** extensions that are registered as WebGL render systems */
    WebGLSystem = "webgl-system",
    /** extensions that are registered as WebGPU render pipes */
    WebGPUPipes = "webgpu-pipes",
    /** extensions that are registered as WebGPU render pipes adaptors */
    WebGPUPipesAdaptor = "webgpu-pipes-adaptor",
    /** extensions that are registered as WebGPU render systems */
    WebGPUSystem = "webgpu-system",
    /** extensions that are registered as Canvas render pipes */
    CanvasSystem = "canvas-system",
    /** extensions that are registered as Canvas render pipes adaptors */
    CanvasPipesAdaptor = "canvas-pipes-adaptor",
    /** extensions that are registered as Canvas render systems */
    CanvasPipes = "canvas-pipes",
    /** extensions that combine the other Asset extensions */
    Asset = "asset",
    /** extensions that are used to load assets through Assets */
    LoadParser = "load-parser",
    /** extensions that are used to resolve asset urls through Assets */
    ResolveParser = "resolve-parser",
    /** extensions that are used to handle how urls are cached by Assets */
    CacheParser = "cache-parser",
    /** extensions that are used to add/remove available resources from Assets */
    DetectionParser = "detection-parser",
    /** extensions that are registered with the MaskEffectManager */
    MaskEffect = "mask-effect",
    /** A type of extension for creating a new advanced blend mode */
    BlendMode = "blend-mode",
    /** A type of extension that will be used to auto detect a resource type */
    TextureSource = "texture-source",
    /** A type of extension that will be used to auto detect an environment */
    Environment = "environment",
    /** A type of extension for building and triangulating custom shapes used in graphics. */
    ShapeBuilder = "shape-builder",
    /** A type of extension for creating custom batchers used in rendering. */
    Batcher = "batcher"
}
/**
 * The metadata for an extension.
 * @memberof extensions
 * @ignore
 */
interface ExtensionMetadataDetails {
    /** The extension type, can be multiple types */
    type: ExtensionType | ExtensionType[];
    /** Optional. Some plugins provide an API name/property, to make them more easily accessible */
    name?: string;
    /** Optional, used for sorting the plugins in a particular order */
    priority?: number;
}
/**
 * The metadata for an extension.
 * @memberof extensions
 */
type ExtensionMetadata = ExtensionType | ExtensionMetadataDetails;
/**
 * Format when registering an extension. Generally, the extension
 * should have these values as `extension` static property,
 * but you can override name or type by providing an object.
 * @memberof extensions
 */
interface ExtensionFormat {
    /** The extension type, can be multiple types */
    type: ExtensionType | ExtensionType[];
    /** Optional. Some plugins provide an API name/property, such as Renderer plugins */
    name?: string;
    /** Optional, used for sorting the plugins in a particular order */
    priority?: number;
    /** Reference to the plugin object/class */
    ref: any;
}
/**
 * Extension format that is used internally for registrations.
 * @memberof extensions
 * @ignore
 */
interface StrictExtensionFormat extends ExtensionFormat {
    /** The extension type, always expressed as multiple, even if a single */
    type: ExtensionType[];
}
type ExtensionHandler = (extension: StrictExtensionFormat) => void;
/**
 * Get the priority for an extension.
 * @ignore
 * @param ext - Any extension
 * @param defaultPriority - Fallback priority if none is defined.
 * @returns The priority for the extension.
 * @memberof extensions
 */
export declare const normalizeExtensionPriority: (ext: ExtensionFormat | any, defaultPriority: number) => number;
/**
 * Global registration of all PixiJS extensions. One-stop-shop for extensibility.
 *
 * Import the `extensions` object and use it to register new functionality via the described methods below.
 * ```js
 * import { extensions } from 'pixi.js';
 *
 * // register a new extension
 * extensions.add(myExtension);
 * ```
 * @property {Function} remove - Remove extensions from PixiJS.
 * @property {Function} add - Register new extensions with PixiJS.
 * @property {Function} handle - Internal method to handle extensions by name.
 * @property {Function} handleByMap - Handle a type, but using a map by `name` property.
 * @property {Function} handleByNamedList - Handle a type, but using a list of extensions with a `name` property.
 * @property {Function} handleByList - Handle a type, but using a list of extensions.
 * @memberof extensions
 */
declare const extensions: {
    /** @ignore */
    _addHandlers: Partial<Record<ExtensionType, ExtensionHandler>>;
    /** @ignore */
    _removeHandlers: Partial<Record<ExtensionType, ExtensionHandler>>;
    /** @ignore */
    _queue: Partial<Record<ExtensionType, StrictExtensionFormat[]>>;
    /**
     * Remove extensions from PixiJS.
     * @param extensions - Extensions to be removed.
     * @returns {extensions} For chaining.
     */
    remove(...extensions: Array<ExtensionFormat | any>): any;
    /**
     * Register new extensions with PixiJS.
     * @param extensions - The spread of extensions to add to PixiJS.
     * @returns {extensions} For chaining.
     */
    add(...extensions: Array<ExtensionFormat | any>): any;
    /**
     * Internal method to handle extensions by name.
     * @param type - The extension type.
     * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
     * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
     * @returns {extensions} For chaining.
     */
    handle(type: ExtensionType, onAdd: ExtensionHandler, onRemove: ExtensionHandler): any;
    /**
     * Handle a type, but using a map by `name` property.
     * @param type - Type of extension to handle.
     * @param map - The object map of named extensions.
     * @returns {extensions} For chaining.
     */
    handleByMap(type: ExtensionType, map: Record<string, any>): any;
    /**
     * Handle a type, but using a list of extensions with a `name` property.
     * @param type - Type of extension to handle.
     * @param map - The array of named extensions.
     * @param defaultPriority - Fallback priority if none is defined.
     * @returns {extensions} For chaining.
     */
    handleByNamedList(type: ExtensionType, map: {
        name: string;
        value: any;
    }[], defaultPriority?: number): any;
    /**
     * Handle a type, but using a list of extensions.
     * @param type - Type of extension to handle.
     * @param list - The list of extensions.
     * @param defaultPriority - The default priority to use if none is specified.
     * @returns {extensions} For chaining.
     */
    handleByList(type: ExtensionType, list: any[], defaultPriority?: number): any;
};
export { extensions, ExtensionType, };
export type { StrictExtensionFormat as ExtensionFormat, ExtensionFormat as ExtensionFormatLoose, ExtensionHandler, ExtensionMetadata, ExtensionMetadataDetails };
