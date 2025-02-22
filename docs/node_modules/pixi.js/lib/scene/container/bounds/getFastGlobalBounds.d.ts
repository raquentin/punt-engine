import type { Container } from '../Container';
import type { Bounds } from './Bounds';
/**
 * Does exactly the same as getGlobalBounds, but does instead makes use of transforming AABBs
 * of the various children within the scene graph. This is much faster, but less accurate.
 *
 * the result will never be smaller - only ever slightly larger (in most cases, it will be the same).
 * @param target - The target container to get the bounds from
 * @param bounds - The output bounds object.
 * @returns The bounds.
 */
export declare function getFastGlobalBounds(target: Container, bounds: Bounds): Bounds;
export declare function _getGlobalBoundsRecursive(target: Container, bounds: Bounds): void;
