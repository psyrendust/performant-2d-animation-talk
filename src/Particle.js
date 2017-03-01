import {
  extras,
  Point,
} from 'pixi.js';

const atan2 = Math.atan2;
const cos = Math.cos;
const pow = Math.pow;
const sin = Math.sin;
const sqrt = Math.sqrt;

export default class Particle {
  constructor(textureArray, anchorPoint, threshold) {
    this._threshold = threshold;
    this._range = [0, textureArray.length];
    this._step = 100 / this._range[1] / 100;
    this.graphic = new extras.AnimatedSprite(textureArray);
    this._delta = new Point(0, 0);
    this._force = new Point(1, 1);
    this._origin = new Point(anchorPoint.x, anchorPoint.y);
    this.graphic.anchor.set(0.5, 0.5);
    this.graphic.position.x = this._origin.x;
    this.graphic.position.y = this._origin.y;
    this.graphic.alpha = 0.5;
    this._frame = 0;
    this.graphic.gotoAndStop(0);
  }

  move() {
    this.graphic.position.x = this.x += .1 * this._force.x;
    this.graphic.position.y = this.y += .1 * this._force.y;
    // this._distFromOrigin = sqrt(pow(this._origin.x - this.graphic.x, 2), pow(this._origin.y - this.graphic.y, 2));
    // this._frame = Math.round(this._distFromOrigin * this._threshold);
    // this.graphic.gotoAndStop(this._frame);
    // this.graphic.alpha = this._step * this._frame;
    // console.log(this.graphic.alpha);
  }

  update(position) {
    this._delta.x = this.x - position.x;
    this._delta.y = this.y - position.y;
    this._distance = sqrt(pow(this._delta.x, 2) + pow(this._delta.y, 2));
    if (this._distance <= this._threshold) {
      this._distanceDelta = this._threshold - this._distance;
      this._frame = this._distanceDelta / this._threshold;
      this._temp = atan2(this._delta.y, this._delta.x);
      this._force.x = cos(this._temp) * this._distanceDelta;
      this._force.y = sin(this._temp) * this._distanceDelta;
      this._isResting = false;
    } else {
      this._force.x = this._origin.x - this.x;
      this._force.y = this._origin.y - this.y;
      this._frame = 0;
      this._isResting = true;
    }
    this.move();
  }

  get isResting() {
    return this._isResting;
  }

  get position() {
    return this.graphic.position;
  }

  set position(val) {
    this.graphic.position = val;
  }

  get x() {
    return this.graphic.x;
  }

  set x(val) {
    this.graphic.x = val;
  }

  get y() {
    return this.graphic.y;
  }

  set y(val) {
    this.graphic.y = val;
  }

  destroy() {
    this.graphic.destroy();
    this.graphic = null;
    this._delta = null;
    this._frame = null;
    this._origin = null;
    this._range = null;
    this._step = null;
    this._threshold = null;
    this._force = null;
  }
}
