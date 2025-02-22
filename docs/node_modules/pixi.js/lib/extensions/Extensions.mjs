"use strict";
var ExtensionType = /* @__PURE__ */ ((ExtensionType2) => {
  ExtensionType2["Application"] = "application";
  ExtensionType2["WebGLPipes"] = "webgl-pipes";
  ExtensionType2["WebGLPipesAdaptor"] = "webgl-pipes-adaptor";
  ExtensionType2["WebGLSystem"] = "webgl-system";
  ExtensionType2["WebGPUPipes"] = "webgpu-pipes";
  ExtensionType2["WebGPUPipesAdaptor"] = "webgpu-pipes-adaptor";
  ExtensionType2["WebGPUSystem"] = "webgpu-system";
  ExtensionType2["CanvasSystem"] = "canvas-system";
  ExtensionType2["CanvasPipesAdaptor"] = "canvas-pipes-adaptor";
  ExtensionType2["CanvasPipes"] = "canvas-pipes";
  ExtensionType2["Asset"] = "asset";
  ExtensionType2["LoadParser"] = "load-parser";
  ExtensionType2["ResolveParser"] = "resolve-parser";
  ExtensionType2["CacheParser"] = "cache-parser";
  ExtensionType2["DetectionParser"] = "detection-parser";
  ExtensionType2["MaskEffect"] = "mask-effect";
  ExtensionType2["BlendMode"] = "blend-mode";
  ExtensionType2["TextureSource"] = "texture-source";
  ExtensionType2["Environment"] = "environment";
  ExtensionType2["ShapeBuilder"] = "shape-builder";
  ExtensionType2["Batcher"] = "batcher";
  return ExtensionType2;
})(ExtensionType || {});
const normalizeExtension = (ext) => {
  if (typeof ext === "function" || typeof ext === "object" && ext.extension) {
    if (!ext.extension) {
      throw new Error("Extension class must have an extension object");
    }
    const metadata = typeof ext.extension !== "object" ? { type: ext.extension } : ext.extension;
    ext = { ...metadata, ref: ext };
  }
  if (typeof ext === "object") {
    ext = { ...ext };
  } else {
    throw new Error("Invalid extension type");
  }
  if (typeof ext.type === "string") {
    ext.type = [ext.type];
  }
  return ext;
};
const normalizeExtensionPriority = (ext, defaultPriority) => normalizeExtension(ext).priority ?? defaultPriority;
const extensions = {
  /** @ignore */
  _addHandlers: {},
  /** @ignore */
  _removeHandlers: {},
  /** @ignore */
  _queue: {},
  /**
   * Remove extensions from PixiJS.
   * @param extensions - Extensions to be removed.
   * @returns {extensions} For chaining.
   */
  remove(...extensions2) {
    extensions2.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => this._removeHandlers[type]?.(ext));
    });
    return this;
  },
  /**
   * Register new extensions with PixiJS.
   * @param extensions - The spread of extensions to add to PixiJS.
   * @returns {extensions} For chaining.
   */
  add(...extensions2) {
    extensions2.map(normalizeExtension).forEach((ext) => {
      ext.type.forEach((type) => {
        const handlers = this._addHandlers;
        const queue = this._queue;
        if (!handlers[type]) {
          queue[type] = queue[type] || [];
          queue[type]?.push(ext);
        } else {
          handlers[type]?.(ext);
        }
      });
    });
    return this;
  },
  /**
   * Internal method to handle extensions by name.
   * @param type - The extension type.
   * @param onAdd  - Function handler when extensions are added/registered {@link StrictExtensionFormat}.
   * @param onRemove  - Function handler when extensions are removed/unregistered {@link StrictExtensionFormat}.
   * @returns {extensions} For chaining.
   */
  handle(type, onAdd, onRemove) {
    const addHandlers = this._addHandlers;
    const removeHandlers = this._removeHandlers;
    if (addHandlers[type] || removeHandlers[type]) {
      throw new Error(`Extension type ${type} already has a handler`);
    }
    addHandlers[type] = onAdd;
    removeHandlers[type] = onRemove;
    const queue = this._queue;
    if (queue[type]) {
      queue[type]?.forEach((ext) => onAdd(ext));
      delete queue[type];
    }
    return this;
  },
  /**
   * Handle a type, but using a map by `name` property.
   * @param type - Type of extension to handle.
   * @param map - The object map of named extensions.
   * @returns {extensions} For chaining.
   */
  handleByMap(type, map) {
    return this.handle(
      type,
      (extension) => {
        if (extension.name) {
          map[extension.name] = extension.ref;
        }
      },
      (extension) => {
        if (extension.name) {
          delete map[extension.name];
        }
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions with a `name` property.
   * @param type - Type of extension to handle.
   * @param map - The array of named extensions.
   * @param defaultPriority - Fallback priority if none is defined.
   * @returns {extensions} For chaining.
   */
  handleByNamedList(type, map, defaultPriority = -1) {
    return this.handle(
      type,
      (extension) => {
        const index = map.findIndex((item) => item.name === extension.name);
        if (index >= 0)
          return;
        map.push({ name: extension.name, value: extension.ref });
        map.sort((a, b) => normalizeExtensionPriority(b.value, defaultPriority) - normalizeExtensionPriority(a.value, defaultPriority));
      },
      (extension) => {
        const index = map.findIndex((item) => item.name === extension.name);
        if (index !== -1) {
          map.splice(index, 1);
        }
      }
    );
  },
  /**
   * Handle a type, but using a list of extensions.
   * @param type - Type of extension to handle.
   * @param list - The list of extensions.
   * @param defaultPriority - The default priority to use if none is specified.
   * @returns {extensions} For chaining.
   */
  handleByList(type, list, defaultPriority = -1) {
    return this.handle(
      type,
      (extension) => {
        if (list.includes(extension.ref)) {
          return;
        }
        list.push(extension.ref);
        list.sort((a, b) => normalizeExtensionPriority(b, defaultPriority) - normalizeExtensionPriority(a, defaultPriority));
      },
      (extension) => {
        const index = list.indexOf(extension.ref);
        if (index !== -1) {
          list.splice(index, 1);
        }
      }
    );
  }
};

export { ExtensionType, extensions, normalizeExtensionPriority };
//# sourceMappingURL=Extensions.mjs.map
