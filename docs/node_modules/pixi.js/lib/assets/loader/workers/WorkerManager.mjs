import WorkerInstance from '../../../_virtual/checkImageBitmap.worker.mjs';
import WorkerInstance$1 from '../../../_virtual/loadImageBitmap.worker.mjs';

"use strict";
let UUID = 0;
let MAX_WORKERS;
class WorkerManagerClass {
  constructor() {
    this._initialized = false;
    this._createdWorkers = 0;
    this._workerPool = [];
    this._queue = [];
    this._resolveHash = {};
  }
  isImageBitmapSupported() {
    if (this._isImageBitmapSupported !== void 0)
      return this._isImageBitmapSupported;
    this._isImageBitmapSupported = new Promise((resolve) => {
      const { worker } = new WorkerInstance();
      worker.addEventListener("message", (event) => {
        worker.terminate();
        WorkerInstance.revokeObjectURL();
        resolve(event.data);
      });
    });
    return this._isImageBitmapSupported;
  }
  loadImageBitmap(src, asset) {
    return this._run("loadImageBitmap", [src, asset?.data?.alphaMode]);
  }
  async _initWorkers() {
    if (this._initialized)
      return;
    this._initialized = true;
  }
  _getWorker() {
    if (MAX_WORKERS === void 0) {
      MAX_WORKERS = navigator.hardwareConcurrency || 4;
    }
    let worker = this._workerPool.pop();
    if (!worker && this._createdWorkers < MAX_WORKERS) {
      this._createdWorkers++;
      worker = new WorkerInstance$1().worker;
      worker.addEventListener("message", (event) => {
        this._complete(event.data);
        this._returnWorker(event.target);
        this._next();
      });
    }
    return worker;
  }
  _returnWorker(worker) {
    this._workerPool.push(worker);
  }
  _complete(data) {
    if (data.error !== void 0) {
      this._resolveHash[data.uuid].reject(data.error);
    } else {
      this._resolveHash[data.uuid].resolve(data.data);
    }
    this._resolveHash[data.uuid] = null;
  }
  async _run(id, args) {
    await this._initWorkers();
    const promise = new Promise((resolve, reject) => {
      this._queue.push({ id, arguments: args, resolve, reject });
    });
    this._next();
    return promise;
  }
  _next() {
    if (!this._queue.length)
      return;
    const worker = this._getWorker();
    if (!worker) {
      return;
    }
    const toDo = this._queue.pop();
    const id = toDo.id;
    this._resolveHash[UUID] = { resolve: toDo.resolve, reject: toDo.reject };
    worker.postMessage({
      data: toDo.arguments,
      uuid: UUID++,
      id
    });
  }
}
const WorkerManager = new WorkerManagerClass();

export { WorkerManager };
//# sourceMappingURL=WorkerManager.mjs.map
