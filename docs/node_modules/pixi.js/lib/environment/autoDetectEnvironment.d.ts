/**
 * Automatically detects the environment and loads the appropriate extensions.
 * @param skip - whether to skip loading the default extensions
 */
export declare function loadEnvironmentExtensions(skip: boolean): Promise<void>;
/**
 * @param add - whether to add the default imports to the bundle
 * @deprecated since 8.1.6. Use `loadEnvironmentExtensions` instead
 */
export declare function autoDetectEnvironment(add: boolean): Promise<void>;
