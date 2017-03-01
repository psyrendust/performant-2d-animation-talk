'use strict';
import './index.css';
import {
  Application,
  Rectangle,
  Point,
} from 'pixi.js';
import Engine from './Engine';
import Particles from './Particles';

class Main {
  constructor() {
    this.appSize = new Rectangle();
    this._updateSize();
    this._init();
    this.position = new Point(-50000, -50000);
    this.engine = new Engine(this.render, this).onUpdate(this.update, this);

    this.particles = new Particles(this.app.renderer, 200);

    this.app.stage.addChild(this.particles.particleContainer);
    this._onResize();
  }

  _init() {
    this.canvas = document.createElement('canvas');
    document.getElementById('root').appendChild(this.canvas);
    window.addEventListener('resize', this._onResize, false);
    window.addEventListener('mousedown', this._onMouseDown, false);
    window.addEventListener('mousemove', this._onMouseMove, false);
    window.addEventListener('mouseup', this._onMouseUp, false);
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
    this.particles.init();
    this.engine.update();
    this._requestId = null;
  }

  _onMouseDown = (evt) => {
    if (!this.engine.isRunning) {
      this.engine.start();
    }
    this._shouldCapture = true;
    this.updatePosition(evt);
  }
  _onMouseMove = (evt) => {
    if (!this._shouldCapture) return;
    if (!this.engine.isRunning) {
      this.engine.start();
    }
    this.updatePosition(evt);
  }
  _onMouseUp = (evt) => {
    this._shouldCapture = false;
    this.position.set(-50000, -50000);
    this.update();
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

  updatePosition(evt) {
    this.position.set(evt.offsetX, evt.offsetY);
    this.update();
  }

  render(timestamp) {
    this.app.render();
    if (this.particles.isResting) {
      requestAnimationFrame(() => {
        this.engine.stop();
      });
    }
  }

  update() {
    this.particles.update(this.position);
  }

  destroy() {
    window.removeEventListener('mousemove', this._onMouseDown, false);
    window.removeEventListener('mousemove', this._onMouseMove, false);
    window.removeEventListener('mouseup', this._onMouseUp, false);
    window.removeEventListener('resize', this._onResize, false);
    this.engine.destroy();
    this.particles.destroy();
    this.app.destroy(true);
    this.engine = null;
    this.particles = null;
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
document.head.querySelector('title').textContent = 'No Buffer Example';
window.main = new Main();
