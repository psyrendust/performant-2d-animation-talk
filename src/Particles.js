'use strict';
import {
  extras,
  Graphics,
  particles,
  Rectangle,
} from 'pixi.js';
import Particle from './Particle';
import ColorRange from './ColorRange';

function getTexture(renderer, radius, fillColor) {
  const graphic = new Graphics();
  graphic.beginFill(fillColor);
  graphic.drawCircle(0, 0, radius);
  graphic.pivot.set(radius / 2);
  graphic.endFill();
  return renderer.generateTexture(graphic);
}

function getParticleSize(width, height, radius = 1, totalRuns = 1) {
  const cols = Math.ceil(width / radius);
  const rows = Math.ceil(height / radius);
  const totalParticles = cols * rows;
  if (totalParticles > 50000) {
    if (totalRuns < 50) {
      return getParticleSize(width, height, radius + 1, totalRuns + 1);
    }
  }
  return {
    cols,
    radius,
    rows,
    totalParticles,
    totalRuns,
  }
}

export default class Particles {
  constructor(renderer, threshold) {
    this._renderer = renderer;
    this._threshold = threshold;
    this.particles = [];
    this.particleContainer = new particles.ParticleContainer(30000, {
        alpha: false,
        position: true,
        rotation: false,
        scale: false,
        uvs: false,
    }, 30000);
  }

  init() {
    this.destroyParticles();
    this.range = [];

    // We want to stay below 30,000 - 40,000 to keep things performant.
    // The default is 15,000. We are capping at ~20,000 for 100% width/height canvas.
    const {cols, radius, rows, totalParticles, totalRuns} = getParticleSize(this._renderer.width, this._renderer.height);
    console.log(`cols:${cols}, radius:${radius}, rows:${rows}, totalParticles:${totalParticles}, totalRuns:${totalRuns}`); // eslint-disable-line

    // Create textures for all particle states.
    this.textureArray = ColorRange.RAINBOW_HEX_NUMBER_PASTEL.map((color, index) => getTexture(this._renderer, radius, color));
    this.totalTextures = this.textureArray.length - 1;

    // Create all particles
    for (let col = 0; col < cols; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const particle = new Particle([this.textureArray[38]], {
          x: (col * radius) + 5,
          y: (row * radius) + 5,
        }, this._threshold);
        this.particles.push(particle);
        this.particleContainer.addChild(particle.graphic);
      }
    }
    this._canUpdate = true;
    this._isResting = true;
  }

  get isResting() {
    return this._isResting;
  }

  destroyParticles() {
    this._canUpdate = false;
    this.particles.forEach((particle) => {
      this.particleContainer.removeChild(particle.graphic);
      particle.destroy();
    });
    this.particles = [];
  }

  update(position) {
    if (!this._canUpdate) return;
    this._isResting = true;
    this.particles.forEach((particle) => {
      particle.update(position);
      if (!particle.isResting) {
        this._isResting = false;
      }
    });
  }

  destroy() {
    this.destroyParticles();
    this.particleContainer.destroy();
    this.particles = null;
    this.particleContainer = null;
  }
}
