import EventEmitter from 'eventemitter3';

const UPDATE = 'update';

const UPDATE_COMPLETE = 'update.complete';

const UPDATE_START = 'update.start';

function getTime(timestamp) {
  return timestamp || performance.now();
}

export default class Engine {
  /**
   * @param  {Function}  renderer  The listener function to call after all updates have occured.
   * @param  {Function}  [context]  The context for the listener function.
   */
  constructor(renderer, context) {
    if (typeof renderer !== 'function') {
      throw new TypeError('Expected "renderer" to be a Function');
    }

    /**
     * Internal {@link EventEmitter} used to manage events.
     * @type  {EventEmitter}
     */
    this._emitter = new EventEmitter();

    /**
     * Internal value that represents whether or not this {@link Engine} has and listener functions
     * bound to {@link Engine#onUpdate}, {@link Engine#onUpdateComplete},
     * or {@link Engine#onUpdateStart}.
     * @type  {Boolean}
     * @default false
     */
    this._hasListeners = false;

    /**
     * Internal value that represents whether or not this {@link Engine} is currently executing any
     * update listeners.
     * @type  {Boolean}
     * @default false
     */
    this._inUpdate = false;

    /**
     * Internal value that represents whether or not this {@link Engine} is currently running.
     * @type {Boolean}
     * @default false
     */
    this._isRunning = false;

    /**
     * Internal value that represents the timestamp for the previous {@link requestAnimationFrame}.
     * @type  {Number}
     * @default 1
     */
    this._prevTime = 1;

    /**
     * The current request ID.
     * @type  {Number}
     * @default null
     */
    this._requestId = null;

    /**
     * The render function to call once a {@link Engine#update} call completes.
     * @type  {Function}
     */
    this.render = renderer.bind(context);
  }

  /**
   * Value that represents whether or not this {@link Engine} is currently running.
   * @return  {Boolean}  If `true` the {@link Engine#start} has been called; otherwise is `false`
   *   if {@link Engine#stop} has been called.
   */
  get isRunning() {
    return this._isRunning;
  }

  /**
   * Call a function on a {@link Engine.UPDATE} event, which happens once every requestAnimationFrame.
   * @param  {Function}  fn  The listener function to call on {@link Engine.UPDATE} events.
   * @param  {Function}  [context]  The context for the listener function.
   */
  onUpdate(fn, context) {
    this._emitter.on(UPDATE, fn, context);
    this._checkListeners();
    return this;
  }

  /**
   * Call a function on a {@link Engine.UPDATE_COMPLETE} event, which happens once every
   * requestAnimationFrame and immediately follows all {@link Engine.UPDATE} events.
   * @param  {Function}  fn  The listener function to call on {@link Engine.UPDATE_COMPLETE} events.
   * @param  {Function}  [context]  The context for the listener function.
   */
  onUpdateComplete(fn, context) {
    this._emitter.on(UPDATE_COMPLETE, fn, context);
    this._checkListeners();
    return this;
  }

  /**
   * Call a function on a {@link Engine.UPDATE_START} event, which happens once every
   * requestAnimationFrame and immediately preceeds all {@link Engine.UPDATE} events.
   * @param  {Function}  fn  The listener function to call on {@link Engine.UPDATE_START} events.
   * @param  {Function}  [context]  The context for the listener function.
   */
  onUpdateStart(fn, context) {
    this._emitter.on(UPDATE_START, fn, context);
    this._checkListeners();
    return this;
  }

  /**
   * Remove a function bound to the {@link Engine.UPDATE} event.
   * @param  {Function}  fn  The listener function to remove that is bound to the {@link Engine.UPDATE} event.
   * @param  {Function}  [context]  The context for the listener function.
   */
  removeUpdate(fn, context) {
    this._emitter.off(UPDATE, fn, context);
    this._checkListeners();
    return this;
  }

  /**
   * Remove a function bound to the {@link Engine.UPDATE_COMPLETE} event.
   * @param  {Function}  fn  The listener function to remove that is bound to the {@link Engine.UPDATE_COMPLETE} event.
   * @param  {Function}  [context]  The context for the listener function.
   */
  removeUpdateComplete(fn, context) {
    this._emitter.off(UPDATE_COMPLETE, fn, context);
    this._checkListeners();
    return this;
  }

  /**
   * Remove a function bound to the {@link Engine.UPDATE_START} event.
   * @param  {Function}  fn  The listener function to remove that is bound to the {@link Engine.UPDATE_START} event.
   * @param  {Function}  [context]  The context for the listener function.
   */
  removeUpdateStart(fn, context) {
    this._emitter.off(UPDATE_START, fn, context);
    this._checkListeners();
    return this;
  }

  /**
   * Start the {@link Engine} instance.
   */
  start = () => {
    if (this._isRunning) return;
    this._isRunning = true;
    requestAnimationFrame(this._rAF);
  }

  /**
   * Advance the {@link Engine} instance forward by one step. This call does not use
   * `requestAnimationFrame`, so it should only be used within a function that is called by
   * `requestAnimationFrame`.
   * @param  {DOMHighResTimeStamp}  timestamp  The {@link DOMHighResTimeStamp} created by
   *   {@link requestAnimationFrame}.
   */
  step = (timestamp) => {
    if (this._isRunning || this._inUpdate) return;
    this._rAF(timestamp, true);
  }

  /**
   * Stops the {@link Engine} instance.
   */
  stop = () => {
    this._isRunning = false;
    if (this._requestId !== null) {
      cancelAnimationFrame(this._requestId);
      this._requestId = null;
    }
  }

  /**
   * Trigger an update and then a render call.
   *
   * Only execute the update logic if the following four conditions are `true`:
   *
   * - The {@link Engine} instance is not already executing the logic in this loop.
   * - The {@link Engine} instance is not already executing a call to {@link requestAnimationFrame}.
   * - The {@link Engine} instance has at least 1 listener function bound to an update event.
   * - The current timestamp is greater than the previous update timestamp.
   *
   * @param  {DOMHighResTimeStamp}  timestamp  The {@link DOMHighResTimeStamp} created by
   *   {@link requestAnimationFrame}.
   */
  update = (timestamp) => {
    this._currTime = getTime(timestamp);
    this._deltaTime = 0;
    if (!this._inUpdate && !this._requestId && this._hasListeners && (this._currTime > this._prevTime)) {
      this._inUpdate = true;
      this._deltaTime = this._currTime - this._prevTime;
      this._emitter.emit(UPDATE_START, this._deltaTime);
      this._emitter.emit(UPDATE, this._deltaTime);
      this._emitter.emit(UPDATE_COMPLETE, this._deltaTime);
      this.render();
      this._inUpdate = false;
    }
    this._prevTime = this._currTime;
  }

  /**
   * Check if there are any listener functions bound to an update event.
   */
  _checkListeners() {
    this._hasListeners = false;
    if (this._emitter.listeners(UPDATE, true)) {
      this._hasListeners = true;
    } else if (this._emitter.listeners(UPDATE_COMPLETE, true)) {
      this._hasListeners = true;
    } else if (this._emitter.listeners(UPDATE_START, true)) {
      this._hasListeners = true;
    }
  }

  /**
   * The {@link requestAnimationFrame} loop function for the {@link Engine} instance.
   *
   * Only execute the logic in the loop if the following three conditions are `true`:
   *
   * - The {@link Engine} instance is not already executing the logic in this loop.
   * - The {@link Engine} instance is on and running or the `runOnce` option was passed and is `true`.
   * - The {@link DOMHighResTimeStamp} is not the same as the {@link DOMHighResTimeStamp} that was
   *     recorded the last time this {@link requestAnimationFrame} loop function ran.
   *
   * @param  {DOMHighResTimeStamp}  timestamp  The {@link DOMHighResTimeStamp} created by
   *   {@link requestAnimationFrame}.
   * @param  {Boolean}  runOnce  If `true` only execute the {@link requestAnimationFrame} loop once
   *   if the {@link Engine} instance is not already running.
   */
  _rAF = (timestamp, runOnce) => {
    this._requestId = null;
    if ((this._isRunning || runOnce) && this._hasListeners) {
      this.update(timestamp);
      this._requestId = requestAnimationFrame(this._rAF);
    }
  }

  destroy() {
    this.stop();
    this._emitter.removeAllListeners();
    this._currTime = null;
    this._deltaTime = null;
    this._emitter = null;
    this._inUpdate = null;
    this._isRunning = null;
    this._prevTime = null;
    this._requestId = null;
  }
}
