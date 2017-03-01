function getBoolean(val) {
  return (!!val) ? 'T' : 'F';
}

export default class Helper {
  constructor(app) {
    this.div = document.querySelector('#helper');
    if (!this.div) {
      this.div = document.createElement('code');
      this.div.setAttribute('id', 'helper');
    }
    document.getElementById('root').appendChild(this.div);
    document.addEventListener('mouseenter', this.onMouseEnter, true);
    document.addEventListener('mouseleave', this.onMouseLeave, true);
    this.app = app;
    this.update();
  }

  onMouseEnter = () => {
    this._isRunning = true;
    this.update();
  }

  onMouseLeave = () => {
    this._isRunning = false;
    this.update();
  }

  update = () => {
    this.div.textContent = `{isRunning: ${getBoolean(this.app.engine.isRunning)}, x: ${this.app.positionBuffer.x}, y: ${this.app.positionBuffer.y}}`;
    if (this._isRunning) {
      requestAnimationFrame(this.update);
    }
  }
}
