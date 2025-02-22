import { ExtensionType } from '../extensions/Extensions';
import type { System } from '../rendering/renderers/shared/system/System';
import type { Renderer } from '../rendering/renderers/types';
import type { isMobileResult } from '../utils/browser/isMobile';
/** @ignore */
export interface AccessibilityOptions {
    /** Setting this to true will visually show the divs. */
    debug?: boolean;
}
/**
 * The Accessibility system recreates the ability to tab and have content read by screen readers.
 * This is very important as it can possibly help people with disabilities access PixiJS content.
 *
 * A Container can be made accessible just like it can be made interactive. This manager will map the
 * events as if the mouse was being used, minimizing the effort required to implement.
 *
 * An instance of this class is automatically created by default, and can be found at `renderer.accessibility`
 * @memberof accessibility
 */
export declare class AccessibilitySystem implements System<AccessibilityOptions> {
    private readonly _mobileInfo;
    /** @ignore */
    static extension: {
        readonly type: readonly [ExtensionType.WebGLSystem, ExtensionType.WebGPUSystem];
        readonly name: "accessibility";
    };
    /** Setting this to true will visually show the divs. */
    debug: boolean;
    /**
     * The renderer this accessibility manager works for.
     * @type {WebGLRenderer|WebGPURenderer}
     */
    private _renderer;
    /** Internal variable, see isActive getter. */
    private _isActive;
    /** Internal variable, see isMobileAccessibility getter. */
    private _isMobileAccessibility;
    /** Button element for handling touch hooks. */
    private _hookDiv;
    /** This is the dom element that will sit over the PixiJS element. This is where the div overlays will go. */
    private _div;
    /** A simple pool for storing divs. */
    private _pool;
    /** This is a tick used to check if an object is no longer being rendered. */
    private _renderId;
    /** The array of currently active accessible items. */
    private _children;
    /** Count to throttle div updates on android devices. */
    private _androidUpdateCount;
    /**  The frequency to update the div elements. */
    private readonly _androidUpdateFrequency;
    /**
     * @param {WebGLRenderer|WebGPURenderer} renderer - A reference to the current renderer
     */
    constructor(renderer: Renderer, _mobileInfo?: isMobileResult);
    /**
     * Value of `true` if accessibility is currently active and accessibility layers are showing.
     * @member {boolean}
     * @readonly
     */
    get isActive(): boolean;
    /**
     * Value of `true` if accessibility is enabled for touch devices.
     * @member {boolean}
     * @readonly
     */
    get isMobileAccessibility(): boolean;
    get hookDiv(): HTMLElement;
    /**
     * Creates the touch hooks.
     * @private
     */
    private _createTouchHook;
    /**
     * Destroys the touch hooks.
     * @private
     */
    private _destroyTouchHook;
    /**
     * Activating will cause the Accessibility layer to be shown.
     * This is called when a user presses the tab key.
     * @private
     */
    private _activate;
    /**
     * Deactivating will cause the Accessibility layer to be hidden.
     * This is called when a user moves the mouse.
     * @private
     */
    private _deactivate;
    /**
     * This recursive function will run through the scene graph and add any new accessible objects to the DOM layer.
     * @private
     * @param {Container} container - The Container to check.
     */
    private _updateAccessibleObjects;
    /**
     * Runner init called, view is available at this point.
     * @ignore
     */
    init(options?: AccessibilityOptions): void;
    /**
     * Runner postrender was called, ensure that all divs are mapped correctly to their Containers.
     * Only fires while active.
     * @ignore
     */
    postrender(): void;
    /**
     * private function that will visually add the information to the
     * accessibility div
     * @param {HTMLElement} div -
     */
    private _updateDebugHTML;
    /**
     * Adjust the hit area based on the bounds of a display object
     * @param {Rectangle} hitArea - Bounds of the child
     */
    private _capHitArea;
    /**
     * Adds a Container to the accessibility manager
     * @private
     * @param {Container} container - The child to make accessible.
     */
    private _addChild;
    /**
     * Dispatch events with the EventSystem.
     * @param e
     * @param type
     * @private
     */
    private _dispatchEvent;
    /**
     * Maps the div button press to pixi's EventSystem (click)
     * @private
     * @param {MouseEvent} e - The click event.
     */
    private _onClick;
    /**
     * Maps the div focus events to pixi's EventSystem (mouseover)
     * @private
     * @param {FocusEvent} e - The focus event.
     */
    private _onFocus;
    /**
     * Maps the div focus events to pixi's EventSystem (mouseout)
     * @private
     * @param {FocusEvent} e - The focusout event.
     */
    private _onFocusOut;
    /**
     * Is called when a key is pressed
     * @private
     * @param {KeyboardEvent} e - The keydown event.
     */
    private _onKeyDown;
    /**
     * Is called when the mouse moves across the renderer element
     * @private
     * @param {MouseEvent} e - The mouse event.
     */
    private _onMouseMove;
    /** Destroys the accessibility manager */
    destroy(): void;
}
