import { Matrix } from './Matrix';
type GD8Symmetry = number;
/**
 * @typedef {number} GD8Symmetry
 * @see groupD8
 */
/**
 * Implements the dihedral group D8, which is similar to
 * [group D4]{@link http://mathworld.wolfram.com/DihedralGroupD4.html};
 * D8 is the same but with diagonals, and it is used for texture
 * rotations.
 *
 * The directions the U- and V- axes after rotation
 * of an angle of `a: GD8Constant` are the vectors `(uX(a), uY(a))`
 * and `(vX(a), vY(a))`. These aren't necessarily unit vectors.
 *
 * **Origin:**<br>
 *  This is the small part of gameofbombs.com portal system. It works.
 * @see maths.groupD8.E
 * @see maths.groupD8.SE
 * @see maths.groupD8.S
 * @see maths.groupD8.SW
 * @see maths.groupD8.W
 * @see maths.groupD8.NW
 * @see maths.groupD8.N
 * @see maths.groupD8.NE
 * @author Ivan @ivanpopelyshev
 * @namespace maths.groupD8
 */
export declare const groupD8: {
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 0°       | East      |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    E: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 45°↻     | Southeast |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    SE: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 90°↻     | South     |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    S: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 135°↻    | Southwest |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    SW: number;
    /**
     * | Rotation | Direction |
     * |----------|-----------|
     * | 180°     | West      |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    W: number;
    /**
     * | Rotation    | Direction    |
     * |-------------|--------------|
     * | -135°/225°↻ | Northwest    |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    NW: number;
    /**
     * | Rotation    | Direction    |
     * |-------------|--------------|
     * | -90°/270°↻  | North        |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    N: number;
    /**
     * | Rotation    | Direction    |
     * |-------------|--------------|
     * | -45°/315°↻  | Northeast    |
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    NE: number;
    /**
     * Reflection about Y-axis.
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    MIRROR_VERTICAL: number;
    /**
     * Reflection about the main diagonal.
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    MAIN_DIAGONAL: number;
    /**
     * Reflection about X-axis.
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    MIRROR_HORIZONTAL: number;
    /**
     * Reflection about reverse diagonal.
     * @memberof maths.groupD8
     * @constant {GD8Symmetry}
     */
    REVERSE_DIAGONAL: number;
    /**
     * @memberof maths.groupD8
     * @param {GD8Symmetry} ind - sprite rotation angle.
     * @returns {GD8Symmetry} The X-component of the U-axis
     *    after rotating the axes.
     */
    uX: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof maths.groupD8
     * @param {GD8Symmetry} ind - sprite rotation angle.
     * @returns {GD8Symmetry} The Y-component of the U-axis
     *    after rotating the axes.
     */
    uY: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof maths.groupD8
     * @param {GD8Symmetry} ind - sprite rotation angle.
     * @returns {GD8Symmetry} The X-component of the V-axis
     *    after rotating the axes.
     */
    vX: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof maths.groupD8
     * @param {GD8Symmetry} ind - sprite rotation angle.
     * @returns {GD8Symmetry} The Y-component of the V-axis
     *    after rotating the axes.
     */
    vY: (ind: GD8Symmetry) => GD8Symmetry;
    /**
     * @memberof maths.groupD8
     * @param {GD8Symmetry} rotation - symmetry whose opposite
     *   is needed. Only rotations have opposite symmetries while
     *   reflections don't.
     * @returns {GD8Symmetry} The opposite symmetry of `rotation`
     */
    inv: (rotation: GD8Symmetry) => GD8Symmetry;
    /**
     * Composes the two D8 operations.
     *
     * Taking `^` as reflection:
     *
     * |       | E=0 | S=2 | W=4 | N=6 | E^=8 | S^=10 | W^=12 | N^=14 |
     * |-------|-----|-----|-----|-----|------|-------|-------|-------|
     * | E=0   | E   | S   | W   | N   | E^   | S^    | W^    | N^    |
     * | S=2   | S   | W   | N   | E   | S^   | W^    | N^    | E^    |
     * | W=4   | W   | N   | E   | S   | W^   | N^    | E^    | S^    |
     * | N=6   | N   | E   | S   | W   | N^   | E^    | S^    | W^    |
     * | E^=8  | E^  | N^  | W^  | S^  | E    | N     | W     | S     |
     * | S^=10 | S^  | E^  | N^  | W^  | S    | E     | N     | W     |
     * | W^=12 | W^  | S^  | E^  | N^  | W    | S     | E     | N     |
     * | N^=14 | N^  | W^  | S^  | E^  | N    | W     | S     | E     |
     *
     * [This is a Cayley table]{@link https://en.wikipedia.org/wiki/Cayley_table}
     * @memberof maths.groupD8
     * @param {GD8Symmetry} rotationSecond - Second operation, which
     *   is the row in the above cayley table.
     * @param {GD8Symmetry} rotationFirst - First operation, which
     *   is the column in the above cayley table.
     * @returns {GD8Symmetry} Composed operation
     */
    add: (rotationSecond: GD8Symmetry, rotationFirst: GD8Symmetry) => GD8Symmetry;
    /**
     * Reverse of `add`.
     * @memberof maths.groupD8
     * @param {GD8Symmetry} rotationSecond - Second operation
     * @param {GD8Symmetry} rotationFirst - First operation
     * @returns {GD8Symmetry} Result
     */
    sub: (rotationSecond: GD8Symmetry, rotationFirst: GD8Symmetry) => GD8Symmetry;
    /**
     * Adds 180 degrees to rotation, which is a commutative
     * operation.
     * @memberof maths.groupD8
     * @param {number} rotation - The number to rotate.
     * @returns {number} Rotated number
     */
    rotate180: (rotation: number) => number;
    /**
     * Checks if the rotation angle is vertical, i.e. south
     * or north. It doesn't work for reflections.
     * @memberof maths.groupD8
     * @param {GD8Symmetry} rotation - The number to check.
     * @returns {boolean} Whether or not the direction is vertical
     */
    isVertical: (rotation: GD8Symmetry) => boolean;
    /**
     * Approximates the vector `V(dx,dy)` into one of the
     * eight directions provided by `groupD8`.
     * @memberof maths.groupD8
     * @param {number} dx - X-component of the vector
     * @param {number} dy - Y-component of the vector
     * @returns {GD8Symmetry} Approximation of the vector into
     *  one of the eight symmetries.
     */
    byDirection: (dx: number, dy: number) => GD8Symmetry;
    /**
     * Helps sprite to compensate texture packer rotation.
     * @memberof maths.groupD8
     * @param {Matrix} matrix - sprite world matrix
     * @param {GD8Symmetry} rotation - The rotation factor to use.
     * @param {number} tx - sprite anchoring
     * @param {number} ty - sprite anchoring
     */
    matrixAppendRotationInv: (matrix: Matrix, rotation: GD8Symmetry, tx?: number, ty?: number) => void;
};
export {};
