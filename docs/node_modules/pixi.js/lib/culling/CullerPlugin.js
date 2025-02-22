'use strict';

var Extensions = require('../extensions/Extensions.js');
var Culler = require('./Culler.js');

"use strict";
class CullerPlugin {
  static init() {
    this._renderRef = this.render.bind(this);
    this.render = () => {
      Culler.Culler.shared.cull(this.stage, this.renderer.screen);
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
  type: Extensions.ExtensionType.Application,
  name: "culler"
};

exports.CullerPlugin = CullerPlugin;
//# sourceMappingURL=CullerPlugin.js.map
