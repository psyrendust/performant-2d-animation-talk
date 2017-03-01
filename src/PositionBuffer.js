function noop() {}

export default class PositionBuffer {
  constructor(container) {
    this._container = container;
    this._shouldCapture = false;
    document.body.addEventListener('mousedown', this._onMouseDown, false);
    document.body.addEventListener('mouseup', this._onMouseUp, false);
    document.body.addEventListener('mousemove', this._onMouseMove, false);
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
    this._x = evt.offsetX;
    this._y = evt.offsetY;
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
    document.body.removeEventListener('mousedown', this._onMouseDown, false);
    document.body.removeEventListener('mouseup', this._onMouseUp, false);
    document.body.removeEventListener('mousemove', this._onMouseMove, false);
  }
}
