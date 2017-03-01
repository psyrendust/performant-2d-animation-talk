/**
 * The {@link Vector2} object represents a location in a two-dimensional
 * coordinate system, where `x` represents the horizontal axis, and `y`
 * represents the vertical axis.
 *
 * @example <caption>Creating a new 2D vector at `(0,0)`</caption>
 * const vec2 = new Vector2();
 *
 * @interface
 */
export default class Vector2 {
  /**
   * Creates a new 2D vector. If you pass no parameters to this method, a 2D
   * vector is created at `(0,0)`.
   * @param  {Number}  x=0  The horizontal coordinate.
   * @param  {Number}  y=0  The vertical coordinate.
   */
  constructor(x, y) {
    /**
     * The horizontal coordinate of the 2D vector.
     * @type  {Number}
     * @default  0
     */
    this.x = x || 0;

    /**
     * The vertical coordinate of the 2D vector.
     * @type  {Number}
     * @default  0
     */
    this.y = y || 0;
  }

  /**
   * Adds the coordinates of another {@link Vector2} to the coordinates of this
   * {@link Vector2}.
   * @param  {Vector2}  vec2  The {@link Vector2} to be added.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  add(vec2) {
    this.x += vec2.x;
    this.y += vec2.y;
    return this;
  }

  /**
   * Adds the scalar value `s` to the coordinates of this {@link Vector2}.
   * @param  {Number}  s  The {@link Number} to be added.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  addScalar(s) {
    this.x += s;
    this.y += s;
    return this;
  }

  /**
   * Creates a copy of this {@link Vector2} object.
   * @return  {Vector2}  The new {@link Vector2} object.
   */
  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * Copies all of the vector data from the source {@link Vector2} object into
   * the calling {@link Vector2} object.
   * @param  {Vector2}  vec2  The {@link Vector2} to copy.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  copy(vec2) {
    this.set(vec2.x, vec2.y);
    return this;
  }

  /**
   * Determines whether two {@link Vector2}s are equal. Two {@link Vector2}s are
   * equal if they have the same `x` and `y` values.
   * @param  {Vector2}  vec2  The {@link Vector2} to be compared.
   * @returns  {Boolean}  A value of `true` if the object is equal to this
   *   {@link Vector2} object; otherwise `false` if it is not equal.
   */
  equals(vec2) {
    return (vec2.x === this.x) && (vec2.y === this.y);
  }

  /**
   * Determines a {@link Vector2} between the source {@link Vector2} and the calling
   * {@link Vector2}. The parameter `f` determines where the new interpolated
   * {@link Vector2} is located relative to the source {@link Vector2} `vec2` and
   * the calling {@link Vector2}. The closer the value of the parameter `f` is to
   * `1.0`, the closer the interpolated {@link Vector2} is to the calling
   * {@link Vector2}. The closer the value of `f` is to `0`, the closer the
   * interpolated {@link Vector2} is to the source {@link Vector2} `vec2`.
   * @param  {Vector2}  vec2  The source {@link Vector2}.
   * @param  {Number}  f  The level of interpolation between the source
   *   {@link Vector2} and the calling {@link Vector2}. Indicates where the new
   *   {@link Vector2} will be, along the line between source {@link Vector2} and
   *   `vec2`. If `f=0`, the calling {@link Vector2} is returned; if `f=1`, `vec2`
   *   is returned.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  lerp(vec2, f) {
    this.x += (vec2.x - this.x) * f;
    this.y += (vec2.y - this.y) * f;
    return this;
  }

  /**
   * Determines a {@link Vector2} between two specified {@link Vector2}s. The
   * parameter `f` determines where the new interpolated {@link Vector2} is located
   * relative to the two {@link Vector2}s specified by parameters `v1` and `v2`. The
   * closer the value of the parameter `f` is to `1.0`, the closer the interpolated
   * {@link Vector2} is to the first {@link Vector2} `v1`. The closer the value
   * of `f` is to `0`, the closer the interpolated {@link Vector2} is to the
   * second {@link Vector2} `v2`.
   * @param  {Vector2}  v1  The first {@link Vector2}.
   * @param  {Vector2}  v2  The second {@link Vector2}.
   * @param  {Number}  f  The level of interpolation between the two {@link Vector2}s.
   *   Indicates where the new {@link Vector2} will be, along the line between `v1` and
   *   `v2`. If `f=1`, `v1` is returned; if `f=0`, `v2` is returned.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  lerpVectors(v1, v2, f) {
    return this.copy(v1).lerp(v2, f);
  }

  /**
   * Multiplies the coordinates of another {@link Vector2} by the coordinates of
   * this {@link Vector2}.
   * @param  {Vector2}  vec2  The {@link Vector2} to be multiplied.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  multiply(vec2) {
    this.x *= vec2.x;
    this.y *= vec2.y;
    return this;
  }

  /**
   * Multiplies the scalar value by the coordinates of this {@link Vector2}.
   * @param  {Vector2}  s  The {@link Number} to be multiplied.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  multiplyScalar(s) {
    if (isFinite(s)) {
      this.x *= s;
      this.y *= s;
    } else {
      this.x = 0;
      this.y = 0;
    }
    return this;
  }

  /**
   * Subtracts the coordinates of another {@link Vector2} from the coordinates of
   * this {@link Vector2}.
   * @param  {Vector2}  vec2  The {@link Vector2} to be subtracted.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  sub(vec2) {
    this.x -= vec2.x;
    this.y -= vec2.y;
    return this;
  }

  /**
   * Subtracts the scalar value from the coordinates of this {@link Vector2}.
   * @param  {Number}  s  The {@link Number} to be subtracted.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  subScalar(s) {
    this.x -= s;
    this.y -= s;
    return this;
  }

  /**
   * Sets the coordinates of the source {@link Vector2} to the the new coordinates
   * as specified by the parameters `x` and `y`. If `y` is omitted, both `x` and
   * `y` will be set to `x`.
   * @param  {Number}  [x=0]  The horizontal coordinate.
   * @param  {Number}  [y=0]  The vertical coordinate.
   * @returns  {Vector2}  The calling {@link Vector2} object.
   */
  set(x, y) {
    this.x = x || 0;
    this.y = y || ((y !== 0) ? this.x : 0);
    return this;
  }

  /**
   * Return the coordinates represented as a string.
   * @return  {String}  The coordinates represented as a string in the format `'Vector2(x, y)'`.
   */
  toString() {
    return `Vector2(${this.x}, ${this.y})`;
  }
}
