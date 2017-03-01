import './index.css';
import {
  Application,
  Rectangle,
} from 'pixi.js';
import Engine from './Engine';
import Helper from './Helper';
import Particles from './Particles';
import PositionBuffer from './PositionBuffer';

class Main {
  constructor() {
    this.appSize = new Rectangle();
    this._updateSize();
    this._init();
    this.engine = new Engine(this.render, this).onUpdate(this.update, this);
    this.particles = new Particles(this.app.renderer);
    this.positionBuffer = new PositionBuffer(this.app.view);
    this.app.stage.addChild(this.particles.particleContainer);
    this._onResize();
  }

  _init() {
    this.canvas = document.createElement('canvas');
    document.getElementById('root').appendChild(this.canvas);
    window.addEventListener('resize', this._onResize, false);
    window.addEventListener('mousemove', this._onMouseMove, false);
    this.app = new Application(this.appSize.width, this.appSize.height, {
        autoResize: true,
        backgroundColor: 0x323232,
        roundPixels: false,
        view: this.canvas,
      },
      false,
      true
    );
    this.app.ticker.autoStart = false;
    this.app.stop();
  }

  _bufferResize = () => {
    this.canvas.style.width = `${this.appSize.width}px`;
    this.canvas.style.height = `${this.appSize.height}px`;
    this.app.renderer.resize(this.appSize.width, this.appSize.height);
    this.particles.init(this.appSize);
    this.engine.update();
    this._requestId = null;
  }

  _onMouseMove = (evt) => {
    if (!this.engine.isRunning) {
      this.engine.start();
    }
  }

  _onResize = () => {
    this._updateSize();
    if (this._requestId) {
      cancelAnimationFrame(this._requestId);
      this._isRequired = null;
    }
    this._requestId = requestAnimationFrame(this._bufferResize);
  }

  _updateSize() {
    this.appSize.width = document.body.clientWidth;
    this.appSize.height = document.body.clientHeight;
  }

  render(timestamp) {
    this.app.ticker.update(timestamp);
    this.app.render();
    if (this.particles.isResting) {
      requestAnimationFrame(() => {
        this.engine.stop();
      });
    }
  }

  update(timestamp) {
    this.particles.update(this.positionBuffer);
  }

  destroy() {
    window.removeEventListener('mousemove', this._onMouseMove, false);
    window.removeEventListener('resize', this._onResize, false);
    this.engine.destroy();
    this.particles.destroy();
    this.positionBuffer.destroy();
    this.app.destroy(true);
    this.engine = null;
    this.particles = null;
    this.positionBuffer = null;
    this.app = null;
  }
}

// This is needed for hot-module-replacement
if (module.hot) {
  module.hot.accept();
}
if (window.main && window.main.destroy) {
  window.main.destroy();
}
window.main = new Main();
window.helper = new Helper();
