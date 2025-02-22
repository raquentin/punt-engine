'use strict';

var BindGroup = require('../../renderers/gpu/shader/BindGroup.js');
var Texture = require('../../renderers/shared/texture/Texture.js');
var maxRecommendedTextures = require('../gl/utils/maxRecommendedTextures.js');

"use strict";
const cachedGroups = {};
function getTextureBatchBindGroup(textures, size) {
  let uid = 2166136261;
  for (let i = 0; i < size; i++) {
    uid ^= textures[i].uid;
    uid = Math.imul(uid, 16777619);
    uid >>>= 0;
  }
  return cachedGroups[uid] || generateTextureBatchBindGroup(textures, size, uid);
}
let maxTextures = 0;
function generateTextureBatchBindGroup(textures, size, key) {
  const bindGroupResources = {};
  let bindIndex = 0;
  if (!maxTextures)
    maxTextures = maxRecommendedTextures.getMaxTexturesPerBatch();
  for (let i = 0; i < maxTextures; i++) {
    const texture = i < size ? textures[i] : Texture.Texture.EMPTY.source;
    bindGroupResources[bindIndex++] = texture.source;
    bindGroupResources[bindIndex++] = texture.style;
  }
  const bindGroup = new BindGroup.BindGroup(bindGroupResources);
  cachedGroups[key] = bindGroup;
  return bindGroup;
}

exports.getTextureBatchBindGroup = getTextureBatchBindGroup;
//# sourceMappingURL=getTextureBatchBindGroup.js.map
