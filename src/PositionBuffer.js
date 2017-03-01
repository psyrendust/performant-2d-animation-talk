function noop() {}

export default class PositionBuffer {
  constructor(container) {
    this._container = container;
    this._shouldCapture = false;
    document.addEventListener('mousedown', this._onMouseDown, true);
    document.addEventListener('mouseup', this._onMouseUp, true);
    this._container.addEventListener('mousemove', this._onMouseMove, true);
    this._reset();
  }

  get x() {
    return this._x;
  }

  get y() {
    return this._y;
  }

  get isActive() {
    return this._shouldCapture;
  }

  /**
   * Update the current x/y coords only if `_shouldCapture` is `true`.
   * @param  {MouseEvent}  evt  The {@link MouseEvent} object.
   */
  _update(evt) {
    // if (this._shouldCapture) {
      this._x = evt.offsetX;
      this._y = evt.offsetY;
    // }
  }

  /**
   * Handle mouse down events.
   * @param  {MouseEvent}  evt  The {@link MouseEvent} object.
   */
  _onMouseDown = (evt) => {
    this._shouldCapture = true;
    this._update(evt);
  }

  /**
   * Handle mouse move events.
   * @param  {MouseEvent}  evt  The {@link MouseEvent} object.
   */
  _onMouseMove = (evt) => {
    this._update(evt);
  }

  /**
   * Handle mouse up events.
   * @param  {MouseEvent}  evt  The {@link MouseEvent} object.
   */
  _onMouseUp = (evt) => {
    this._shouldCapture = false;
    this._update(evt);
    this._reset();
  }

  _reset() {
    this._x = -50000;
    this._y = -50000;
  }

  destroy() {
    document.removeEventListener('mousedown', this._onMouseDown, true);
    document.removeEventListener('mouseup', this._onMouseUp, true);
    this._container.removeEventListener('mousemove', this._onMouseMove, true);
  }
}
