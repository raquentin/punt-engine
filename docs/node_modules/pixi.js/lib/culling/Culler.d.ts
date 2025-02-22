import type { Container } from '../scene/container/Container';
type RectangleLike = {
    x: number;
    y: number;
    width: number;
    height: number;
};
/**
 * The Culler class is responsible for managing and culling containers.
 *
 *
 * Culled containers will not be rendered, and their children will not be processed. This can be useful for
 * performance optimization when dealing with large scenes.
 * @example
 * import { Culler, Container } from 'pixi.js';
 *
 * const culler = new Culler();
 * const stage = new Container();
 *
 * ... set up stage ...
 *
 * culler.cull(stage, { x: 0, y: 0, width: 800, height: 600 });
 * renderer.render(stage);
 * @memberof scene
 */
export declare class Culler {
    /**
     * Culls the children of a specific container based on the given view. This will also cull items that are not
     * being explicitly managed by the culler.
     * @param container - The container to cull.
     * @param view - The view rectangle.
     * @param skipUpdateTransform - Whether to skip updating the transform.
     */
    cull(container: Container, view: RectangleLike, skipUpdateTransform?: boolean): void;
    private _cullRecursive;
    /** A shared instance of the Culler class. */
    static shared: Culler;
}
export {};
