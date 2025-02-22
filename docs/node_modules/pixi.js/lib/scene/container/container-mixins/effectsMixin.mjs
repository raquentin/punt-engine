import { FilterEffect } from '../../../filters/FilterEffect.mjs';
import { MaskEffectManager } from '../../../rendering/mask/MaskEffectManager.mjs';

"use strict";
const effectsMixin = {
  _maskEffect: null,
  _filterEffect: null,
  /**
   * @todo Needs docs.
   * @memberof scene.Container#
   * @type {Array<Effect>}
   */
  effects: [],
  /**
   * @todo Needs docs.
   * @param effect - The effect to add.
   * @memberof scene.Container#
   * @ignore
   */
  addEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index !== -1)
      return;
    this.effects.push(effect);
    this.effects.sort((a, b) => a.priority - b.priority);
    const renderGroup = this.renderGroup || this.parentRenderGroup;
    if (renderGroup) {
      renderGroup.structureDidChange = true;
    }
    this._updateIsSimple();
  },
  /**
   * @todo Needs docs.
   * @param effect - The effect to remove.
   * @memberof scene.Container#
   * @ignore
   */
  removeEffect(effect) {
    const index = this.effects.indexOf(effect);
    if (index === -1)
      return;
    this.effects.splice(index, 1);
    if (this.parentRenderGroup) {
      this.parentRenderGroup.structureDidChange = true;
    }
    this._updateIsSimple();
  },
  set mask(value) {
    const effect = this._maskEffect;
    if (effect?.mask === value)
      return;
    if (effect) {
      this.removeEffect(effect);
      MaskEffectManager.returnMaskEffect(effect);
      this._maskEffect = null;
    }
    if (value === null || value === void 0)
      return;
    this._maskEffect = MaskEffectManager.getMaskEffect(value);
    this.addEffect(this._maskEffect);
  },
  /**
   * Sets a mask for the displayObject. A mask is an object that limits the visibility of an
   * object to the shape of the mask applied to it. In PixiJS a regular mask must be a
   * {@link Graphics} or a {@link Sprite} object. This allows for much faster masking in canvas as it
   * utilities shape clipping. Furthermore, a mask of an object must be in the subtree of its parent.
   * Otherwise, `getLocalBounds` may calculate incorrect bounds, which makes the container's width and height wrong.
   * To remove a mask, set this property to `null`.
   *
   * For sprite mask both alpha and red channel are used. Black mask is the same as transparent mask.
   * @example
   * import { Graphics, Sprite } from 'pixi.js';
   *
   * const graphics = new Graphics();
   * graphics.beginFill(0xFF3300);
   * graphics.drawRect(50, 250, 100, 100);
   * graphics.endFill();
   *
   * const sprite = new Sprite(texture);
   * sprite.mask = graphics;
   * @memberof scene.Container#
   */
  get mask() {
    return this._maskEffect?.mask;
  },
  set filters(value) {
    if (!Array.isArray(value) && value)
      value = [value];
    const effect = this._filterEffect || (this._filterEffect = new FilterEffect());
    value = value;
    const hasFilters = value?.length > 0;
    const hadFilters = effect.filters?.length > 0;
    const didChange = hasFilters !== hadFilters;
    value = Array.isArray(value) ? value.slice(0) : value;
    effect.filters = Object.freeze(value);
    if (didChange) {
      if (hasFilters) {
        this.addEffect(effect);
      } else {
        this.removeEffect(effect);
        effect.filters = value ?? null;
      }
    }
  },
  /**
   * Sets the filters for the displayObject.
   * IMPORTANT: This is a WebGL only feature and will be ignored by the canvas renderer.
   * To remove filters simply set this property to `'null'`.
   * @memberof scene.Container#
   */
  get filters() {
    return this._filterEffect?.filters;
  },
  set filterArea(value) {
    this._filterEffect || (this._filterEffect = new FilterEffect());
    this._filterEffect.filterArea = value;
  },
  /**
   * The area the filter is applied to. This is used as more of an optimization
   * rather than figuring out the dimensions of the displayObject each frame you can set this rectangle.
   *
   * Also works as an interaction mask.
   * @memberof scene.Container#
   */
  get filterArea() {
    return this._filterEffect?.filterArea;
  }
};

export { effectsMixin };
//# sourceMappingURL=effectsMixin.mjs.map
