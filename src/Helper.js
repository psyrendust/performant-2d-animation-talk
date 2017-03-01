function getBoolean(val) {
  return (!!val) ? 'T' : 'F';
}

export default class Helper {
  constructor(main) {
    this.div = document.querySelector('#helper');
    if (!this.div) {
      this.div = document.createElement('code');
      this.div.setAttribute('id', 'helper');
    }
    document.getElementById('root').appendChild(this.div);
    document.addEventListener('mouseenter', this.onMouseEnter, true);
    document.addEventListener('mouseleave', this.onMouseLeave, true);
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
    if (window.main && window.main.particles && window.main.particles.frames) {
      this.div.textContent = `${window.main.particles.frames.join(', ')}`;
    }
    if (this._isRunning) {
      requestAnimationFrame(this.update);
    }
  }
}
