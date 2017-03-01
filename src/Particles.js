import {
  extras,
  Graphics,
  particles,
  Rectangle,
} from 'pixi.js';
import Particle from './Particle';
import ColorRange from './ColorRange';

function getTexture(renderer, size, fillColor) {
  const graphic = new Graphics();
  graphic.beginFill(fillColor);
  graphic.drawCircle(0, 0, size.width);
  graphic.pivot.set(size.width / 2, size.height / 2);
  graphic.endFill();
  return renderer.generateTexture(graphic);
}

export default class Particles {
  constructor(renderer, width, height) {
    const particleSize = new Rectangle(0, 0, width, height);
    // We want to stay below 30,000 - 40,000 to keep things performant.
    // The default is 15,000. We are targeting around 30,000 for a 800x600 container.
    const cols = renderer.width / particleSize.width;
    const rows = renderer.height / particleSize.height;
    const totalParticles = cols * rows;

    this.particleContainer = new particles.ParticleContainer(totalParticles, {
        alpha: false,
        position: true,
        rotation: false,
        scale: false,
        uvs: false,
    });

    // Create textures for all particle states.
    this.textureArray = ColorRange.RAINBOW_HEX_NUMBER_PASTEL.map((color, index) => getTexture(renderer, particleSize, color));

    // Create all particles
    this.particles = [];
    for (let col = 0; col < cols; col += 1) {
      for (let row = 0; row < rows; row += 1) {
        const particle = new Particle(this.textureArray, {
          x: col * (particleSize.width) + 5,
          y: row * (particleSize.height) + 5,
        }, 140);
        this.particles.push(particle);
        this.particleContainer.addChild(particle.graphic);
      }
    }
    this.frames = [];
    this._isResting = true;
  }

  get isResting() {
    return this._isResting;
  }

  update(position) {
    this.frames = [];
    this._isResting = true;
    this.particles.forEach((particle, i) => {
      particle.update(position);
      if (!particle.isResting) {
        this._isResting = false;
        this.frames.push(particle._frame);
      }
    });
  }

  destroy() {
    this.particles.forEach((particle) => {
      particle.destroy();
    });
    this.particles = null;
  }
}
