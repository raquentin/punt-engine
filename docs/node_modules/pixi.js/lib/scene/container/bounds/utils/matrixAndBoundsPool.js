'use strict';

var Matrix = require('../../../../maths/matrix/Matrix.js');
var Pool = require('../../../../utils/pool/Pool.js');
var Bounds = require('../Bounds.js');

"use strict";
const matrixPool = new Pool.Pool(Matrix.Matrix);
const boundsPool = new Pool.Pool(Bounds.Bounds);

exports.boundsPool = boundsPool;
exports.matrixPool = matrixPool;
//# sourceMappingURL=matrixAndBoundsPool.js.map
