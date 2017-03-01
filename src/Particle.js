'use strict';
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
    this._range = [0, textureArray.length - 1];
    this._step = 100 / this._range[1] / 100;
    this.graphic = new extras.AnimatedSprite(textureArray);
    this._delta = new Point(0, 0);
    this._prev = new Point(0, 0);
    this._velocity = new Point(1, 1);
    this._origin = new Point(anchorPoint.x, anchorPoint.y);
    this.graphic.anchor.set(0.5, 0.5);
    this.graphic.position.x = this._origin.x;
    this.graphic.position.y = this._origin.y;
    this.graphic.alpha = 0.2;
    this._frame = 0;
  }

  move(position) {
    // Make a copy of the previous position.
    this._prev.copy(this.graphic.position);

    // Set the graphic to the new position.
    this.graphic.position.x = this.x += .1 * this._velocity.x;
    this.graphic.position.y = this.y += .1 * this._velocity.y;

    // Calculate the distance between the previous update
    // position and the current position.
    this._distanceFromPrevUpdate = sqrt(pow(this._prev.x - this.graphic.x, 2), pow(this._prev.y - this.graphic.y, 2));

    // // Calculate the distance between the mouse position and the
    // // current position.
    // this._distanceFromMouse = sqrt(pow(position.x - this.graphic.x, 2), pow(position.y - this.graphic.y, 2));
    // // Find the percent value of the distance from the mouse
    // // position and the total number of textures.
    // this._percentFromMouse = this._distanceFromMouse / this._range[1];

    // // Calculate the current frame based on the distance
    // // from the origin.
    // this._frame = this._range[1] - Math.round(this._percentFromMouse * 10);

    // Check if we have moved since we last updated and
    // set the resting state.
    if (this._distanceFromPrevUpdate < 0.01) {
      this._isResting = true;
    } else {
      this._isResting = false;
    }
  }

  update(position) {
    this._delta.x = this.x - position.x;
    this._delta.y = this.y - position.y;
    this._distance = sqrt(pow(this._delta.x, 2) + pow(this._delta.y, 2));
    if (this._distance <= this._threshold) {
      this._distanceDelta = this._threshold - this._distance;
      this._angle = atan2(this._delta.y, this._delta.x);
      this._velocity.x = cos(this._angle) * this._distanceDelta;
      this._velocity.y = sin(this._angle) * this._distanceDelta;
    } else {
      this._velocity.x = this._origin.x - this.x;
      this._velocity.y = this._origin.y - this.y;
    }
    this.move(position);
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
    this._velocity = null;
  }
}
