'use strict';

var EventEmitter = require('eventemitter3');
var uid = require('../../../../utils/data/uid.js');
var _const = require('./const.js');

"use strict";
class Buffer extends EventEmitter {
  /**
   * Creates a new Buffer with the given options
   * @param options - the options for the buffer
   */
  constructor(options) {
    let { data, size } = options;
    const { usage, label, shrinkToFit } = options;
    super();
    /**
     * emits when the underlying buffer has changed shape (i.e. resized)
     * letting the renderer know that it needs to discard the old buffer on the GPU and create a new one
     * @event change
     */
    /**
     * emits when the underlying buffer data has been updated. letting the renderer know
     * that it needs to update the buffer on the GPU
     * @event update
     */
    /**
     * emits when the buffer is destroyed. letting the renderer know that it needs to destroy the buffer on the GPU
     * @event destroy
     */
    /** a unique id for this uniform group used through the renderer */
    this.uid = uid.uid("buffer");
    /**
     * a resource type, used to identify how to handle it when its in a bind group / shader resource
     * @internal
     * @ignore
     */
    this._resourceType = "buffer";
    /**
     * the resource id used internally by the renderer to build bind group keys
     * @internal
     * @ignore
     */
    this._resourceId = uid.uid("resource");
    /**
     * used internally to know if a uniform group was used in the last render pass
     * @internal
     * @ignore
     */
    this._touched = 0;
    /**
     * @internal
     * @ignore
     */
    this._updateID = 1;
    /**
     * should the GPU buffer be shrunk when the data becomes smaller?
     * changing this will cause the buffer to be destroyed and a new one created on the GPU
     * this can be expensive, especially if the buffer is already big enough!
     * setting this to false will prevent the buffer from being shrunk. This will yield better performance
     * if you are constantly setting data that is changing size often.
     * @default true
     */
    this.shrinkToFit = true;
    /**
     * Has the buffer been destroyed?
     * @readonly
     */
    this.destroyed = false;
    if (data instanceof Array) {
      data = new Float32Array(data);
    }
    this._data = data;
    size = size ?? data?.byteLength;
    const mappedAtCreation = !!data;
    this.descriptor = {
      size,
      usage,
      mappedAtCreation,
      label
    };
    this.shrinkToFit = shrinkToFit ?? true;
  }
  /** the data in the buffer */
  get data() {
    return this._data;
  }
  set data(value) {
    this.setDataWithSize(value, value.length, true);
  }
  /** whether the buffer is static or not */
  get static() {
    return !!(this.descriptor.usage & _const.BufferUsage.STATIC);
  }
  set static(value) {
    if (value) {
      this.descriptor.usage |= _const.BufferUsage.STATIC;
    } else {
      this.descriptor.usage &= ~_const.BufferUsage.STATIC;
    }
  }
  /**
   * Sets the data in the buffer to the given value. This will immediately update the buffer on the GPU.
   * If you only want to update a subset of the buffer, you can pass in the size of the data.
   * @param value - the data to set
   * @param size - the size of the data in bytes
   * @param syncGPU - should the buffer be updated on the GPU immediately?
   */
  setDataWithSize(value, size, syncGPU) {
    this._updateID++;
    this._updateSize = size * value.BYTES_PER_ELEMENT;
    if (this._data === value) {
      if (syncGPU)
        this.emit("update", this);
      return;
    }
    const oldData = this._data;
    this._data = value;
    if (oldData.length !== value.length) {
      if (!this.shrinkToFit && value.byteLength < oldData.byteLength) {
        if (syncGPU)
          this.emit("update", this);
      } else {
        this.descriptor.size = value.byteLength;
        this._resourceId = uid.uid("resource");
        this.emit("change", this);
      }
      return;
    }
    if (syncGPU)
      this.emit("update", this);
  }
  /**
   * updates the buffer on the GPU to reflect the data in the buffer.
   * By default it will update the entire buffer. If you only want to update a subset of the buffer,
   * you can pass in the size of the buffer to update.
   * @param sizeInBytes - the new size of the buffer in bytes
   */
  update(sizeInBytes) {
    this._updateSize = sizeInBytes ?? this._updateSize;
    this._updateID++;
    this.emit("update", this);
  }
  /** Destroys the buffer */
  destroy() {
    this.destroyed = true;
    this.emit("destroy", this);
    this.emit("change", this);
    this._data = null;
    this.descriptor = null;
    this.removeAllListeners();
  }
}

exports.Buffer = Buffer;
//# sourceMappingURL=Buffer.js.map
