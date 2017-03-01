import './index.css';
import {
  Application,
  Rectangle,
} from 'pixi.js';
import Engine from './Engine';
import Helper from './Helper';
import Particles from './Particles';
import PositionBuffer from './PositionBuffer';

class App {
  constructor() {
    this.appSize = new Rectangle(0, 0, 800, 600);
    this._initApp();
    this.engine = new Engine(this.render, this);
    this.engine.onUpdate(this.update, this);
    this.particles = new Particles(this.app.renderer, 10, 10);
    this.positionBuffer = new PositionBuffer(this.app.view, {
      maxSize: this.appSize,
      onStart: this.engine.start,
      onStop: this.engine.stop,
    });
    this.app.stage.addChild(this.particles.particleContainer);
    this.engine.update();
    this.engine.start();
  }

  _initApp() {
    this.app = new Application(this.appSize.width, this.appSize.height, {
        backgroundColor: 0x323232,
        roundPixels: false,
      },
      false,
      true
    );
    this.app.ticker.autoStart = false;
    this.app.ticker.stop();
    document.getElementById('root').appendChild(this.app.view);
  }

  render(timestamp) {
    this.app.renderer.render(this.app.stage);
  }

  update(timestamp) {
    this.particles.update(this.positionBuffer);
  }

  destroy() {
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
if (window.app && window.app.destroy) {
  window.app.destroy();
}
window.app = new App();
