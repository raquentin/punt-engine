'use strict';

var adapter = require('./adapter.js');
var autoDetectEnvironment = require('./autoDetectEnvironment.js');
require('./canvas/ICanvas.js');
require('./canvas/ICanvasRenderingContext2D.js');

"use strict";

exports.DOMAdapter = adapter.DOMAdapter;
exports.autoDetectEnvironment = autoDetectEnvironment.autoDetectEnvironment;
exports.loadEnvironmentExtensions = autoDetectEnvironment.loadEnvironmentExtensions;
//# sourceMappingURL=index.js.map
