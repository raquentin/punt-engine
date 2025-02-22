'use strict';

var Extensions = require('../../../../extensions/Extensions.js');
var Rectangle = require('../../../../maths/shapes/Rectangle.js');
var buildUvs = require('../../../../rendering/renderers/shared/geometry/utils/buildUvs.js');
var transformVertices = require('../../../../rendering/renderers/shared/geometry/utils/transformVertices.js');
var Texture = require('../../../../rendering/renderers/shared/texture/Texture.js');
var PoolGroup = require('../../../../utils/pool/PoolGroup.js');
var BatchableGraphics = require('../BatchableGraphics.js');
var buildCircle = require('../buildCommands/buildCircle.js');
var buildLine = require('../buildCommands/buildLine.js');
var buildPolygon = require('../buildCommands/buildPolygon.js');
var buildRectangle = require('../buildCommands/buildRectangle.js');
var buildTriangle = require('../buildCommands/buildTriangle.js');
var triangulateWithHoles = require('./triangulateWithHoles.js');

"use strict";
const shapeBuilders = {};
Extensions.extensions.handleByMap(Extensions.ExtensionType.ShapeBuilder, shapeBuilders);
Extensions.extensions.add(buildRectangle.buildRectangle, buildPolygon.buildPolygon, buildTriangle.buildTriangle, buildCircle.buildCircle, buildCircle.buildEllipse, buildCircle.buildRoundedRectangle);
const tempRect = new Rectangle.Rectangle();
function buildContextBatches(context, gpuContext) {
  const { geometryData, batches } = gpuContext;
  batches.length = 0;
  geometryData.indices.length = 0;
  geometryData.vertices.length = 0;
  geometryData.uvs.length = 0;
  for (let i = 0; i < context.instructions.length; i++) {
    const instruction = context.instructions[i];
    if (instruction.action === "texture") {
      addTextureToGeometryData(instruction.data, batches, geometryData);
    } else if (instruction.action === "fill" || instruction.action === "stroke") {
      const isStroke = instruction.action === "stroke";
      const shapePath = instruction.data.path.shapePath;
      const style = instruction.data.style;
      const hole = instruction.data.hole;
      if (isStroke && hole) {
        addShapePathToGeometryData(hole.shapePath, style, null, true, batches, geometryData);
      }
      addShapePathToGeometryData(shapePath, style, hole, isStroke, batches, geometryData);
    }
  }
}
function addTextureToGeometryData(data, batches, geometryData) {
  const { vertices, uvs, indices } = geometryData;
  const indexOffset = indices.length;
  const vertOffset = vertices.length / 2;
  const points = [];
  const build = shapeBuilders.rectangle;
  const rect = tempRect;
  const texture = data.image;
  rect.x = data.dx;
  rect.y = data.dy;
  rect.width = data.dw;
  rect.height = data.dh;
  const matrix = data.transform;
  build.build(rect, points);
  if (matrix) {
    transformVertices.transformVertices(points, matrix);
  }
  build.triangulate(points, vertices, 2, vertOffset, indices, indexOffset);
  const textureUvs = texture.uvs;
  uvs.push(
    textureUvs.x0,
    textureUvs.y0,
    textureUvs.x1,
    textureUvs.y1,
    textureUvs.x3,
    textureUvs.y3,
    textureUvs.x2,
    textureUvs.y2
  );
  const graphicsBatch = PoolGroup.BigPool.get(BatchableGraphics.BatchableGraphics);
  graphicsBatch.indexOffset = indexOffset;
  graphicsBatch.indexSize = indices.length - indexOffset;
  graphicsBatch.attributeOffset = vertOffset;
  graphicsBatch.attributeSize = vertices.length / 2 - vertOffset;
  graphicsBatch.baseColor = data.style;
  graphicsBatch.alpha = data.alpha;
  graphicsBatch.texture = texture;
  graphicsBatch.geometryData = geometryData;
  batches.push(graphicsBatch);
}
function addShapePathToGeometryData(shapePath, style, hole, isStroke, batches, geometryData) {
  const { vertices, uvs, indices } = geometryData;
  const lastIndex = shapePath.shapePrimitives.length - 1;
  shapePath.shapePrimitives.forEach(({ shape, transform: matrix }, i) => {
    const indexOffset = indices.length;
    const vertOffset = vertices.length / 2;
    const points = [];
    const build = shapeBuilders[shape.type];
    build.build(shape, points);
    if (matrix) {
      transformVertices.transformVertices(points, matrix);
    }
    if (!isStroke) {
      if (hole && lastIndex === i) {
        if (lastIndex !== 0) {
          console.warn("[Pixi Graphics] only the last shape have be cut out");
        }
        const holeIndices = [];
        const otherPoints = points.slice();
        const holeArrays = getHoleArrays(hole.shapePath);
        holeArrays.forEach((holePoints) => {
          holeIndices.push(otherPoints.length / 2);
          otherPoints.push(...holePoints);
        });
        triangulateWithHoles.triangulateWithHoles(otherPoints, holeIndices, vertices, 2, vertOffset, indices, indexOffset);
      } else {
        build.triangulate(points, vertices, 2, vertOffset, indices, indexOffset);
      }
    } else {
      const close = shape.closePath ?? true;
      const lineStyle = style;
      buildLine.buildLine(points, lineStyle, false, close, vertices, 2, vertOffset, indices, indexOffset);
    }
    const uvsOffset = uvs.length / 2;
    const texture = style.texture;
    if (texture !== Texture.Texture.WHITE) {
      const textureMatrix = style.matrix;
      if (textureMatrix) {
        if (matrix) {
          textureMatrix.append(matrix.clone().invert());
        }
        buildUvs.buildUvs(vertices, 2, vertOffset, uvs, uvsOffset, 2, vertices.length / 2 - vertOffset, textureMatrix);
      }
    } else {
      buildUvs.buildSimpleUvs(uvs, uvsOffset, 2, vertices.length / 2 - vertOffset);
    }
    const graphicsBatch = PoolGroup.BigPool.get(BatchableGraphics.BatchableGraphics);
    graphicsBatch.indexOffset = indexOffset;
    graphicsBatch.indexSize = indices.length - indexOffset;
    graphicsBatch.attributeOffset = vertOffset;
    graphicsBatch.attributeSize = vertices.length / 2 - vertOffset;
    graphicsBatch.baseColor = style.color;
    graphicsBatch.alpha = style.alpha;
    graphicsBatch.texture = texture;
    graphicsBatch.geometryData = geometryData;
    batches.push(graphicsBatch);
  });
}
function getHoleArrays(shape) {
  if (!shape)
    return [];
  const holePrimitives = shape.shapePrimitives;
  const holeArrays = [];
  for (let k = 0; k < holePrimitives.length; k++) {
    const holePrimitive = holePrimitives[k].shape;
    const holePoints = [];
    const holeBuilder = shapeBuilders[holePrimitive.type];
    holeBuilder.build(holePrimitive, holePoints);
    holeArrays.push(holePoints);
  }
  return holeArrays;
}

exports.buildContextBatches = buildContextBatches;
exports.shapeBuilders = shapeBuilders;
//# sourceMappingURL=buildContextBatches.js.map
