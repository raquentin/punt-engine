import { Texture } from '../../rendering/renderers/shared/texture/Texture';
import { Ticker } from '../../ticker/Ticker';
import { Sprite } from '../sprite/Sprite';
import type { SpriteOptions } from '../sprite/Sprite';
export type AnimatedSpriteFrames = Texture[] | FrameObject[];
/**
 * Constructor options used for `AnimatedSprite` instances.
 * @see {@link scene.AnimatedSprite}
 * @memberof scene
 */
export interface AnimatedSpriteOptions extends SpriteOptions {
    /** An array of {@link Texture} or frame objects that make up the animation. */
    textures: AnimatedSpriteFrames;
    /** Whether to use Ticker.shared to auto update animation time. */
    autoUpdate?: boolean;
}
/**
 * An AnimatedSprite is a simple way to display an animation depicted by a list of textures.
 *
 * ```js
 * import { AnimatedSprite, Texture } from 'pixi.js';
 *
 * const alienImages = [
 *     'image_sequence_01.png',
 *     'image_sequence_02.png',
 *     'image_sequence_03.png',
 *     'image_sequence_04.png',
 * ];
 * const textureArray = [];
 *
 * for (let i = 0; i < 4; i++)
 * {
 *     const texture = Texture.from(alienImages[i]);
 *     textureArray.push(texture);
 * }
 *
 * const animatedSprite = new AnimatedSprite(textureArray);
 * ```
 *
 * The more efficient and simpler way to create an animated sprite is using a {@link Spritesheet}
 * containing the animation definitions:
 * @example
 * import { AnimatedSprite, Assets } from 'pixi.js';
 *
 * const sheet = await Assets.load('assets/spritesheet.json');
 * animatedSprite = new AnimatedSprite(sheet.animations['image_sequence']);
 * @memberof scene
 */
export declare class AnimatedSprite extends Sprite {
    /**
     * The speed that the AnimatedSprite will play at. Higher is faster, lower is slower.
     * @default 1
     */
    animationSpeed: number;
    /**
     * Whether or not the animate sprite repeats after playing.
     * @default true
     */
    loop: boolean;
    /**
     * Update anchor to [Texture's defaultAnchor]{@link Texture#defaultAnchor} when frame changes.
     *
     * Useful with [sprite sheet animations]{@link Spritesheet#animations} created with tools.
     * Changing anchor for each frame allows to pin sprite origin to certain moving feature
     * of the frame (e.g. left foot).
     *
     * Note: Enabling this will override any previously set `anchor` on each frame change.
     * @default false
     */
    updateAnchor: boolean;
    /**
     * User-assigned function to call when an AnimatedSprite finishes playing.
     * @example
     * animation.onComplete = () => {
     *     // Finished!
     * };
     */
    onComplete?: () => void;
    /**
     * User-assigned function to call when an AnimatedSprite changes which texture is being rendered.
     * @example
     * animation.onFrameChange = () => {
     *     // Updated!
     * };
     */
    onFrameChange?: (currentFrame: number) => void;
    /**
     * User-assigned function to call when `loop` is true, and an AnimatedSprite is played and
     * loops around to start again.
     * @example
     * animation.onLoop = () => {
     *     // Looped!
     * };
     */
    onLoop?: () => void;
    private _playing;
    private _textures;
    private _durations;
    /**
     * `true` uses Ticker.shared to auto update animation time.
     * @default true
     */
    private _autoUpdate;
    /**
     * `true` if the instance is currently connected to Ticker.shared to auto update animation time.
     * @default false
     */
    private _isConnectedToTicker;
    /** Elapsed time since animation has been started, used internally to display current texture. */
    private _currentTime;
    /** The texture index that was displayed last time. */
    private _previousFrame;
    /**
     * @param frames - Collection of textures or frames to use.
     * @param autoUpdate - Whether to use Ticker.shared to auto update animation time.
     */
    constructor(frames: AnimatedSpriteFrames, autoUpdate?: boolean);
    /**
     * @param options - The options for the AnimatedSprite.
     */
    constructor(options: AnimatedSpriteOptions);
    /** Stops the AnimatedSprite. */
    stop(): void;
    /** Plays the AnimatedSprite. */
    play(): void;
    /**
     * Stops the AnimatedSprite and goes to a specific frame.
     * @param frameNumber - Frame index to stop at.
     */
    gotoAndStop(frameNumber: number): void;
    /**
     * Goes to a specific frame and begins playing the AnimatedSprite.
     * @param frameNumber - Frame index to start at.
     */
    gotoAndPlay(frameNumber: number): void;
    /**
     * Updates the object transform for rendering.
     * @param ticker - the ticker to use to update the object.
     */
    update(ticker: Ticker): void;
    /** Updates the displayed texture to match the current frame index. */
    private _updateTexture;
    /** Stops the AnimatedSprite and destroys it. */
    destroy(): void;
    /**
     * A short hand way of creating an AnimatedSprite from an array of frame ids.
     * @param frames - The array of frames ids the AnimatedSprite will use as its texture frames.
     * @returns - The new animated sprite with the specified frames.
     */
    static fromFrames(frames: string[]): AnimatedSprite;
    /**
     * A short hand way of creating an AnimatedSprite from an array of image ids.
     * @param images - The array of image urls the AnimatedSprite will use as its texture frames.
     * @returns The new animate sprite with the specified images as frames.
     */
    static fromImages(images: string[]): AnimatedSprite;
    /**
     * The total number of frames in the AnimatedSprite. This is the same as number of textures
     * assigned to the AnimatedSprite.
     * @readonly
     * @default 0
     */
    get totalFrames(): number;
    /** The array of textures used for this AnimatedSprite. */
    get textures(): AnimatedSpriteFrames;
    set textures(value: AnimatedSpriteFrames);
    /** The AnimatedSprite's current frame index. */
    get currentFrame(): number;
    set currentFrame(value: number);
    /**
     * Indicates if the AnimatedSprite is currently playing.
     * @readonly
     */
    get playing(): boolean;
    /** Whether to use Ticker.shared to auto update animation time. */
    get autoUpdate(): boolean;
    set autoUpdate(value: boolean);
}
/**
 * A reference to a frame in an {@link scene.AnimatedSprite}
 * @memberof scene
 */
export interface FrameObject {
    /** The {@link Texture} of the frame. */
    texture: Texture;
    /** The duration of the frame, in milliseconds. */
    time: number;
}
