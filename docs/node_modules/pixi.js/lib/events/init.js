'use strict';

var Extensions = require('../extensions/Extensions.js');
var Container = require('../scene/container/Container.js');
var EventSystem = require('./EventSystem.js');
var FederatedEventTarget = require('./FederatedEventTarget.js');

"use strict";
Extensions.extensions.add(EventSystem.EventSystem);
Container.Container.mixin(FederatedEventTarget.FederatedContainer);
//# sourceMappingURL=init.js.map
