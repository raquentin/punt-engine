export declare enum CLEAR {
    NONE = 0,
    COLOR = 16384,
    STENCIL = 1024,
    DEPTH = 256,
    COLOR_DEPTH = 16640,
    COLOR_STENCIL = 17408,
    DEPTH_STENCIL = 1280,
    ALL = 17664
}
/** Used for clearing render textures. true is the same as `ALL` false is the same as `NONE` */
export type CLEAR_OR_BOOL = CLEAR | boolean;
