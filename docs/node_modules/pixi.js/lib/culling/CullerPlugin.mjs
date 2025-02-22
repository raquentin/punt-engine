import { ExtensionType } from '../extensions/Extensions.mjs';
import { Culler } from './Culler.mjs';

"use strict";
class CullerPlugin {
  static init() {
    this._renderRef = this.render.bind(this);
    this.render = () => {
      Culler.shared.cull(this.stage, this.renderer.screen);
      this.renderer.render({ container: this.stage });
    };
  }
  static destroy() {
    this.render = this._renderRef;
  }
}
/** @ignore */
CullerPlugin.extension = {
  priority: 10,
  type: ExtensionType.Application,
  name: "culler"
};

export { CullerPlugin };
//# sourceMappingURL=CullerPlugin.mjs.map
