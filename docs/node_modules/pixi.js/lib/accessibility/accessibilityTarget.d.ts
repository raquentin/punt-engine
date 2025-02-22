import type { Container } from '../scene/container/Container';
/**
 * The type of the pointer event to listen for.
 * Can be any of the following:
 * - `auto`
 * - `none`
 * - `visiblePainted`
 * - `visibleFill`
 * - `visibleStroke`
 * - `visible`
 * - `painted`
 * - `fill`
 * - `stroke`
 * - `all`
 * - `inherit`
 * @memberof accessibility
 * @see https://developer.mozilla.org/en-US/docs/Web/CSS/pointer-events
 */
export type PointerEvents = 'auto' | 'none' | 'visiblePainted' | 'visibleFill' | 'visibleStroke' | 'visible' | 'painted' | 'fill' | 'stroke' | 'all' | 'inherit';
/**
 * When `accessible` is enabled on any display object, these properties will affect its accessibility.
 * @memberof accessibility
 */
export interface AccessibleOptions {
    /**
     * Flag for if the object is accessible. If true AccessibilityManager will overlay a
     * shadow div with attributes set
     * @default false
     */
    accessible: boolean;
    /**
     * Sets the title attribute of the shadow div
     * If accessibleTitle AND accessibleHint has not been this will default to 'container [tabIndex]'
     * @member {string}
     */
    accessibleTitle: string | null;
    /** Sets the aria-label attribute of the shadow div */
    accessibleHint: string | null;
    /**
     * @default 0
     */
    tabIndex: number;
    /**
     * Specify the type of div the accessible layer is. Screen readers treat the element differently
     * depending on this type. Defaults to button.
     * @default 'button'
     */
    accessibleType: string;
    /**
     * Specify the pointer-events the accessible div will use
     * Defaults to auto.
     * @default 'auto'
     * @type {accessibility.PointerEvents}
     */
    accessiblePointerEvents: PointerEvents;
    /**
     * Setting to false will prevent any children inside this container to
     * be accessible. Defaults to true.
     * @default true
     */
    accessibleChildren: boolean;
}
/**
 * The Accessibility object is attached to the {@link Container}.
 * @private
 */
export interface AccessibleTarget extends AccessibleOptions {
    _accessibleActive: boolean;
    _accessibleDiv: AccessibleHTMLElement | null;
    _renderId: number;
}
export interface AccessibleHTMLElement extends HTMLElement {
    type?: string;
    container?: Container;
}
/**
 * Default property values of accessible objects
 * used by {@link AccessibilitySystem}.
 * @private
 * @example
 * import { accessibleTarget } from 'pixi.js';
 *
 * function MyObject() {}
 * Object.assign(MyObject.prototype, accessibleTarget);
 */
export declare const accessibilityTarget: AccessibleTarget;
