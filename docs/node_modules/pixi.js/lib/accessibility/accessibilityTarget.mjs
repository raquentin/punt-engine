"use strict";
const accessibilityTarget = {
  /**
   * Flag for if the object is accessible. If true AccessibilityManager will overlay a
   * shadow div with attributes set
   * @member {boolean}
   * @memberof scene.Container#
   */
  accessible: false,
  /**
   * Sets the title attribute of the shadow div
   * If accessibleTitle AND accessibleHint has not been this will default to 'container [tabIndex]'
   * @member {string}
   * @memberof scene.Container#
   */
  accessibleTitle: null,
  /**
   * Sets the aria-label attribute of the shadow div
   * @member {string}
   * @memberof scene.Container#
   */
  accessibleHint: null,
  /**
   * @member {number}
   * @memberof scene.Container#
   * @todo Needs docs.
   */
  tabIndex: 0,
  /**
   * @member {boolean}
   * @memberof scene.Container#
   * @private
   */
  _accessibleActive: false,
  /**
   * @memberof scene.Container#
   * @private
   */
  _accessibleDiv: null,
  /**
   * Specify the type of div the accessible layer is. Screen readers treat the element differently
   * depending on this type. Defaults to button.
   * @member {string}
   * @memberof scene.Container#
   * @default 'button'
   */
  accessibleType: "button",
  /**
   * Specify the pointer-events the accessible div will use
   * Defaults to auto.
   * @type {PointerEvents}
   * @memberof scene.Container#
   * @default 'auto'
   */
  accessiblePointerEvents: "auto",
  /**
   * Setting to false will prevent any children inside this container to
   * be accessible. Defaults to true.
   * @member {boolean}
   * @memberof scene.Container#
   * @default true
   */
  accessibleChildren: true,
  /**
   * @member {number}
   * @memberof scene.Container#
   * @private
   */
  _renderId: -1
};

export { accessibilityTarget };
//# sourceMappingURL=accessibilityTarget.mjs.map
